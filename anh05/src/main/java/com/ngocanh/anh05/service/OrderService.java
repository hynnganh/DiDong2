package com.ngocanh.anh05.service;

import java.util.List;
import com.ngocanh.anh05.payloads.OrderDTO;
import com.ngocanh.anh05.payloads.OrderResponse;

public interface OrderService {
    // ✅ Hàm chính đầy đủ 6 tham số để nhận phí ship từ Frontend
    OrderDTO placeOrder(String emailId, Long cartId, String paymentMethod, String address, String city, Double shippingFee);

    // Truy vấn đơn hàng
    OrderDTO getOrder(String emailId, Long orderId);
    List<OrderDTO> getOrdersByUser(String emailId);
    OrderResponse getAllOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
    
    // Cập nhật đơn hàng
    OrderDTO updateOrder(String emailId, Long orderId, String orderStatus);
    OrderDTO updateShippingAddress(String emailId, Long orderId, String shippingAddress);
}