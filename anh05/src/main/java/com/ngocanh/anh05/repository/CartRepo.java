package com.ngocanh.anh05.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.ngocanh.anh05.entity.Cart;


@Repository
public interface CartRepo extends JpaRepository<Cart, Long> {

    @Query("SELECT c FROM Cart c WHERE c.user.email = ?1 AND c.cartId = ?2")
    Cart findCartByEmailAndCartId(String email, Long cartId);

    @Query("SELECT c FROM Cart c JOIN FETCH c.cartItems ci JOIN FETCH ci.product p WHERE p.id = ?1")
    List<Cart> findCartsByProductId(Long productId);

    @Query("SELECT c FROM Cart c WHERE c.user.email = ?1")
    Cart findByUserEmail(String email);

    // ✅ SỬA: Trả về Optional thay vì Cart
    @Query("SELECT DISTINCT c FROM Cart c LEFT JOIN FETCH c.cartItems ci LEFT JOIN FETCH ci.product WHERE c.cartId = ?1")
    Optional<Cart> findByIdWithItems(Long cartId);

    // ✅ THÊM: Method với Optional cho email
    @Query("SELECT DISTINCT c FROM Cart c LEFT JOIN FETCH c.cartItems ci LEFT JOIN FETCH ci.product WHERE c.user.email = ?1")
    Optional<Cart> findByUserEmailWithItems(String email);

    //
    @Query("SELECT c FROM Cart c JOIN c.user u WHERE u.email = ?1 AND c.cartId = ?2")
    Cart findByUserEmailAndCartId(String email, Long cartId);


}