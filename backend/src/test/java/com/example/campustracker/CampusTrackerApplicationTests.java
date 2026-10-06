package com.example.campustracker;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class CampusTrackerApplicationTests {
    @Test
    void applicationContextLoads() {
        assertThat(true).isTrue();
    }
}
