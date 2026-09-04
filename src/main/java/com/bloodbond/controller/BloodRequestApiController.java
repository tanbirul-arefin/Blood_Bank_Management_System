package com.bloodbond.controller;

import com.bloodbond.model.BloodRequest;
import com.bloodbond.repository.BloodRequestRepository;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/blood-requests")
public class BloodRequestApiController {

    private final BloodRequestRepository bloodRequestRepository;

    public BloodRequestApiController(BloodRequestRepository bloodRequestRepository) {
        this.bloodRequestRepository = bloodRequestRepository;
    }

    @GetMapping
    public List<BloodRequest> findAll() {
        return bloodRequestRepository.findAllByOrderByIdDesc();
    }

    @PostMapping
    public BloodRequest create(@Valid @RequestBody BloodRequest request) {
        return bloodRequestRepository.save(request);
    }
}