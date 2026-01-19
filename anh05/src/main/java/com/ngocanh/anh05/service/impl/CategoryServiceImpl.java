// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05.service.impl;

import com.ngocanh.anh05.entity.Category;
import com.ngocanh.anh05.entity.Product;
import com.ngocanh.anh05.exceptions.ResourceNotFoundException;
import com.ngocanh.anh05.payloads.CategoryDTO;
import com.ngocanh.anh05.payloads.CategoryResponse;
import com.ngocanh.anh05.repository.CategoryRepo;
import com.ngocanh.anh05.service.CategoryService;
import com.ngocanh.anh05.service.ProductService;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Transactional
@Service
public class CategoryServiceImpl implements CategoryService {
   @Autowired
   private CategoryRepo categoryRepo;
   @Autowired
   private ProductService productService;
   @Autowired
   private ModelMapper modelMapper;

   public CategoryServiceImpl() {
   }

   public CategoryDTO createCategory(Category category) {
      Category savedCategory = this.categoryRepo.findByCategoryName(category.getCategoryName());
      savedCategory = (Category)this.categoryRepo.save(category);
      return (CategoryDTO)this.modelMapper.map(savedCategory, CategoryDTO.class);
   }

   public CategoryResponse getCategories(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
      Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(new String[]{sortBy}).ascending() : Sort.by(new String[]{sortBy}).descending();
      Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
      Page<Category> pageCategories = this.categoryRepo.findAll(pageDetails);
      List<Category> categories = pageCategories.getContent();
      List<CategoryDTO> categoryDTOs = (List)categories.stream().map((category) -> {
         return (CategoryDTO)this.modelMapper.map(category, CategoryDTO.class);
      }).collect(Collectors.toList());
      CategoryResponse categoryResponse = new CategoryResponse();
      categoryResponse.setContent(categoryDTOs);
      categoryResponse.setPageNumber(pageCategories.getNumber());
      categoryResponse.setPageSize(pageCategories.getSize());
      categoryResponse.setTotalElements(pageCategories.getTotalElements());
      categoryResponse.setTotalPages(pageCategories.getTotalPages());
      categoryResponse.setLastPage(pageCategories.isLast());
      return categoryResponse;
   }

   public CategoryDTO getCategoryById(Long categoryId) {
      Optional<Category> categoryOptional = this.categoryRepo.findById(categoryId);
      if (categoryOptional.isPresent()) {
         Category category = (Category)categoryOptional.get();
         return (CategoryDTO)this.modelMapper.map(category, CategoryDTO.class);
      } else {
         throw new ResourceNotFoundException("Category", "categoryId", categoryId);
      }
   }

   public CategoryDTO updateCategory(Category category, Long categoryId) {
      Category var10000 = (Category)this.categoryRepo.findById(categoryId).orElseThrow(() -> {
         return new ResourceNotFoundException("Category", "categoryId", categoryId);
      });
      category.setCategoryId(categoryId);
      Category savedCategory = (Category)this.categoryRepo.save(category);
      return (CategoryDTO)this.modelMapper.map(savedCategory, CategoryDTO.class);
   }

   public String deleteCategory(Long categoryId) {
      Category category = (Category)this.categoryRepo.findById(categoryId).orElseThrow(() -> {
         return new ResourceNotFoundException("Category", "categoryId", categoryId);
      });
      List<Product> products = category.getProducts();
      products.forEach((product) -> {
         this.productService.deleteProduct(product.getProductId());
      });
      this.categoryRepo.delete(category);
      return "Category with categoryId: " + categoryId + " deleted successfully !!!";
   }
}
