package com.example.campustracker.config;

import com.example.campustracker.user.User;
import com.example.campustracker.user.UserRepository;
import com.example.campustracker.user.UserRole;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SeedData {
    @Bean
    CommandLineRunner seedStaff(UserRepository users, PasswordEncoder encoder) {
        return args -> {
            if (!users.existsByEmailIgnoreCase("staff@campus.local")) {
                User staff = new User();
                staff.setName("Campus Support");
                staff.setEmail("staff@campus.local");
                staff.setPassword(encoder.encode("staff123"));
                staff.setRole(UserRole.STAFF);
                users.save(staff);
            }
        };
    }
}
