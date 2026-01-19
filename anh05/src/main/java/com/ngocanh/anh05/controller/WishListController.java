package com.ngocanh.anh05.controller;

import com.ngocanh.anh05.entity.Wishlist;
import com.ngocanh.anh05.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
public class WishListController {

    @Autowired
    private WishlistService service;

    /* ================= ADD ================= */
    @PostMapping("/add")
    public ResponseEntity<?> add(
            @RequestParam Long userId,
            @RequestParam Long productId
    ){
        service.add(userId, productId);
        return ResponseEntity.ok("Added to wishlist");
    }

    /* ================= REMOVE ================= */
    @DeleteMapping("/remove")
    public ResponseEntity<?> remove(
            @RequestParam Long userId,
            @RequestParam Long productId
    ){
        service.remove(userId, productId);
        return ResponseEntity.ok("Removed from wishlist");
    }

    /* ================= GET USER WISHLIST ================= */
    @GetMapping("/{userId}")
    public ResponseEntity<List<Wishlist>> get(@PathVariable Long userId){
        return ResponseEntity.ok(service.getUserWishlist(userId));
    }
}
