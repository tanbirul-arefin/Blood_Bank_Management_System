package com.bloodbond.model;

import jakarta.persistence.Column;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.FetchType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "donors")
public class Donor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    private String nameBn;
    private String blood;
    private String district;
    private String area;
    private String areaBn;
    private String phone;

    @Min(1)
    private Integer age;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate lastDonation;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "donor_donation_history", joinColumns = @JoinColumn(name = "donor_id"))
    @Column(name = "donation_date")
    private List<LocalDate> donationHistory = new ArrayList<>();
    private String availability = "যেকোনো সময়";
    private String status = "Available";
    private String image;

    @Column(length = 500)
    private String note;

    private Double rating = 0.0;
    private Integer reviews = 0;
    private Boolean verified = false;
    private String password;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isEligible() {
        if (age != null && age < 18) {
            return false;
        }
        if (lastDonation == null) {
            return true;
        }
        return ChronoUnit.DAYS.between(lastDonation, LocalDate.now()) >= 90;
    }

    public String getDisplayArea() {
        if (areaBn != null && !areaBn.isBlank()) {
            return areaBn;
        }
        return area == null ? "" : area;
    }

    public String getAvailabilityLabel() {
        if ("Available".equals(status) && isEligible()) {
            return "এখন দিতে পারবেন";
        }
        if ("Busy".equals(status)) {
            return "এই মুহূর্তে ব্যস্ত";
        }
        return "এখন available নন";
    }

    public boolean isCurrentlyAvailable() {
        return "Available".equals(status) && isEligible();
    }

    public String getRatingLabel() {
        if (rating == null || rating == 0 || reviews == null || reviews == 0) {
            return "নতুন";
        }
        return String.format("%.1f", rating);
    }

    public String getStatusCss() {
        return status == null ? "available" : status.toLowerCase();
    }

    @Transient
    public String getLastDonationLabel() {
        return lastDonation == null ? "Never donated" : lastDonation.toString();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNameBn() {
        return nameBn;
    }

    public void setNameBn(String nameBn) {
        this.nameBn = nameBn;
    }

    public String getBlood() {
        return blood;
    }

    public void setBlood(String blood) {
        this.blood = blood;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getAreaBn() {
        return areaBn;
    }

    public void setAreaBn(String areaBn) {
        this.areaBn = areaBn;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public LocalDate getLastDonation() {
        return lastDonation;
    }

    public void setLastDonation(LocalDate lastDonation) {
        this.lastDonation = lastDonation;
    }

    @Transient
    public List<LocalDate> getSortedDonationHistory() {
        List<LocalDate> history = new ArrayList<>(donationHistory == null ? List.of() : donationHistory);
        if (lastDonation != null && !history.contains(lastDonation)) {
            history.add(lastDonation);
        }
        history.sort(java.util.Comparator.reverseOrder());
        return history;
    }

    @Transient
    public int getDonationCount() {
        return getSortedDonationHistory().size();
    }

    public List<LocalDate> getDonationHistory() {
        return donationHistory;
    }

    public void setDonationHistory(List<LocalDate> donationHistory) {
        this.donationHistory = donationHistory == null ? new ArrayList<>() : donationHistory;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getReviews() {
        return reviews;
    }

    public void setReviews(Integer reviews) {
        this.reviews = reviews;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }
}
