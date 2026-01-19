package com.ngocanh.anh05.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.ngocanh.anh05.entity.Order;

@Repository
public interface OrderRepo extends JpaRepository<Order, Long> {

    // ✅ Cách 1: Dùng JPQL đúng cú pháp (nếu muốn tự viết query)
    @Query("SELECT o FROM Order o WHERE o.email = ?1 AND o.id = ?2")
    Order findOrderByEmailAndOrderId(String email, Long orderId);

    // ✅ Cách 2: Dùng Spring Data JPA query method (đề xuất — gọn & an toàn hơn)
    // Order findByEmailAndId(String email, Long orderId);
    // ✅ Lấy tất cả đơn hàng theo email người dùng
    List<Order> findAllByEmail(String email);
}
