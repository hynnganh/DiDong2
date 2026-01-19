package com.ngocanh.anh05.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ngocanh.anh05.payloads.CartDTO;
import com.ngocanh.anh05.payloads.ProductDTO;
import com.ngocanh.anh05.service.CartService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
@SecurityRequirement(name = "E-Commerce Application")
public class CartController {

    @Autowired
    private CartService cartService;

    // 🔐 ADMIN: Xem tất cả giỏ hàng (của tất cả users)
    @GetMapping("/admin/carts")
    public ResponseEntity<Map<String, Object>> getCarts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "cartId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder) {
        
        try {
            List<CartDTO> cartDTOs = cartService.getAllCarts();
            
            // Debug: log để kiểm tra dữ liệu
            System.out.println("=== DEBUG CART DATA ===");
            for (CartDTO cart : cartDTOs) {
                System.out.println("Cart ID: " + cart.getCartId());
                System.out.println("User Email: " + cart.getUserEmail());
                System.out.println("Total Price: " + cart.getTotalPrice());
                if (cart.getProducts() != null) {
                    System.out.println("Products count: " + cart.getProducts().size());
                    for (ProductDTO product : cart.getProducts()) {
                        System.out.println("  - Product: " + product.getProductName());
                        System.out.println("    Image: " + product.getImage());
                        System.out.println("    Quantity: " + product.getQuantity());
                    }
                }
                System.out.println("-------------------");
            }
            
            // Manual pagination
            int start = page * size;
            int end = Math.min(start + size, cartDTOs.size());
            
            if (start > cartDTOs.size()) {
                start = cartDTOs.size();
            }
            
            List<CartDTO> paginatedCarts = cartDTOs.subList(start, end);
            
            // Tạo response
            Map<String, Object> response = new HashMap<>();
            response.put("content", paginatedCarts);
            response.put("totalElements", cartDTOs.size());
            response.put("totalPages", (int) Math.ceil((double) cartDTOs.size() / size));
            response.put("size", size);
            response.put("number", page);
            response.put("first", page == 0);
            response.put("last", end >= cartDTOs.size());
            response.put("empty", cartDTOs.isEmpty());
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println("ERROR in getCarts: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("content", List.of());
            errorResponse.put("totalElements", 0);
            errorResponse.put("totalPages", 0);
            errorResponse.put("size", size);
            errorResponse.put("number", page);
            errorResponse.put("first", true);
            errorResponse.put("last", true);
            errorResponse.put("empty", true);
            return new ResponseEntity<>(errorResponse, HttpStatus.OK);
        }
    }

    // 🔐 ADMIN: Xem chi tiết giỏ hàng của user bất kỳ
    @GetMapping("/admin/carts/{cartId}")
    public ResponseEntity<CartDTO> getCartByIdForAdmin(
            @RequestHeader("email") String adminEmail,
            @PathVariable Long cartId) {
        CartDTO cartDTO = cartService.getCart(adminEmail, cartId);
        return new ResponseEntity<CartDTO>(cartDTO, HttpStatus.OK);
    }

    // 🔐 ADMIN: Xem tất cả giỏ hàng của một user cụ thể
    @GetMapping("/admin/users/{userEmail}/carts")
    public ResponseEntity<List<CartDTO>> getUserCartsForAdmin(
            @RequestHeader("email") String adminEmail,
            @PathVariable String userEmail) {
        List<CartDTO> cartDTOs = cartService.getUserCarts(adminEmail, userEmail);
        return new ResponseEntity<List<CartDTO>>(cartDTOs, HttpStatus.OK);
    }

    // 🔐 ADMIN: Xem giỏ hàng active của user cụ thể
    @GetMapping("/admin/users/{userEmail}/carts/active")
    public ResponseEntity<CartDTO> getActiveCartForAdmin(
            @RequestHeader("email") String adminEmail,
            @PathVariable String userEmail) {
        // Gọi service với email của admin (để check quyền) và email của user target
        CartDTO cartDTO = cartService.getActiveCart(userEmail);
        return new ResponseEntity<CartDTO>(cartDTO, HttpStatus.OK);
    }

    // USER: Tạo giỏ hàng mới
    @PostMapping("/public/users/{emailId}/carts")
    public ResponseEntity<CartDTO> createCart(@PathVariable String emailId) {
        CartDTO cartDTO = cartService.createCart(emailId);
        return new ResponseEntity<CartDTO>(cartDTO, HttpStatus.CREATED);
    }

    // 🔐 USER/ADMIN: Xem giỏ hàng theo ID (USER chỉ xem được của mình, ADMIN xem được tất cả)
    @GetMapping("/public/users/{emailId}/carts/{cartId}")
    public ResponseEntity<CartDTO> getCartById(
            @PathVariable String emailId,
            @PathVariable Long cartId) {
        CartDTO cartDTO = cartService.getCart(emailId, cartId);
        return new ResponseEntity<CartDTO>(cartDTO, HttpStatus.OK);
    }

    // USER: Xem giỏ hàng active của chính mình
    @GetMapping("/public/users/{emailId}/carts/active")
    public ResponseEntity<CartDTO> getActiveCart(@PathVariable String emailId) {
        CartDTO cartDTO = cartService.getActiveCart(emailId);
        return new ResponseEntity<CartDTO>(cartDTO, HttpStatus.OK);
    }

    // USER: Thêm sản phẩm vào giỏ hàng
    @PostMapping("/public/carts/{cartId}/products/{productId}/quantity/{quantity}")
    public ResponseEntity<CartDTO> addProductToCart(
            @PathVariable Long cartId,
            @PathVariable Long productId,
            @PathVariable Integer quantity) {
        CartDTO cartDTO = cartService.addProductToCart(cartId, productId, quantity);
        return new ResponseEntity<CartDTO>(cartDTO, HttpStatus.CREATED);
    }

    // USER: Cập nhật số lượng sản phẩm trong giỏ hàng
    @PutMapping("/public/carts/{cartId}/products/{productId}/quantity/{quantity}")
    public ResponseEntity<CartDTO> updateCartProduct(
            @PathVariable Long cartId,
            @PathVariable Long productId,
            @PathVariable Integer quantity) {
        CartDTO cartDTO = cartService.updateProductQuantityInCart(cartId, productId, quantity);
        return new ResponseEntity<CartDTO>(cartDTO, HttpStatus.OK);
    }

    // USER: Xóa sản phẩm khỏi giỏ hàng
    @DeleteMapping("/public/carts/{cartId}/products/{productId}")
    public ResponseEntity<String> deleteProductFromCart(
            @PathVariable Long cartId,
            @PathVariable Long productId) {
        String status = cartService.deleteProductFromCart(cartId, productId);
        return new ResponseEntity<String>(status, HttpStatus.OK);
    }

    // 🔐 ADMIN: Xóa giỏ hàng của user
    @DeleteMapping("/admin/carts/{cartId}")
    public ResponseEntity<String> clearCartForAdmin(
            @RequestHeader("email") String adminEmail,
            @PathVariable Long cartId) {
        cartService.clearCart(cartId);
        return new ResponseEntity<String>("Đã xóa giỏ hàng thành công", HttpStatus.OK);
    }

@DeleteMapping("/public/users/{emailId}/carts/{cartId}/clear")
public ResponseEntity<String> clearCart(@PathVariable String emailId, @PathVariable Long cartId) {
    // Chúng ta vẫn dùng chung hàm clearCart của Service
    cartService.clearCart(cartId);
    return new ResponseEntity<String>("Giỏ hàng đã được dọn dẹp sạch sẽ", HttpStatus.OK);
}
}