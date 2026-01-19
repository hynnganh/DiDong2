package com.ngocanh.anh05.controller;

import com.ngocanh.anh05.entity.Order;
import com.ngocanh.anh05.payloads.OrderDTO;
import com.ngocanh.anh05.payloads.OrderResponse;
import com.ngocanh.anh05.repository.OrderRepo;
import com.ngocanh.anh05.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepo orderRepo;

    /**
     * ✅ ENDPOINT ĐẶT HÀNG CHÍNH (Khớp với Frontend App)
     * URL: POST /api/public/users/{emailId}/carts/{cartId}/payments/{paymentMethod}/order
     */
@PostMapping("/public/users/{emailId}/carts/{cartId}/payments/{paymentMethod}/order")
public ResponseEntity<OrderDTO> orderProducts(
        @PathVariable String emailId,
        @PathVariable Long cartId,
        @PathVariable String paymentMethod,
        @RequestParam String address,     // Hứng từ FE params
        @RequestParam String city,        // Hứng từ FE params
        @RequestParam Double shippingFee  // Hứng từ FE params
) {
    // Gọi Service xử lý lưu đơn hàng
    OrderDTO orderDTO = orderService.placeOrder(emailId, cartId, paymentMethod, address, city, shippingFee);
    return new ResponseEntity<>(orderDTO, HttpStatus.CREATED);
}

    /**
     * ✅ ENDPOINT DỰ PHÒNG (Có thể xóa nếu không dùng)
     */
    @PostMapping("/public/users/{emailId}/carts/{cartId}/place-order")
    public ResponseEntity<OrderDTO> placeOrderWithAddress(
            @PathVariable String emailId,
            @PathVariable Long cartId,
            @RequestParam String paymentMethod,
            @RequestParam String city, 
            @RequestParam String detailAddress,
            @RequestParam Double shippingFee) {
        
        OrderDTO orderDTO = orderService.placeOrder(emailId, cartId, paymentMethod, detailAddress, city, shippingFee);
        return new ResponseEntity<>(orderDTO, HttpStatus.CREATED);
    }

    /**
     * ✅ CẬP NHẬT ĐỊA CHỈ: Cho phép khách hàng đổi địa chỉ sau khi đặt (nếu chưa giao)
     */
    @PutMapping("/public/users/{emailId}/orders/{orderId}/shipping-address")
    public ResponseEntity<OrderDTO> updateShippingAddress(
            @PathVariable String emailId,
            @PathVariable Long orderId,
            @RequestParam String shippingAddress) {
        
        OrderDTO orderDTO = orderService.updateShippingAddress(emailId, orderId, shippingAddress);
        return new ResponseEntity<>(orderDTO, HttpStatus.OK);
    }

    // ==========================================
    //          TRUY VẤN ĐƠN HÀNG (GET)
    // ==========================================

    @GetMapping("/public/users/{emailId}/orders")
    public ResponseEntity<List<OrderDTO>> getOrdersByUser(@PathVariable String emailId) {
        List<OrderDTO> orders = orderService.getOrdersByUser(emailId);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/public/users/{emailId}/orders/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(
            @PathVariable String emailId,
            @PathVariable Long orderId) {
        OrderDTO orderDTO = orderService.getOrder(emailId, orderId);
        return new ResponseEntity<>(orderDTO, HttpStatus.OK);
    }

    @GetMapping("/admin/orders")
    public ResponseEntity<OrderResponse> getAllOrders(
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(defaultValue = "orderId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder) {
        
        OrderResponse orders = orderService.getAllOrders(pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    // ==========================================
    //          QUẢN TRỊ & DEBUG
    // ==========================================

    @PutMapping("/admin/orders/{orderId}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String orderStatus) {
        // Mặc định email admin để bypass kiểm tra sở hữu đơn hàng
        OrderDTO orderDTO = orderService.updateOrder("admin@example.com", orderId, orderStatus);
        return new ResponseEntity<>(orderDTO, HttpStatus.OK);
    }

    @GetMapping("/admin/debug/orders/{orderId}")
    public ResponseEntity<Map<String, Object>> debugOrder(@PathVariable Long orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        
        Map<String, Object> response = new HashMap<>();
        response.put("orderId", order.getOrderId());
        response.put("email", order.getEmail());
        response.put("shippingAddress", order.getShippingAddress());
        response.put("totalAmount", order.getTotalAmount());
        response.put("orderStatus", order.getOrderStatus());
        
        return ResponseEntity.ok(response);
    }
}