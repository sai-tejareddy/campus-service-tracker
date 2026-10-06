package com.example.campustracker.request;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    @Query("""
            select r from ServiceRequest r
            where (:ownerEmail is null or lower(r.createdBy.email) = lower(:ownerEmail))
              and (:status is null or r.status = :status)
              and (:priority is null or r.priority = :priority)
              and (:search is null or lower(r.title) like lower(concat('%', :search, '%'))
                   or lower(r.description) like lower(concat('%', :search, '%')))
            """)
    Page<ServiceRequest> search(
            @Param("ownerEmail") String ownerEmail,
            @Param("status") RequestStatus status,
            @Param("priority") RequestPriority priority,
            @Param("search") String search,
            Pageable pageable);

    Optional<ServiceRequest> findByIdAndCreatedByEmailIgnoreCase(Long id, String email);
}
