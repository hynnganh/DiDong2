// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05.controller;

import com.ngocanh.anh05.entity.Category;
import com.ngocanh.anh05.payloads.CategoryDTO;
import com.ngocanh.anh05.payloads.CategoryResponse;
import com.ngocanh.anh05.service.CategoryService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api"})
@SecurityRequirement(
   name = "E-Commerce Application"
)
@CrossOrigin(
   origins = {"*"}
)
public class CategoryController {
   @Autowired
   private CategoryService categoryService;

   public CategoryController() {
   }

   @PostMapping({"/admin/categories"})
   public ResponseEntity<CategoryDTO> createCategory(@RequestBody @Valid Category category) {
      CategoryDTO savedCategoryDTO = this.categoryService.createCategory(category);
      return new ResponseEntity(savedCategoryDTO, HttpStatus.CREATED);
   }

   @GetMapping({"/public/categories"})
   public ResponseEntity<CategoryResponse> getCategories(@RequestParam(name = "pageNumber",defaultValue = "0",required = false) Integer pageNumber, @RequestParam(name = "pageSize",defaultValue = "50",required = false) Integer pageSize, @RequestParam(name = "sortBy",defaultValue = "categoryId",required = false) String sortBy, @RequestParam(name = "sortOrder",defaultValue = "asc",required = false) String sortOrder) {
      CategoryResponse categoryResponse = this.categoryService.getCategories(pageNumber == 0 ? pageNumber : pageNumber - 1, pageSize, "id".equals(sortBy) ? "categoryId" : sortBy, sortOrder);
      return new ResponseEntity(categoryResponse, HttpStatus.OK);
   }

   @GetMapping({"/public/categories/{categoryId}"})
   public ResponseEntity<CategoryDTO> getOneCategory(@PathVariable Long categoryId) {
      CategoryDTO categoryDTO = this.categoryService.getCategoryById(categoryId);
      return new ResponseEntity(categoryDTO, HttpStatus.OK);
   }

   @PutMapping({"/admin/categories/{categoryId}"})
   public ResponseEntity<CategoryDTO> updateCategory(@RequestBody Category category, @PathVariable Long categoryId) {
      CategoryDTO categoryDTO = this.categoryService.updateCategory(category, categoryId);
      return new ResponseEntity(categoryDTO, HttpStatus.OK);
   }

   @DeleteMapping({"/admin/categories/{categoryId}"})
   public ResponseEntity<String> deleteCategory(@PathVariable Long categoryId) {
      String status = this.categoryService.deleteCategory(categoryId);
      return new ResponseEntity(status, HttpStatus.OK);
   }
}
