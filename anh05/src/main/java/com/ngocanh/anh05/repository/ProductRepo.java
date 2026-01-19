// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05.repository;

import com.ngocanh.anh05.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {
   Page<Product> findByProductNameLike(String keyword, Pageable pageDetails);

   Page<Product> findByCategoryCategoryId(Long categoryId, Pageable pageable);
   Page<Product> findByProductNameContainingIgnoreCase(String keyword, Pageable pageable);

   Page<Product> findByProductNameContainingIgnoreCaseAndCategory_CategoryId(
String keyword, Long categoryId, Pageable pageable);
}
