package com.ngocanh.anh05.payloads;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {

    private Long orderId;
    private String email;
    private List<OrderItemDTO> orderItems = new ArrayList<>();
    private LocalDate orderDate;
    private PaymentDTO payment;
    
    // ✅ TỔNG SỐ TIỀN CUỐI CÙNG (Đã bao gồm phí ship)
    private Double totalAmount;
    
    // ✅ BỔ SUNG: Phí vận chuyển riêng để hiển thị trên hóa đơn
    private Double shippingFee;
    
    private String orderStatus;
    
    // ✅ ĐỊA CHỈ GIAO HÀNG (Detail + City)
    private String shippingAddress;
}