package com.bloodbond.controller;

import com.bloodbond.config.AppConstants;
import com.bloodbond.model.BloodRequest;
import com.bloodbond.model.Donor;
import com.bloodbond.service.BloodStockService;
import com.bloodbond.service.DonorService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class AppController {

    private final DonorService donorService;
    private final BloodStockService bloodStockService;

    public AppController(DonorService donorService, BloodStockService bloodStockService) {
        this.donorService = donorService;
        this.bloodStockService = bloodStockService;
    }

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(java.time.LocalDate.class, new java.beans.PropertyEditorSupport() {
            @Override
            public void setAsText(String text) {
                setValue(text == null || text.isBlank() ? null : java.time.LocalDate.parse(text));
            }
        });
    }

    @ModelAttribute
    public void addSessionUser(HttpSession session, Model model) {
        Donor loggedInUser = (Donor) session.getAttribute("loggedInUser");
        if (loggedInUser != null) {
            model.addAttribute("loggedInUser", loggedInUser);
        }
    }

    @GetMapping("/login")
    public String loginForm(HttpSession session) {
        if (session.getAttribute("loggedInUser") != null) {
            return "redirect:/";
        }
        return "login";
    }

    @PostMapping("/login")
    public String login(@RequestParam String phone,
                        @RequestParam String password,
                        HttpSession session,
                        RedirectAttributes redirect) {
        Donor donor = donorService.findByPhoneAndPassword(phone, password);
        if (donor != null) {
            session.setAttribute("loggedInUser", donor);
            return "redirect:/";
        } else {
            redirect.addFlashAttribute("error", "মোবাইল নম্বর বা পাসওয়ার্ড ভুল হয়েছে।");
            return "redirect:/login";
        }
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.removeAttribute("loggedInUser");
        session.invalidate();
        return "redirect:/login";
    }

    @GetMapping("/")
    public String home(@RequestParam(defaultValue = "সব গ্রুপ") String blood,
                       @RequestParam(defaultValue = "") String district,
                       HttpSession session,
                       Model model) {
        if (session.getAttribute("loggedInUser") == null) {
            return "redirect:/login";
        }
        addCommon(model, "find");
        model.addAttribute("donors", donorService.filter(blood, district));
        model.addAttribute("blood", blood);
        model.addAttribute("districtQuery", district);
        model.addAttribute("donorCount", donorService.findAll().size() + 1247);
        return "index";
    }

    @GetMapping("/register")
    public String registerForm(Model model) {
        addCommon(model, "register");
        if (!model.containsAttribute("donor")) {
            Donor donor = new Donor();
            donor.setBlood("A+");
            donor.setDistrict("ঢাকা");
            donor.setAvailability("যেকোনো সময়");
            donor.setStatus("Available");
            model.addAttribute("donor", donor);
        }
        return "register";
    }

    @PostMapping("/register")
    public String register(@Valid @ModelAttribute("donor") Donor donor,
                           BindingResult bindingResult,
                           @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
                           HttpSession session,
                           Model model,
                           RedirectAttributes redirect) {
        if (bindingResult.hasErrors()) {
            addCommon(model, "register");
            return "register";
        }
        Donor saved = donorService.save(donor, imageFile);
        
        // Log in the user automatically if they are not already logged in
        if (session.getAttribute("loggedInUser") == null) {
            session.setAttribute("loggedInUser", saved);
            redirect.addFlashAttribute("notice", "আপনার donor profile সফলভাবে তৈরি হয়েছে এবং আপনি লগ-ইন আছেন।");
            return "redirect:/";
        }
        
        redirect.addFlashAttribute("notice", "নতুন donor profile সফলভাবে যুক্ত হয়েছে।");
        return "redirect:/";
    }

    @GetMapping("/request")
    public String requestForm(HttpSession session, Model model) {
        if (session.getAttribute("loggedInUser") == null) {
            return "redirect:/login";
        }
        addCommon(model, "request");
        if (!model.containsAttribute("bloodRequest")) {
            BloodRequest request = new BloodRequest();
            request.setBlood("A+");
            request.setBags(1);
            model.addAttribute("bloodRequest", request);
        }
        return "request";
    }

    @PostMapping("/request")
    public String submitRequest(@Valid @ModelAttribute("bloodRequest") BloodRequest bloodRequest,
                                BindingResult bindingResult,
                                HttpSession session,
                                Model model,
                                RedirectAttributes redirect) {
        if (session.getAttribute("loggedInUser") == null) {
            return "redirect:/login";
        }
        if (bindingResult.hasErrors()) {
            addCommon(model, "request");
            return "request";
        }
        String notice = bloodStockService.processRequest(bloodRequest);
        redirect.addFlashAttribute("notice", notice);
        return "redirect:/";
    }

    @GetMapping("/stock")
    public String stock(HttpSession session, Model model) {
        if (session.getAttribute("loggedInUser") == null) {
            return "redirect:/login";
        }
        addCommon(model, "stock");
        model.addAttribute("stocks", bloodStockService.findAll());
        model.addAttribute("totalUnits", bloodStockService.totalUnits());
        return "stock";
    }

    @GetMapping("/donors/{id}")
    public String donorProfile(@PathVariable Long id, HttpSession session, Model model) {
        if (session.getAttribute("loggedInUser") == null) {
            return "redirect:/login";
        }
        addCommon(model, "find");
        model.addAttribute("donor", donorService.getById(id));
        return "donor";
    }

    @PostMapping("/donors/{id}/review")
    public String review(@PathVariable Long id, @RequestParam int rating, HttpSession session, RedirectAttributes redirect) {
        if (session.getAttribute("loggedInUser") == null) {
            return "redirect:/login";
        }
        donorService.addReview(id, rating);
        redirect.addFlashAttribute("notice", "আপনার review যুক্ত হয়েছে। ধন্যবাদ।");
        return "redirect:/";
    }

    @PostMapping("/donors/{id}/delete")
    public String deleteDonor(@PathVariable Long id,
                              @RequestParam(required = false) String reason,
                              HttpSession session,
                              RedirectAttributes redirect) {
        Donor loggedInUser = (Donor) session.getAttribute("loggedInUser");
        if (loggedInUser == null) {
            return "redirect:/login";
        }
        if (!loggedInUser.getId().equals(id)) {
            redirect.addFlashAttribute("notice", "আপনি শুধুমাত্র নিজের প্রোফাইল ডিলিট করতে পারবেন।");
            return "redirect:/donors/" + id;
        }
        Donor donor = donorService.getById(id);
        String name = donor.getName();
        donorService.deleteById(id);
        
        // If the logged in user deleted their own profile, clear session
        if (loggedInUser.getId().equals(id)) {
            session.removeAttribute("loggedInUser");
            session.invalidate();
        }
        
        String noticeMsg = name + " এর ডোনার প্রোফাইল সফলভাবে ডিলিট করা হয়েছে।";
        if (reason != null && !reason.isBlank()) {
            noticeMsg += " কারণ: " + reason;
        }
        redirect.addFlashAttribute("notice", noticeMsg);
        return "redirect:/";
    }

    @GetMapping("/donors/{id}/edit")
    public String editForm(@PathVariable Long id, HttpSession session, Model model, RedirectAttributes redirect) {
        Donor loggedInUser = (Donor) session.getAttribute("loggedInUser");
        if (loggedInUser == null) {
            return "redirect:/login";
        }
        if (!loggedInUser.getId().equals(id)) {
            redirect.addFlashAttribute("notice", "আপনি শুধুমাত্র নিজের প্রোফাইল এডিট করতে পারবেন।");
            return "redirect:/donors/" + id;
        }
        addCommon(model, "edit");
        model.addAttribute("donor", donorService.getById(id));
        return "edit";
    }

    @PostMapping("/donors/{id}/edit")
    public String updateDonor(@PathVariable Long id,
                              @Valid @ModelAttribute("donor") Donor donor,
                              BindingResult bindingResult,
                              @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
                              HttpSession session,
                              Model model,
                              RedirectAttributes redirect) {
        Donor loggedInUser = (Donor) session.getAttribute("loggedInUser");
        if (loggedInUser == null) {
            return "redirect:/login";
        }
        if (!loggedInUser.getId().equals(id)) {
            redirect.addFlashAttribute("notice", "আপনি শুধুমাত্র নিজের প্রোফাইল এডিট করতে পারবেন।");
            return "redirect:/donors/" + id;
        }
        if (bindingResult.hasErrors()) {
            addCommon(model, "edit");
            return "edit";
        }
        donor.setId(id);
        donorService.save(donor, imageFile);
        
        // Update session
        session.setAttribute("loggedInUser", donor);
        redirect.addFlashAttribute("notice", "আপনার donor profile সফলভাবে আপডেট হয়েছে।");
        return "redirect:/donors/" + id;
    }

    @PostMapping("/donors/{id}/donations")
    public String addDonation(@PathVariable Long id,
                              @RequestParam(required = false) java.time.LocalDate donationDate,
                              HttpSession session,
                              RedirectAttributes redirect) {
        Donor loggedInUser = (Donor) session.getAttribute("loggedInUser");
        if (loggedInUser == null) {
            return "redirect:/login";
        }
        if (!loggedInUser.getId().equals(id)) {
            redirect.addFlashAttribute("notice", "আপনি শুধুমাত্র নিজের donation history আপডেট করতে পারবেন।");
            return "redirect:/donors/" + id;
        }
        if (donationDate != null) {
            try {
                donorService.addDonation(id, donationDate);
                session.setAttribute("loggedInUser", donorService.getById(id));
                redirect.addFlashAttribute("notice", "আপনার donation history-তে নতুন তারিখ যুক্ত হয়েছে।");
            } catch (IllegalArgumentException exception) {
                redirect.addFlashAttribute("notice", "ভবিষ্যতের তারিখ donation history-তে যোগ করা যাবে না।");
            }
        }
        return "redirect:/donors/" + id;
    }

    private void addCommon(Model model, String activeTab) {
        model.addAttribute("activeTab", activeTab);
        model.addAttribute("bloodGroups", AppConstants.BLOOD_GROUPS);
        model.addAttribute("bloodGroupsOnly", AppConstants.BLOOD_GROUPS_ONLY);
        model.addAttribute("districts", AppConstants.DISTRICTS);
        model.addAttribute("availabilityOptions", AppConstants.AVAILABILITY_OPTIONS);
    }
}
