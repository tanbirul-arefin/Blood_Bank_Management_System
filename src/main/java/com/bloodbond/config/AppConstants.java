package com.bloodbond.config;

import java.util.List;
import java.util.Map;

public final class AppConstants {

    public static final String DEFAULT_IMAGE =
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80";

    public static final List<String> BLOOD_GROUPS =
            List.of("সব গ্রুপ", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-");

    public static final List<String> BLOOD_GROUPS_ONLY =
            List.of("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-");

    public static final List<String> DISTRICTS = List.of(
            "ঢাকা", "চট্টগ্রাম", "সিলেট", "রাজশাহী", "খুলনা",
            "ময়মনসিংহ", "রংপুর", "বরিশাল", "কুমিল্লা", "জয়পুরহাট"
    );

    public static final Map<String, String> DISTRICT_ENGLISH = Map.ofEntries(
            Map.entry("ঢাকা", "Dhaka"),
            Map.entry("চট্টগ্রাম", "Chittagong"),
            Map.entry("সিলেট", "Sylhet"),
            Map.entry("রাজশাহী", "Rajshahi"),
            Map.entry("খুলনা", "Khulna"),
            Map.entry("ময়মনসিংহ", "Mymensingh"),
            Map.entry("রংপুর", "Rangpur"),
            Map.entry("বরিশাল", "Barisal"),
            Map.entry("কুমিল্লা", "Cumilla"),
            Map.entry("জয়পুরহাট", "Joypurhat")
    );

    public static final Map<String, String> DISTRICT_ALIASES = Map.ofEntries(
            Map.entry("dhaka", "ঢাকা"),
            Map.entry("chittagong", "চট্টগ্রাম"),
            Map.entry("chattogram", "চট্টগ্রাম"),
            Map.entry("sylhet", "সিলেট"),
            Map.entry("rajshahi", "রাজশাহী"),
            Map.entry("khulna", "খুলনা"),
            Map.entry("mymensingh", "ময়মনসিংহ"),
            Map.entry("rangpur", "রংপুর"),
            Map.entry("barisal", "বরিশাল"),
            Map.entry("barishal", "বরিশাল"),
            Map.entry("cumilla", "কুমিল্লা"),
            Map.entry("comilla", "কুমিল্লা"),
            Map.entry("joypurhat", "জয়পুরহাট")
    );

    public static final List<String> AVAILABILITY_OPTIONS = List.of(
            "যেকোনো সময়",
            "সকাল ৮টা - দুপুর ১২টা",
            "দুপুর ১২টা - বিকেল ৫টা",
            "সন্ধ্যা ৬টা - রাত ১০টা"
    );

    private AppConstants() {
    }
}
