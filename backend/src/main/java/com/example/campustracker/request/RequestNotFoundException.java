package com.example.campustracker.request;

public class RequestNotFoundException extends RuntimeException {
    public RequestNotFoundException(Long id) {
        super("Request not found: " + id);
    }
}
