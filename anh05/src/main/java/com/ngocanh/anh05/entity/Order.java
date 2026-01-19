package com.ngocanh.anh05.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @Email
    @Column(nullable = false)
    private String email;

    @OneToMany(mappedBy = "order", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    private LocalDate orderDate;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "payment_id")
    private Payment payment;

    private Double totalAmount; // Tổng tiền (Giá hàng + Phí ship)
    
    private Double shippingFee; // ✅ Lưu phí ship riêng để đối soát
    
    private String orderStatus;
    
    @Column(name = "shipping_address", nullable = false, length = 500)
    private String shippingAddress;

    // Helper method để tính toán tổng tiền
    public void calculateTotal(Double cartPrice, Double fee) {
        this.shippingFee = fee;
        this.totalAmount = cartPrice + fee;
    }
}