package com.bloodbond.config;

import com.bloodbond.model.BloodStock;
import com.bloodbond.model.Donor;
import com.bloodbond.repository.BloodStockRepository;
import com.bloodbond.repository.DonorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashSet;
import java.util.Set;

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
        for (int index = 0; index < existing.size(); index++) {
            Donor d = existing.get(index);
            if (d.getPassword() == null || d.getPassword().isBlank()) {
                d.setPassword("1234");
            }
            if (d.getDonationHistory().isEmpty() && d.getName() != null && isDemoDonor(d.getName())) {
                LocalDate latest = LocalDate.now().minusMonths(index + 1);
                List<LocalDate> history = new ArrayList<>();
                history.add(latest);
                history.add(latest.minusMonths(4));
                history.add(latest.minusMonths(8));
                d.setLastDonation(latest);
                d.setDonationHistory(history);
            }
            donorRepository.save(d);
        }

        List<Donor> seedDonors = starterDonors();
        Set<String> existingPhones = new HashSet<>();
        donorRepository.findAll().forEach(donor -> existingPhones.add(donor.getPhone()));
        List<Donor> missingSeedDonors = seedDonors.stream()
                .filter(donor -> !existingPhones.contains(donor.getPhone()))
                .toList();
        if (!missingSeedDonors.isEmpty()) {
            donorRepository.saveAll(missingSeedDonors);
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

    private boolean isDemoDonor(String name) {
        return List.of("Nadia Rahman", "Sajid Hossain", "Farhana Ali", "Arif Hossain", "Mim Akter", "Tamim Rahman").contains(name);
    }

    private List<Donor> starterDonors() {
        List<Donor> donors = new ArrayList<>(List.of(
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
        ));
        String[][] extraSeeds = {
            {"Rafiq Ahmed", "রফিক আহমেদ", "A+", "ঢাকা", "মিরপুর", "Mirpur"}, {"Jannatul Ferdous", "জান্নাতুল ফেরদৌস", "A+", "চট্টগ্রাম", "পাঁচলাইশ", "Panchlaish"}, {"Mahmud Hasan", "মাহমুদ হাসান", "A+", "রাজশাহী", "সাহেব বাজার", "Saheb Bazar"}, {"Nusrat Jahan", "নুসরাত জাহান", "A+", "খুলনা", "সোনাডাঙ্গা", "Sonadanga"}, {"Imran Kabir", "ইমরান কবির", "A+", "বরিশাল", "সদর রোড", "Sadar Road"},
            {"Shamim Hossain", "শামীম হোসেন", "A-", "ঢাকা", "উত্তরা", "Uttara"}, {"Mousumi Sultana", "মৌসুমী সুলতানা", "A-", "সিলেট", "আম্বরখানা", "Amberkhana"}, {"Tanvir Islam", "তানভীর ইসলাম", "A-", "ময়মনসিংহ", "টাউন হল", "Town Hall"}, {"Sumaiya Akter", "সুমাইয়া আক্তার", "A-", "রংপুর", "জাহাজ কোম্পানি", "Jahaj Company"}, {"Nayeem Chowdhury", "নাঈম চৌধুরী", "A-", "কুমিল্লা", "কান্দিরপাড়", "Kandirpar"},
            {"Sabbir Rahman", "সাব্বির রহমান", "B+", "ঢাকা", "ধানমন্ডি", "Dhanmondi"}, {"Rumana Yasmin", "রুমানা ইয়াসমিন", "B+", "চট্টগ্রাম", "আগ্রাবাদ", "Agrabad"}, {"Fahim Hossain", "ফাহিম হোসেন", "B+", "সিলেট", "জিন্দাবাজার", "Zindabazar"}, {"Lamia Islam", "লামিয়া ইসলাম", "B+", "রাজশাহী", "উপশহর", "Uposhahar"}, {"Sakib Al Hasan", "সাকিব আল হাসান", "B+", "খুলনা", "খালিশপুর", "Khalishpur"},
            {"Rashedul Karim", "রাশেদুল করিম", "B-", "বরিশাল", "নথুল্লাবাদ", "Nathullabad"}, {"Tania Rahman", "তানিয়া রহমান", "B-", "ঢাকা", "মোহাম্মদপুর", "Mohammadpur"}, {"Aminul Haque", "আমিনুল হক", "B-", "রংপুর", "সদর", "Sadar"}, {"Shila Akter", "শিলা আক্তার", "B-", "ময়মনসিংহ", "গাঙ্গিনারপাড়", "Ganginarpar"}, {"Jubayer Ahmed", "জুবায়ের আহমেদ", "B-", "কুমিল্লা", "লাকসাম রোড", "Laksam Road"},
            {"Omar Faruk", "ওমর ফারুক", "AB+", "ঢাকা", "বাড্ডা", "Badda"}, {"Maliha Noor", "মালিহা নূর", "AB+", "চট্টগ্রাম", "হালিশহর", "Halishahar"}, {"Anik Das", "অনিক দাস", "AB+", "রাজশাহী", "লক্ষ্মীপুর", "Laxmipur"}, {"Raisa Kabir", "রাইসা কবির", "AB+", "সিলেট", "শাহজালাল উপশহর", "Shahjalal Uposhahar"}, {"Hasan Mahmud", "হাসান মাহমুদ", "AB+", "খুলনা", "দৌলতপুর", "Daulatpur"},
            {"Nabil Hossain", "নাবিল হোসেন", "AB-", "ঢাকা", "যাত্রাবাড়ী", "Jatrabari"}, {"Faria Tasnim", "ফারিয়া তাসনিম", "AB-", "বরিশাল", "বটতলা", "Bottola"}, {"Rony Sarker", "রনি সরকার", "AB-", "চট্টগ্রাম", "নাসিরাবাদ", "Nasirabad"}, {"Mariya Islam", "মারিয়া ইসলাম", "AB-", "রংপুর", "ধাপ", "Dhap"}, {"Tareq Aziz", "তারেক আজিজ", "AB-", "ময়মনসিংহ", "বাইপাস", "Bypass"},
                {"Shuvo Ahmed", "শুভ আহমেদ", "O+", "ঢাকা", "গুলশান", "Gulshan"}, {"Rahat Khan", "রাহাত খান", "O+", "চট্টগ্রাম", "কোতোয়ালী", "Kotwali"}, {"Sadia Afrin", "সাদিয়া আফরিন", "O+", "রাজশাহী", "বর্ণালী", "Bornali"}, {"Nasir Uddin", "নাসির উদ্দিন", "O+", "খুলনা", "ময়লাপোতা", "Moylapota"},
                {"Abdullah Al Mamun", "আব্দুল্লাহ আল মামুন", "A+", "ঢাকা", "শাহবাগ", "Shahbag"}, {"Mitu Saha", "মিতু সাহা", "A+", "খুলনা", "দৌলতপুর", "Daulatpur"}, {"Rony Ahmed", "রনি আহমেদ", "A-", "চট্টগ্রাম", "বহদ্দারহাট", "Bahaddarhat"}, {"Ananya Das", "অনন্যা দাস", "A-", "বরিশাল", "কাশীপুর", "Kashipur"},
                {"Mehedi Hasan", "মেহেদী হাসান", "B+", "ঢাকা", "ফার্মগেট", "Farmgate"}, {"Sanjida Noor", "সানজিদা নূর", "B+", "রংপুর", "হারাগাছ", "Haragachh"}, {"Kawsar Ahmed", "কাউসার আহমেদ", "B-", "সিলেট", "বন্দরবাজার", "Bandar Bazar"}, {"Tumpa Akter", "তুম্পা আক্তার", "B-", "রাজশাহী", "কাজিহাটা", "Kazihata"},
                {"Shakil Khan", "শাকিল খান", "AB+", "ময়মনসিংহ", "মাসকান্দা", "Maskanda"}, {"Rima Islam", "রিমা ইসলাম", "AB+", "কুমিল্লা", "টমছমব্রিজ", "Tomchom Bridge"}, {"Biplob Roy", "বিপ্লব রায়", "AB-", "ঢাকা", "সাভার", "Savar"}, {"Afia Sultana", "আফিয়া সুলতানা", "AB-", "সিলেট", "মেজরটিলা", "Majortila"},
                {"Rakibul Hasan", "রাকিবুল হাসান", "O+", "বরিশাল", "চরকাউয়া", "Charkaua"}, {"Sohana Rahman", "সোহানা রহমান", "O+", "রংপুর", "শাপলা চত্বর", "Shapla Chattar"}, {"Al Amin", "আল আমিন", "O+", "ময়মনসিংহ", "সিকিউরিটি বাজার", "Security Bazar"}, {"Mahiya Karim", "মাহিয়া করিম", "O-", "ঢাকা", "লালবাগ", "Lalbagh"},
                {"Foysal Ahmed", "ফয়সাল আহমেদ", "O-", "চট্টগ্রাম", "কর্ণফুলী", "Karnaphuli"}, {"Urmi Akter", "উর্মি আক্তার", "O-", "খুলনা", "বয়রা", "Boyra"}, {"Sajjad Hossain", "সাজ্জাদ হোসেন", "O-", "রাজশাহী", "শিরোইল", "Shiroil"}, {"Morsheda Begum", "মোরশেদা বেগম", "O-", "কুমিল্লা", "ধর্মসাগর", "Dharmasagar"}
        };
        for (int index = 0; index < extraSeeds.length; index++) {
            String[] seed = extraSeeds[index];
            String gender = index % 2 == 0 ? "men" : "women";
            donors.add(donor(seed[0], seed[1], seed[2], seed[3], seed[5], seed[4],
                String.format("017000000%02d", index + 1), "যেকোনো সময়",
                "https://randomuser.me/api/portraits/" + gender + "/" + (index + 11) + ".jpg",
                "রক্তের প্রয়োজনে যোগাযোগ করুন।", 4.8, 5, true));
        }
        return donors;
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
        LocalDate latestDonation = LocalDate.now().minusMonths(6);
        d.setLastDonation(latestDonation);
        d.setDonationHistory(new ArrayList<>(List.of(latestDonation, latestDonation.minusMonths(4), latestDonation.minusMonths(8))));
        return d;
    }
}
