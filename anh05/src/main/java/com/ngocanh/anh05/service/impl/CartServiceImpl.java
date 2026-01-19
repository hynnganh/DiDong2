package com.ngocanh.anh05.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ngocanh.anh05.entity.Cart;
import com.ngocanh.anh05.entity.CartItem;
import com.ngocanh.anh05.entity.Product;
import com.ngocanh.anh05.entity.User;
import com.ngocanh.anh05.exceptions.APIException;
import com.ngocanh.anh05.exceptions.ResourceNotFoundException;
import com.ngocanh.anh05.payloads.CartDTO;
import com.ngocanh.anh05.payloads.ProductDTO;
import com.ngocanh.anh05.repository.CartItemRepo;
import com.ngocanh.anh05.repository.CartRepo;
import com.ngocanh.anh05.repository.ProductRepo;
import com.ngocanh.anh05.repository.UserRepo;
import com.ngocanh.anh05.service.CartService;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class CartServiceImpl implements CartService {

    private static final Logger logger = LoggerFactory.getLogger(CartServiceImpl.class);

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private CartItemRepo cartItemRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ModelMapper modelMapper;

    // Phương thức helper để chuyển Cart thành CartDTO
    private CartDTO convertToCartDTO(Cart cart) {
        CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
        cartDTO.setUserEmail(cart.getUser().getEmail());
        
        // Map danh sách sản phẩm với quantity từ cart item
        List<ProductDTO> productDTOs = cart.getCartItems().stream()
                .map(item -> {
                    Product product = item.getProduct();
                    ProductDTO dto = modelMapper.map(product, ProductDTO.class);
                    dto.setQuantity(item.getQuantity());
                    
                    // Đảm bảo image được map đúng
                    if (product.getImage() != null) {
                        dto.setImage(product.getImage());
                    }
                    
                    // Set additional fields
                    dto.setProductName(product.getProductName());
                    dto.setSpecialPrice(product.getSpecialPrice());
                    dto.setPrice(product.getPrice());
                    dto.setDiscount(product.getDiscount());
                    
                    return dto;
                })
                .collect(Collectors.toList());
        cartDTO.setProducts(productDTOs);
        
        return cartDTO;
    }

    @Override
    public CartDTO createCart(String emailId) {
        // Tìm user theo email
        User user = userRepo.findByEmail(emailId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", emailId));

        // Kiểm tra xem user đã có cart chưa
        Cart existingCart = cartRepo.findByUserEmail(emailId);
        if (existingCart != null) {
            return convertToCartDTO(existingCart);
        }

        // Tạo cart mới
        Cart cart = new Cart();
        cart.setUser(user);
        cart.setTotalPrice(0.0);
        cart.setCartItems(new ArrayList<>());
        
        Cart savedCart = cartRepo.save(cart);
        
        return convertToCartDTO(savedCart);
    }

    @Override
    public CartDTO getActiveCart(String emailId) {
        Cart cart = cartRepo.findByUserEmail(emailId);
        if (cart == null) {
            // Nếu chưa có cart, tạo mới
            return createCart(emailId);
        }
        
        return convertToCartDTO(cart);
    }

    @Override
    public CartDTO addProductToCart(Long cartId, Long productId, Integer quantity) {
        // Lấy giỏ hàng
        Cart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));

        // Lấy sản phẩm
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        // Kiểm tra sản phẩm đã có trong giỏ chưa
        CartItem cartItem = cartItemRepo.findCartItemByProductIdAndCartId(cartId, productId);
        if (cartItem != null) {
            throw new APIException("Product " + product.getProductName() + " already exists in the cart");
        }

        // Kiểm tra tồn kho
        if (product.getQuantity() < quantity) {
            throw new APIException("Please, make an order of the " + product.getProductName()
                    + " less than or equal to the quantity " + product.getQuantity() + ".");
        }

        // ✅ TÍNH TOÁN GIÁ TRƯỚC KHI THÊM
        double itemPrice = product.getSpecialPrice();
        double itemTotal = itemPrice * quantity;

        // Tạo CartItem mới
        CartItem newCartItem = new CartItem();
        newCartItem.setProduct(product);
        newCartItem.setCart(cart);
        newCartItem.setQuantity(quantity);
        newCartItem.setDiscount(product.getDiscount());
        newCartItem.setProductPrice(itemPrice);
        cartItemRepo.save(newCartItem);

        // Thêm CartItem vào giỏ
        cart.getCartItems().add(newCartItem);

        // ✅ CẬP NHẬT TỔNG TIỀN TRƯỚC
        double newTotalPrice = cart.getTotalPrice() + itemTotal;
        cart.setTotalPrice(newTotalPrice);

        // Giảm số lượng tồn kho
        product.setQuantity(product.getQuantity() - quantity);

        cartRepo.save(cart);
        productRepo.save(product);

        logger.info("✅ ADDED - Cart: {}, Product: {}, Qty: {}, Price: {}, Total: {}", 
            cartId, productId, quantity, itemTotal, newTotalPrice);

        return convertToCartDTO(cart);
    }

    @Override
    public List<CartDTO> getAllCarts() {
        List<Cart> carts = cartRepo.findAll();
        if (carts.isEmpty()) {
            throw new APIException("No cart exists");
        }

        List<CartDTO> cartDTOs = carts.stream().map(cart -> {
            return convertToCartDTO(cart);
        }).collect(Collectors.toList());

        return cartDTOs;
    }

    @Override
    public CartDTO getCart(String emailId, Long cartId) {
        // Tìm giỏ hàng theo email và cartId
        Cart cart = cartRepo.findCartByEmailAndCartId(emailId, cartId);

        if (cart == null) {
            throw new ResourceNotFoundException("Cart", "cartId", cartId);
        }

        // Kiểm tra xem cart có thuộc về user không
        if (!cart.getUser().getEmail().equals(emailId)) {
            throw new APIException("Cart does not belong to user: " + emailId);
        }

        return convertToCartDTO(cart);
    }

    @Override
    public void updateProductInCarts(Long cartId, Long productId) {
        Cart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
        CartItem cartItem = cartItemRepo.findCartItemByProductIdAndCartId(cartId, productId);
        if (cartItem == null) {
            throw new APIException("Product " + product.getProductName() + " not available in the cart!!!");
        }
        
        // ✅ TÍNH TOÁN LẠI ĐÚNG
        double oldItemTotal = cartItem.getProductPrice() * cartItem.getQuantity();
        double newItemTotal = product.getSpecialPrice() * cartItem.getQuantity();
        double newCartTotal = cart.getTotalPrice() - oldItemTotal + newItemTotal;
        
        cartItem.setProductPrice(product.getSpecialPrice());
        cart.setTotalPrice(newCartTotal);
        
        cartItemRepo.save(cartItem);
        cartRepo.save(cart);

        logger.info("✅ UPDATED PRICE - Cart: {}, Product: {}, OldTotal: {}, NewTotal: {}", 
            cartId, productId, oldItemTotal, newItemTotal);
    }

    @Override
    public CartDTO updateProductQuantityInCart(Long cartId, Long productId, Integer quantity) {
        Cart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        CartItem cartItem = cartItemRepo.findCartItemByProductIdAndCartId(cartId, productId);
        if (cartItem == null) {
            throw new APIException("Product " + product.getProductName() + " not available in the cart!!!");
        }

        // ✅ TÍNH TOÁN SỐ LƯỢNG THAY ĐỔI ĐÚNG
        int oldQuantity = cartItem.getQuantity();
        int quantityDifference = quantity - oldQuantity;

        // Kiểm tra tồn kho
        if (quantityDifference > 0 && product.getQuantity() < quantityDifference) {
            throw new APIException("Not enough stock for " + product.getProductName() + 
                ". Available: " + product.getQuantity() + ", Requested: " + quantityDifference);
        }

        // ✅ TÍNH TOÁN GIÁ ĐÚNG
        double itemPrice = cartItem.getProductPrice(); // Giữ nguyên giá đã set
        double oldItemTotal = itemPrice * oldQuantity;
        double newItemTotal = itemPrice * quantity;
        
        // Cập nhật tổng tiền giỏ hàng
        double newCartTotal = cart.getTotalPrice() - oldItemTotal + newItemTotal;
        cart.setTotalPrice(newCartTotal);

        // Cập nhật số lượng tồn kho
        if (quantityDifference > 0) {
            // Tăng số lượng -> giảm tồn kho
            product.setQuantity(product.getQuantity() - quantityDifference);
        } else if (quantityDifference < 0) {
            // Giảm số lượng -> tăng tồn kho
            product.setQuantity(product.getQuantity() + Math.abs(quantityDifference));
        }

        // Cập nhật cart item
        cartItem.setQuantity(quantity);
        
        cartItemRepo.save(cartItem);
        productRepo.save(product);
        cartRepo.save(cart);

        logger.info("✅ UPDATED QTY - Cart: {}, Product: {}, OldQty: {}, NewQty: {}, Total: {}", 
            cartId, productId, oldQuantity, quantity, newCartTotal);

        return convertToCartDTO(cart);
    }

    @Override
    public String deleteProductFromCart(Long cartId, Long productId) {
        Cart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));

        CartItem cartItem = cartItemRepo.findCartItemByProductIdAndCartId(cartId, productId);
        if (cartItem == null) {
            throw new ResourceNotFoundException("Product", "productId", productId);
        }

        // ✅ TÍNH TOÁN GIÁ TRỊ CẦN TRỪ ĐÚNG
        double itemTotal = cartItem.getProductPrice() * cartItem.getQuantity();
        double newTotalPrice = cart.getTotalPrice() - itemTotal;
        
        // Đảm bảo không âm
        cart.setTotalPrice(Math.max(0.0, newTotalPrice));

        Product product = cartItem.getProduct();
        // Hoàn trả số lượng tồn kho
        product.setQuantity(product.getQuantity() + cartItem.getQuantity());

        // Xóa cart item
        cartItemRepo.deleteCartItemByProductIdAndCartId(cartId, productId);

        cartRepo.save(cart);
        productRepo.save(product);

        logger.info("✅ DELETED - Cart: {}, Product: {}, RemovedAmount: {}, NewTotal: {}", 
            cartId, productId, itemTotal, newTotalPrice);

        return "Product " + cartItem.getProduct().getProductName() + " removed from the cart !!!";
    }

    @Override
    public CartDTO getCartByIdForAdmin(Long cartId) {
        Cart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));

        return convertToCartDTO(cart);
    }

    // @Override
    // public void clearCart(Long cartId) {
    //     Cart cart = cartRepo.findById(cartId)
    //             .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));
        
    //     // ✅ TÍNH TOÁN TỔNG TIỀN CẦN TRỪ
    //     double totalToRemove = 0.0;
    //     for (CartItem item : cart.getCartItems()) {
    //         totalToRemove += item.getProductPrice() * item.getQuantity();
            
    //         Product product = item.getProduct();
    //         product.setQuantity(product.getQuantity() + item.getQuantity());
    //         productRepo.save(product);
    //     }
        
    //     // Xóa tất cả cart items
    //     cart.getCartItems().clear();
    //     cart.setTotalPrice(0.0);
    //     cartRepo.save(cart);
        
    //     logger.info("✅ CLEARED - Cart: {}, RemovedTotal: {}", cartId, totalToRemove);
    // }

    // ✅ THÊM PHƯƠNG THỨC ĐỂ FIX CÁC CART BỊ LỖI
    public String fixCartTotals(Long cartId) {
        try {
            Cart cart = cartRepo.findById(cartId)
                    .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));
            
            // Tính lại tổng tiền từ tất cả cart items
            double calculatedTotal = cart.getCartItems().stream()
                    .mapToDouble(item -> item.getProductPrice() * item.getQuantity())
                    .sum();
            
            double oldTotal = cart.getTotalPrice();
            cart.setTotalPrice(calculatedTotal);
            cartRepo.save(cart);
            
            logger.info("✅ FIXED - Cart: {}, OldTotal: {}, NewTotal: {}", 
                cartId, oldTotal, calculatedTotal);
            
            return String.format("Fixed cart %d: %f -> %f", cartId, oldTotal, calculatedTotal);
        } catch (Exception e) {
            logger.error("❌ ERROR fixing cart {}: {}", cartId, e.getMessage());
            return "Error fixing cart: " + e.getMessage();
        }
    }

    @Override
    public List<CartDTO> getUserCarts(String adminEmail, String userEmail) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getUserCarts'");
    }

@Transactional
@Override
public void clearCart(Long cartId) {
    // 1. Tìm Cart
    Cart cart = cartRepo.findById(cartId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));

    // 2. Lấy danh sách các món trong giỏ
    List<CartItem> items = cart.getCartItems();

    if (items != null && !items.isEmpty()) {
        // CƯỠNG CHẾ XÓA: Xóa trực tiếp list này bằng Repo
        cartItemRepo.deleteAllInBatch(items); 
        
        // Xóa sạch list trong đối tượng Java để đồng bộ bộ nhớ
        cart.getCartItems().clear();
    }

    // 3. Reset tổng tiền và lưu
    cart.setTotalPrice(0.0);
    cartRepo.save(cart);
    
    // 4. Ép ghi xuống DB ngay lập tức
    cartRepo.flush(); 
    
    System.out.println("=== ĐÃ DỌN DẸP GIỎ HÀNG THÀNH CÔNG TRONG DATABASE ===");
}
}