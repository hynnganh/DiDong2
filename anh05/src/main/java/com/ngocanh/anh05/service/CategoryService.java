// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05.service;

import com.ngocanh.anh05.entity.Category;
import com.ngocanh.anh05.payloads.CategoryDTO;
import com.ngocanh.anh05.payloads.CategoryResponse;

public interface CategoryService {
   CategoryDTO createCategory(Category category);

   CategoryResponse getCategories(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

   CategoryDTO getCategoryById(Long categoryId);

   CategoryDTO updateCategory(Category category, Long categoryId);

   String deleteCategory(Long categoryId);
}
