package com.example.campustracker.request;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public final class RequestDtos {
    private RequestDtos() {}

    public record CreateRequest(
            @NotBlank String title,
            @NotBlank String description,
            @NotBlank String category,
            RequestPriority priority) {}

    public record UpdateRequest(RequestStatus status, RequestPriority priority) {}

    public record Response(
            Long id,
            String title,
            String description,
            String category,
            RequestPriority priority,
            RequestStatus status,
            String createdBy,
            java.time.Instant createdAt,
            java.time.Instant updatedAt) {}

    public record PageResponse<T>(
            List<T> content,
            long totalElements,
            int totalPages,
            int number,
            int size) {}

    public record CreateComment(@NotBlank String body) {}

    public record CommentResponse(Long id, String body, String author, java.time.Instant createdAt) {}
}
