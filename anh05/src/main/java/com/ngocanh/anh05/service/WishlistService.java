package com.ngocanh.anh05.service;

import com.ngocanh.anh05.entity.Wishlist;
import com.ngocanh.anh05.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository repo;

    public void add(Long userId, Long productId){
        Optional<Wishlist> existing =
                repo.findByUserIdAndProductId(userId, productId);

        if(existing.isEmpty()){
            Wishlist wishlist = new Wishlist();
            wishlist.setUserId(userId);
            wishlist.setProductId(productId);
            wishlist.setCreatedAt(LocalDateTime.now());
            repo.save(wishlist);
        }
    }

    public void remove(Long userId, Long productId){
        repo.findByUserIdAndProductId(userId, productId)
            .ifPresent(repo::delete);
    }

    public List<Wishlist> getUserWishlist(Long userId){
        return repo.findByUserId(userId);
    }
}
