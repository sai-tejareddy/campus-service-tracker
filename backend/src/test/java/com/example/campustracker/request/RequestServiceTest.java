package com.example.campustracker.request;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.example.campustracker.user.User;
import com.example.campustracker.user.UserRepository;
import com.example.campustracker.user.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RequestServiceTest {
    @Mock
    private ServiceRequestRepository requests;

    @Mock
    private UserRepository users;

    @Mock
    private RequestCommentRepository comments;

    private RequestService service;
    private User user;

    @BeforeEach
    void setUp() {
        service = new RequestService(requests, users, comments);
        user = new User();
        user.setName("Asha");
        user.setEmail("asha@example.com");
        user.setRole(UserRole.STUDENT);
        when(users.findByEmailIgnoreCase("asha@example.com")).thenReturn(java.util.Optional.of(user));
    }

    @Test
    void createsRequestWithMediumPriorityByDefault() {
        ServiceRequest saved = new ServiceRequest();
        saved.setTitle("Library access");
        saved.setDescription("Please activate my library access");
        saved.setCategory("Library");
        saved.setCreatedBy(user);
        when(requests.save(any(ServiceRequest.class))).thenAnswer(invocation -> {
            ServiceRequest value = invocation.getArgument(0);
            saved.setPriority(value.getPriority());
            return saved;
        });

        RequestDtos.Response response = service.create(
                "asha@example.com",
                new RequestDtos.CreateRequest("Library access", "Please activate my library access", "Library", null));

        assertThat(response.priority()).isEqualTo(RequestPriority.MEDIUM);
        assertThat(response.title()).isEqualTo("Library access");
    }
}
