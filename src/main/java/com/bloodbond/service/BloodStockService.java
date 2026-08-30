package com.bloodbond.service;

import com.bloodbond.model.BloodRequest;
import com.bloodbond.model.BloodStock;
import com.bloodbond.repository.BloodRequestRepository;
import com.bloodbond.repository.BloodStockRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BloodStockService {

    private final BloodStockRepository stockRepository;
    private final BloodRequestRepository requestRepository;

    public BloodStockService(BloodStockRepository stockRepository, BloodRequestRepository requestRepository) {
        this.stockRepository = stockRepository;
        this.requestRepository = requestRepository;
    }

    public List<BloodStock> findAll() {
        return stockRepository.findAll();
    }

    public int totalUnits() {
        return stockRepository.findAll().stream()
                .mapToInt(stock -> stock.getUnits() == null ? 0 : stock.getUnits())
                .sum();
    }

    @Transactional
    public String processRequest(BloodRequest request) {
        boolean removed = removeUnits(request.getBlood(), request.getBags());
        request.setFulfilledFromStock(removed);
        requestRepository.save(request);

        if (removed) {
            return request.getBlood() + " blood request received. Stock থেকে " + request.getBags() + " bag দেওয়া যাবে।";
        }
        String place = request.getLocation() == null || request.getLocation().isBlank()
                ? "আপনার এলাকার"
                : request.getLocation();
        return request.getBlood() + " stock কম আছে। " + place + " eligible donors-কে request পাঠানো হয়েছে।";
    }

    public boolean removeUnits(String bloodGroup, int bags) {
        BloodStock stock = stockRepository.findByBloodGroup(bloodGroup).orElse(null);
        if (stock == null || stock.getUnits() == null || stock.getUnits() < bags) {
            return false;
        }
        stock.setUnits(stock.getUnits() - bags);
        stockRepository.save(stock);
        return true;
    }
}
