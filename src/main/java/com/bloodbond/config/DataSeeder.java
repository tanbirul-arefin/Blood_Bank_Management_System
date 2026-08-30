package com.bloodbond.config;

import com.bloodbond.model.BloodStock;
import com.bloodbond.model.Donor;
import com.bloodbond.repository.BloodStockRepository;
import com.bloodbond.repository.DonorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
public class DataSeeder implements CommandLineRunner {

    private final DonorRepository donorRepository;
    private final BloodStockRepository stockRepository;

    public DataSeeder(DonorRepository donorRepository, BloodStockRepository stockRepository) {
        this.donorRepository = donorRepository;
        this.stockRepository = stockRepository;
    }

    @Override
    public void run(String... args) {
        // Automatically set password to "1234" for existing rows with null passwords
        List<Donor> existing = donorRepository.findAll();
        for (Donor d : existing) {
            if (d.getPassword() == null || d.getPassword().isBlank()) {
                d.setPassword("1234");
                donorRepository.save(d);
            }
        }

        if (donorRepository.count() == 0) {
            donorRepository.saveAll(starterDonors());
        }
        if (stockRepository.count() == 0) {
            Map<String, Integer> stock = new LinkedHashMap<>();
            stock.put("A+", 8);
            stock.put("A-", 3);
            stock.put("B+", 6);
            stock.put("B-", 2);
            stock.put("AB+", 4);
            stock.put("AB-", 1);
            stock.put("O+", 10);
            stock.put("O-", 2);
            stock.forEach((group, units) -> stockRepository.save(new BloodStock(group, units)));
        }
    }

    private List<Donor> starterDonors() {
        return List.of(
                donor("Nadia Rahman", "নাদিয়া রহমান", "A+", "সিলেট", "Zindabazar", "জিন্দাবাজার",
                        "01712-345678", "সকাল ৮টা - দুপুর ১২টা",
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
                        "জরুরি প্রয়োজনে পাশে আছি।", 5.0, 18, true),
                donor("Sajid Hossain", "সাজিদ হোসেন", "A+", "ঢাকা", "Dhanmondi", "ধানমন্ডি",
                        "01812-345678", "সন্ধ্যা ৬টা - রাত ৯টা",
                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
                        "রক্ত দিতে নিয়মিত প্রস্তুত আছি।", 4.9, 12, true),
                donor("Farhana Ali", "ফারহানা আলী", "B+", "চট্টগ্রাম", "GEC Circle", "জিইসি মোড়",
                        "01912-345678", "এই সপ্তাহে যেকোনো সময়",
                        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
                        "প্রয়োজন হলে দ্রুত যোগাযোগ করুন।", 5.0, 9, true),
                donor("Arif Hossain", "আরিফ হোসেন", "O-", "রংপুর", "City Gate", "সিটি গেট",
                        "01612-345678", "যেকোনো সময়",
                        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
                        "জরুরি donor হিসেবে যুক্ত আছি।", 4.8, 21, true),
                donor("Mim Akter", "মিম আক্তার", "O+", "সিলেট", "Amberkhana", "আম্বরখানা",
                        "01512-345678", "সকাল ৯টা - দুপুর ১টা",
                        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
                        "রক্তের জন্য আমাকে জানাতে পারেন।", 4.9, 15, false),
                donor("Tamim Rahman", "তামিম রহমান", "B+", "জয়পুরহাট", "Sadar", "সদর",
                        "01711-241234", "সন্ধ্যা ৬টার পর",
                        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
                        "সদা মানুষের পাশে আছি।", 4.7, 7, true)
        );
    }

    private Donor donor(String name, String nameBn, String blood, String district, String area, String areaBn,
                        String phone, String availability, String image, String note,
                        double rating, int reviews, boolean verified) {
        Donor d = new Donor();
        d.setName(name);
        d.setNameBn(nameBn);
        d.setBlood(blood);
        d.setDistrict(district);
        d.setArea(area);
        d.setAreaBn(areaBn);
        d.setPhone(phone);
        d.setAvailability(availability);
        d.setImage(image);
        d.setNote(note);
        d.setRating(rating);
        d.setReviews(reviews);
        d.setVerified(verified);
        d.setStatus("Available");
        d.setPassword("1234");
        return d;
    }
}
