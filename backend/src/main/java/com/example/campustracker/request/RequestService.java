package com.example.campustracker.request;

import com.example.campustracker.user.User;
import com.example.campustracker.user.UserRepository;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class RequestService {
    private final ServiceRequestRepository requests;
    private final UserRepository users;
    private final RequestCommentRepository comments;

    public RequestService(
            ServiceRequestRepository requests,
            UserRepository users,
            RequestCommentRepository comments) {
        this.requests = requests;
        this.users = users;
        this.comments = comments;
    }

    @Transactional(readOnly = true)
    public RequestDtos.PageResponse<RequestDtos.Response> search(
            String email, RequestStatus status, RequestPriority priority, String search,
            int page, int size) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 50), Sort.by(Sort.Direction.DESC, "updatedAt"));
        String owner = currentUser(email).getRole().name().equals("STAFF") ? null : email;
        String term = search == null || search.isBlank() ? null : search.trim();
        Page<ServiceRequest> result = requests.search(owner, status, priority, term, pageable);
        return new RequestDtos.PageResponse<>(
                result.map(this::toResponse).getContent(),
                result.getTotalElements(),
                result.getTotalPages(),
                result.getNumber(),
                result.getSize());
    }

    @Transactional
    public RequestDtos.Response create(String email, RequestDtos.CreateRequest request) {
        ServiceRequest entity = new ServiceRequest();
        entity.setTitle(request.title().trim());
        entity.setDescription(request.description().trim());
        entity.setCategory(request.category().trim());
        entity.setPriority(request.priority() == null ? RequestPriority.MEDIUM : request.priority());
        entity.setCreatedBy(currentUser(email));
        return toResponse(requests.save(entity));
    }

    @Transactional
    public RequestDtos.Response update(String email, Long id, RequestDtos.UpdateRequest update) {
        User user = currentUser(email);
        ServiceRequest entity = findVisible(user, id);
        if (update.status() != null && user.getRole().name().equals("STUDENT")) {
            throw new IllegalArgumentException("Only staff can change request status");
        }
        if (update.status() != null) entity.setStatus(update.status());
        if (update.priority() != null) entity.setPriority(update.priority());
        entity.touch();
        return toResponse(entity);
    }

    @Transactional(readOnly = true)
    public RequestDtos.Response get(String email, Long id) {
        return toResponse(findVisible(currentUser(email), id));
    }

    @Transactional(readOnly = true)
    public List<RequestDtos.CommentResponse> comments(String email, Long id) {
        ServiceRequest request = findVisible(currentUser(email), id);
        return comments.findByRequestIdOrderByCreatedAtAsc(request.getId()).stream()
                .map(comment -> new RequestDtos.CommentResponse(
                        comment.getId(), comment.getBody(), comment.getAuthor().getName(), comment.getCreatedAt()))
                .toList();
    }

    @Transactional
    public RequestDtos.CommentResponse addComment(
            String email, Long id, RequestDtos.CreateComment input) {
        User author = currentUser(email);
        ServiceRequest request = findVisible(author, id);
        RequestComment comment = new RequestComment();
        comment.setBody(input.body().trim());
        comment.setAuthor(author);
        comment.setRequest(request);
        RequestComment saved = comments.save(comment);
        return new RequestDtos.CommentResponse(
                saved.getId(), saved.getBody(), author.getName(), saved.getCreatedAt());
    }

    private ServiceRequest findVisible(User user, Long id) {
        Optional<ServiceRequest> result = user.getRole().name().equals("STAFF")
                ? requests.findById(id)
                : requests.findByIdAndCreatedByEmailIgnoreCase(id, user.getEmail());
        return result.orElseThrow(() -> new RequestNotFoundException(id));
    }

    private User currentUser(String email) {
        return users.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private RequestDtos.Response toResponse(ServiceRequest request) {
        return new RequestDtos.Response(
                request.getId(), request.getTitle(), request.getDescription(), request.getCategory(),
                request.getPriority(), request.getStatus(), request.getCreatedBy().getName(),
                request.getCreatedAt(), request.getUpdatedAt());
    }
}
