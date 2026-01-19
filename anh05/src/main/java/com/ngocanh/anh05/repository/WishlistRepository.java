package com.ngocanh.anh05.repository;
import com.ngocanh.anh05.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUserId(Long userId);
    Optional<Wishlist> findByUserIdAndProductId(Long userId, Long productId);
}

