package com.ngocanh.anh05.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    // Map này dùng để lưu tạm thời: Email -> Mã OTP
    private Map<String, String> otpCache = new HashMap<>();

    // 1. Tạo mã 6 số ngẫu nhiên
    public String generateOTP(String email) {
        Random random = new Random();
        String otp = String.format("%06d", random.nextInt(1000000));
        otpCache.put(email, otp);
        return otp;
    }

    // 2. Gửi mail thật đến hòm thư của nàng thơ
    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("Beauty Glow <email_cua_nang@gmail.com>");
        message.setTo(toEmail);
        message.setSubject("Mã OTP xác nhận đổi mật khẩu 🌸");
        message.setText("Chào nàng thơ,\n\nMã xác nhận của nàng là: " + otp + 
                        "\n\nVui lòng nhập mã này vào App để đặt lại mật khẩu nhé. Mã có hiệu lực trong 5 phút.");
        mailSender.send(message);
    }

    // 3. Kiểm tra mã nàng nhập có đúng không
    public boolean validateOTP(String email, String otp) {
        return otp.equals(otpCache.get(email));
    }

    public void clearOTP(String email) {
        otpCache.remove(email);
    }
}