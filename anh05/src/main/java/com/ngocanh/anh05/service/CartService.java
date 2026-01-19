package com.ngocanh.anh05.service;

import java.util.List;
import com.ngocanh.anh05.payloads.CartDTO;

public interface CartService {

    CartDTO addProductToCart(Long cartId, Long productId, Integer quantity);

    List<CartDTO> getAllCarts(); // Trở lại dùng List

    CartDTO getCart(String emailId, Long cartId);

    CartDTO updateProductQuantityInCart(Long cartId, Long productId, Integer quantity);

    void updateProductInCarts(Long cartId, Long productId);

    String deleteProductFromCart(Long cartId, Long productId);

    CartDTO createCart(String emailId);

    CartDTO getActiveCart(String emailId);

    CartDTO getCartByIdForAdmin(Long cartId);

    void clearCart(Long cartId);

    List<CartDTO> getUserCarts(String adminEmail, String userEmail);


}
