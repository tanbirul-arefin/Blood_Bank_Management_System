package com.bloodbond.controller;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public String handleNotFound(IllegalArgumentException ex, RedirectAttributes redirect) {
        redirect.addFlashAttribute("notice", "Donor খুঁজে পাওয়া যায়নি।");
        return "redirect:/";
    }
}
