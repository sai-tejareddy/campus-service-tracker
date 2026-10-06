package com.example.campustracker.request;

import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/requests")
public class RequestController {
    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @GetMapping
    public RequestDtos.PageResponse<RequestDtos.Response> search(
            Principal principal,
            @RequestParam(required = false) RequestStatus status,
            @RequestParam(required = false) RequestPriority priority,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return requestService.search(principal.getName(), status, priority, search, page, size);
    }

    @GetMapping("/{id}")
    public RequestDtos.Response get(Principal principal, @PathVariable Long id) {
        return requestService.get(principal.getName(), id);
    }

    @PostMapping
    public RequestDtos.Response create(
            Principal principal, @Valid @RequestBody RequestDtos.CreateRequest request) {
        return requestService.create(principal.getName(), request);
    }

    @PutMapping("/{id}")
    public RequestDtos.Response update(
            Principal principal,
            @PathVariable Long id,
            @RequestBody RequestDtos.UpdateRequest request) {
        return requestService.update(principal.getName(), id, request);
    }

    @GetMapping("/{id}/comments")
    public List<RequestDtos.CommentResponse> comments(Principal principal, @PathVariable Long id) {
        return requestService.comments(principal.getName(), id);
    }

    @PostMapping("/{id}/comments")
    public RequestDtos.CommentResponse addComment(
            Principal principal,
            @PathVariable Long id,
            @Valid @RequestBody RequestDtos.CreateComment comment) {
        return requestService.addComment(principal.getName(), id, comment);
    }
}
