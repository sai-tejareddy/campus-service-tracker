package com.example.campustracker.request;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestCommentRepository extends JpaRepository<RequestComment, Long> {
    List<RequestComment> findByRequestIdOrderByCreatedAtAsc(Long requestId);
}
