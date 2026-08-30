package com.bloodbond.service;

import com.bloodbond.config.AppConstants;
import com.bloodbond.model.Donor;
import com.bloodbond.repository.DonorRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class DonorService {

    private final DonorRepository donorRepository;
    private final Path uploadDir;

    public DonorService(DonorRepository donorRepository,
                        @org.springframework.beans.factory.annotation.Value("${app.upload-dir}") String uploadDir) {
        this.donorRepository = donorRepository;
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    public List<Donor> findAll() {
        return donorRepository.findAll();
    }

    public Donor getById(Long id) {
        return donorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Donor not found"));
    }

    public List<Donor> filter(String blood, String districtQuery) {
        String group = blood == null || blood.isBlank() ? "সব গ্রুপ" : blood;
        String typed = districtQuery == null ? "" : districtQuery.trim().toLowerCase(Locale.ROOT);
        String alias = AppConstants.DISTRICT_ALIASES.getOrDefault(typed, typed);

        return donorRepository.findAll().stream()
                .filter(donor -> "সব গ্রুপ".equals(group) || group.equals(donor.getBlood()))
                .filter(donor -> {
                    if (alias.isBlank()) {
                        return true;
                    }
                    String english = AppConstants.DISTRICT_ENGLISH.getOrDefault(donor.getDistrict(), "");
                    String districtText = (donor.getDistrict() + " " + english).toLowerCase(Locale.ROOT);
                    return districtText.contains(alias.toLowerCase(Locale.ROOT));
                })
                .toList();
    }

    public Donor save(Donor donor, MultipartFile imageFile) {
        if (donor.getPassword() == null || donor.getPassword().isBlank()) {
            donor.setPassword("1234");
        }
        if (donor.getImage() == null || donor.getImage().isBlank()) {
            donor.setImage(AppConstants.DEFAULT_IMAGE);
        }
        if (donor.getRating() == null) {
            donor.setRating(0.0);
        }
        if (donor.getReviews() == null) {
            donor.setReviews(0);
        }
        if (donor.getVerified() == null) {
            donor.setVerified(false);
        }
        if (donor.getStatus() == null || donor.getStatus().isBlank()) {
            donor.setStatus("Available");
        }
        if (donor.getNameBn() == null || donor.getNameBn().isBlank()) {
            donor.setNameBn(donor.getName());
        }
        if (donor.getAreaBn() == null || donor.getAreaBn().isBlank()) {
            donor.setAreaBn(donor.getArea());
        }
        if (imageFile != null && !imageFile.isEmpty()) {
            donor.setImage(storeImage(imageFile));
        }
        return donorRepository.save(donor);
    }

    public Donor findByPhoneAndPassword(String phone, String password) {
        if (phone == null || password == null) {
            return null;
        }
        String cleanPhone = phone.replaceAll("\\D", "");
        return donorRepository.findAll().stream()
                .filter(d -> {
                    String dPhone = d.getPhone() == null ? "" : d.getPhone().replaceAll("\\D", "");
                    return dPhone.equals(cleanPhone) && password.equals(d.getPassword());
                })
                .findFirst()
                .orElse(null);
    }

    public void addReview(Long donorId, int rating) {
        Donor donor = getById(donorId);
        int reviews = donor.getReviews() == null ? 0 : donor.getReviews();
        double current = donor.getRating() == null ? 0 : donor.getRating();
        double updated = reviews == 0 ? rating : ((current * reviews) + rating) / (reviews + 1);
        donor.setRating(updated);
        donor.setReviews(reviews + 1);
        donorRepository.save(donor);
    }

    public void deleteById(Long id) {
        donorRepository.deleteById(id);
    }

    private String storeImage(MultipartFile imageFile) {
        try {
            Files.createDirectories(uploadDir);
            String original = imageFile.getOriginalFilename() == null ? "photo.jpg" : imageFile.getOriginalFilename();
            String safeName = original.replaceAll("[^a-zA-Z0-9.\\-]", "_");
            String filename = UUID.randomUUID() + "-" + safeName;
            Path target = uploadDir.resolve(filename);
            imageFile.transferTo(target.toFile());
            return "/uploads/" + filename;
        } catch (IOException e) {
            throw new IllegalStateException("Could not store profile picture", e);
        }
    }
}
