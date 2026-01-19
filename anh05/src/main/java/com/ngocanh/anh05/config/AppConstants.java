package com.ngocanh.anh05.config;

public class AppConstants {
    // --- Pagination & Sorting Defaults ---
    public static final String PAGE_NUMBER = "0";
    public static final String PAGE_SIZE = "2";
    public static final String SORT_CATEGORIES_BY = "categoryId";
    public static final String SORT_PRODUCTS_BY = "productId";
    public static final String SORT_USERS_BY = "userId";
    public static final String SORT_ORDERS_BY = "totalAmount";
    public static final String SORT_DIR = "asc";

    // --- Role IDs (Khớp với Database) ---
    public static final Long ADMIN_ID = 101L;
    public static final Long USER_ID = 102L;

    // --- Security Config ---
    public static final long JWT_TOKEN_VALIDITY = 5 * 60 * 60; // 5 Giờ

    // ✅ URL CÔNG KHAI: Không cần Token (Fix lỗi 401 khi Đăng ký/Đăng nhập)
    public static final String[] PUBLIC_URLS = new String[]{
        "/v3/api-docs/**",
        "/swagger-ui/**",
        "/swagger-ui.html",
        "/api/register",      // Khớp chính xác POST /api/register
        "/api/register/**",   // Khớp các đường dẫn con nếu có
        "/api/login",         // Khớp chính xác POST /api/login
        "/api/public/**",     // Cho phép xem sản phẩm, ảnh mà không cần login
        "/api/public/products/**",
        "/api/public/categories/**",
        "/api/public/products/image/**",
        "/api/forgot-password",
        "/api/forgot-password/**",

    };

    // 🔐 URL CHO USER: Yêu cầu quyền USER hoặc ADMIN
    public static final String[] USER_URLS = new String[]{
        "/api/user/**",
        "/api/public/carts/**",  // Giỏ hàng bắt buộc phải login để lưu theo User
        "/api/wishlist/**",
        "/api/orders/**",
        "/api/reset-password",
        "/api/reset-password/**",
        "/api/public/users/**"
    };

    // 🚫 URL CHO ADMIN: Chỉ ADMIN mới được vào
    public static final String[] ADMIN_URLS = new String[]{
        "/api/admin/**"
    };
}