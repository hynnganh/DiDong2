// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05.controller;

import com.ngocanh.anh05.entity.Product;
import com.ngocanh.anh05.payloads.ProductDTO;
import com.ngocanh.anh05.payloads.ProductResponse;
import com.ngocanh.anh05.service.ProductService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping({"/api"})
@SecurityRequirement(
   name = "E-Commerce Application"
)
@CrossOrigin(
   origins = {"*"}
)
public class ProductController {
   @Autowired
   private ProductService productService;

   public ProductController() {
   }

   @PostMapping({"/admin/categories/{categoryId}/products"})
   public ResponseEntity<ProductDTO> addProduct(@RequestBody @Valid Product product, @PathVariable Long categoryId) {
      ProductDTO savedProduct = this.productService.addProduct(categoryId, product);
      return new ResponseEntity(savedProduct, HttpStatus.CREATED);
   }

   @GetMapping({"/public/products/{productId}"})
   public ResponseEntity<ProductDTO> getOneCategory(@PathVariable Long productId) {
      ProductDTO ProductDTO = this.productService.getProductById(productId);
      return new ResponseEntity(ProductDTO, HttpStatus.OK);
   }

   @GetMapping({"/public/products"})
   public ResponseEntity<ProductResponse> getAllProducts(@RequestParam(name = "pageNumber",defaultValue = "0",required = false) Integer pageNumber, @RequestParam(name = "pageSize",defaultValue = "40",required = false) Integer pageSize, @RequestParam(name = "sortBy",defaultValue = "productId",required = false) String sortBy, @RequestParam(name = "sortOrder",defaultValue = "asc",required = false) String sortOrder) {
      ProductResponse productResponse = this.productService.getAllProducts(pageNumber == 0 ? pageNumber : pageNumber - 1, pageSize, "id".equals(sortBy) ? "productId" : sortBy, sortOrder);
      return new ResponseEntity(productResponse, HttpStatus.OK);
   }

   @GetMapping({"/public/categories/{categoryId}/products"})
   public ResponseEntity<ProductResponse> getProductsByCategory(@PathVariable Long categoryId, @RequestParam(name = "pageNumber",defaultValue = "0",required = false) Integer pageNumber, @RequestParam(name = "pageSize",defaultValue = "50",required = false) Integer pageSize, @RequestParam(name = "sortBy",defaultValue = "productId",required = false) String sortBy, @RequestParam(name = "sortOrder",defaultValue = "asc",required = false) String sortOrder) {
      ProductResponse productResponse = this.productService.searchByCategory(categoryId, pageNumber == 0 ? pageNumber : pageNumber - 1, pageSize, "id".equals(sortBy) ? "productId" : sortBy, sortOrder);
      return new ResponseEntity(productResponse, HttpStatus.OK);
   }

   @GetMapping({"/public/products/keyword/{keyword}"})
   public ResponseEntity<ProductResponse> getProductsByKeyword(@PathVariable String keyword, @RequestParam(name = "pageNumber",defaultValue = "0",required = false) Integer pageNumber, @RequestParam(name = "pageSize",defaultValue = "50",required = false) Integer pageSize, @RequestParam(name = "sortBy",defaultValue = "productId",required = false) String sortBy, @RequestParam(name = "sortOrder",defaultValue = "asc",required = false) String sortOrder, @RequestParam(name = "categoryId",defaultValue = "0",required = false) Long categoryId) {
      ProductResponse productResponse = this.productService.searchProductByKeyword(keyword, categoryId, pageNumber == 0 ? pageNumber : pageNumber - 1, pageSize, "id".equals(sortBy) ? "productId" : sortBy, sortOrder);
      return new ResponseEntity(productResponse, HttpStatus.OK);
   }

   @GetMapping({"/public/products/image/{fileName}"})
   public ResponseEntity<InputStreamResource> getImage(@PathVariable String fileName) throws FileNotFoundException {
      InputStream imageStream = this.productService.getProductImage(fileName);
      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.IMAGE_PNG);
      headers.setContentDispositionFormData("inline", fileName);
      return new ResponseEntity(new InputStreamResource(imageStream), headers, HttpStatus.OK);
   }

   @PutMapping({"/admin/products/{productId}"})
   public ResponseEntity<ProductDTO> updateProduct(@RequestBody Product product, @PathVariable Long productId) {
      ProductDTO updatedProduct = this.productService.updateProduct(productId, product);
      return new ResponseEntity(updatedProduct, HttpStatus.OK);
   }

   @PutMapping({"/admin/products/{productId}/image"})
   public ResponseEntity<ProductDTO> updateProductImage(@PathVariable Long productId, @RequestParam("image") MultipartFile image) throws IOException {
      ProductDTO updatedProduct = this.productService.updateProductImage(productId, image);
      return new ResponseEntity(updatedProduct, HttpStatus.OK);
   }

   @DeleteMapping({"/admin/products/{productId}"})
   public ResponseEntity<String> deleteProductByCategory(@PathVariable Long productId) {
      String status = this.productService.deleteProduct(productId);
      return new ResponseEntity(status, HttpStatus.OK);
   }
}
