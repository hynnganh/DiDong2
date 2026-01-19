package com.ngocanh.anh05.payloads;

import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO {
    private Long cartId;
    private Double totalPrice = 0.0;
    private String userEmail;
    private List<ProductDTO> products = new ArrayList<>();


    

    // Helper method to get total items count
    public int getTotalItems() {
        return products != null ? products.size() : 0;
    }
    
    // Helper method to check if cart has products with images
    public boolean hasProductsWithImages() {
        if (products == null) return false;
        return products.stream().anyMatch(product -> product.getImage() != null && !product.getImage().isEmpty());
    }
}