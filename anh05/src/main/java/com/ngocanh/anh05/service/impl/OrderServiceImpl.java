package com.ngocanh.anh05.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.ngocanh.anh05.entity.*;
import com.ngocanh.anh05.exceptions.APIException;
import com.ngocanh.anh05.exceptions.ResourceNotFoundException;
import com.ngocanh.anh05.payloads.OrderDTO;
import com.ngocanh.anh05.payloads.OrderItemDTO;
import com.ngocanh.anh05.payloads.OrderResponse;
import com.ngocanh.anh05.repository.*;
import com.ngocanh.anh05.service.OrderService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    @Autowired private CartRepo cartRepo;
    @Autowired private OrderRepo orderRepo;
    @Autowired private PaymentRepo paymentRepo;
    @Autowired private OrderItemRepo orderItemRepo;
    @Autowired private CartItemRepo cartItemRepo;
    @Autowired private ProductRepo productRepo;
    @Autowired private ModelMapper modelMapper;

    @Override
    @Transactional
    public OrderDTO placeOrder(String emailId, Long cartId, String paymentMethod, String address, String city, Double shippingFee) {
    
        // 1. Kiểm tra giỏ hàng
        Cart cart = cartRepo.findCartByEmailAndCartId(emailId, cartId);
        if (cart == null) throw new ResourceNotFoundException("Cart", "cartId", cartId);
        if (cart.getCartItems().isEmpty()) throw new APIException("Giỏ hàng của nàng đang trống rỗng nè!");

        // 2. Tạo đối tượng Order
        Order order = new Order();
        order.setEmail(emailId);
        order.setOrderDate(LocalDate.now());
        order.setOrderStatus("Order Accepted !");
        
        // ✅ LƯU ĐỊA CHỈ: Gộp địa chỉ chi tiết và Thành phố
        String fullAddress = address + ", " + city;
        order.setShippingAddress(fullAddress); 
        
        // ✅ LƯU PHÍ SHIP: Nhận trực tiếp từ Frontend gửi lên
        order.setShippingFee(shippingFee); 
        
        // ✅ TỔNG TIỀN: Tiền hàng + Phí ship
        order.setTotalAmount(cart.getTotalPrice() + shippingFee);

        // 3. Xử lý Payment
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setPaymentMethod(paymentMethod);
        payment = paymentRepo.save(payment);
        order.setPayment(payment);

        Order savedOrder = orderRepo.save(order);

        // 4. Chuyển đổi CartItems thành OrderItems & Cập nhật kho
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cart.getCartItems()) {
            Product product = cartItem.getProduct();
            
            if (product.getQuantity() < cartItem.getQuantity()) {
                throw new APIException("Sản phẩm " + product.getProductName() + " đã hết hàng mất rồi!");
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setDiscount(cartItem.getDiscount());
            orderItem.setOrderedProductPrice(cartItem.getProductPrice());
            orderItem.setOrder(savedOrder);
            orderItems.add(orderItem);

            product.setQuantity(product.getQuantity() - cartItem.getQuantity());
            productRepo.save(product);
            
            cartItemRepo.delete(cartItem);
        }
        orderItemRepo.saveAll(orderItems);

        // 5. Reset Giỏ hàng
        cart.getCartItems().clear();
        cart.setTotalPrice(0.0);
        cartRepo.save(cart);

        // 6. Map dữ liệu sang DTO trả về
        OrderDTO orderDTO = modelMapper.map(savedOrder, OrderDTO.class);
        
        // Gán thủ công danh sách items để tránh lỗi mapping List
        List<OrderItemDTO> itemDTOs = orderItems.stream()
                .map(item -> modelMapper.map(item, OrderItemDTO.class))
                .collect(Collectors.toList());
        orderDTO.setOrderItems(itemDTOs);

        return orderDTO;
    }

    @Override
    public OrderDTO getOrder(String emailId, Long orderId) {
        Order order = orderRepo.findOrderByEmailAndOrderId(emailId, orderId);
        if (order == null) throw new ResourceNotFoundException("Order", "orderId", orderId);
        return modelMapper.map(order, OrderDTO.class);
    }

    @Override
    public List<OrderDTO> getOrdersByUser(String emailId) {
        List<Order> orders = orderRepo.findAllByEmail(emailId);
        return orders.stream()
                .map(order -> modelMapper.map(order, OrderDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponse getAllOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Order> pageOrders = orderRepo.findAll(pageDetails);
        List<Order> orders = pageOrders.getContent();

        List<OrderDTO> orderDTOs = orders.stream()
                .map(order -> modelMapper.map(order, OrderDTO.class))
                .collect(Collectors.toList());

        OrderResponse orderResponse = new OrderResponse();
        orderResponse.setContent(orderDTOs);
        orderResponse.setPageNumber(pageOrders.getNumber());
        orderResponse.setPageSize(pageOrders.getSize());
        orderResponse.setTotalElements(pageOrders.getTotalElements());
        orderResponse.setTotalPages(pageOrders.getTotalPages());
        orderResponse.setLastPage(pageOrders.isLast());

        return orderResponse;
    }

    @Override
    public OrderDTO updateOrder(String emailId, Long orderId, String orderStatus) {
        Order order = orderRepo.findOrderByEmailAndOrderId(emailId, orderId);
        if (order == null) throw new ResourceNotFoundException("Order", "orderId", orderId);

        order.setOrderStatus(orderStatus);
        return modelMapper.map(orderRepo.save(order), OrderDTO.class);
    }

    @Override
    public OrderDTO updateShippingAddress(String emailId, Long orderId, String shippingAddress) {
        Order order = orderRepo.findOrderByEmailAndOrderId(emailId, orderId);
        if (order == null) throw new ResourceNotFoundException("Order", "orderId", orderId);

        order.setShippingAddress(shippingAddress);
        return modelMapper.map(orderRepo.save(order), OrderDTO.class);
    }
}