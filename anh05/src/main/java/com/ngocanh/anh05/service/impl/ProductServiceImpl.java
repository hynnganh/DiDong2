// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05.service.impl;

import com.ngocanh.anh05.entity.Cart;
import com.ngocanh.anh05.entity.Category;
import com.ngocanh.anh05.entity.Product;
import com.ngocanh.anh05.exceptions.APIException;
import com.ngocanh.anh05.exceptions.ResourceNotFoundException;
import com.ngocanh.anh05.payloads.CartDTO;
import com.ngocanh.anh05.payloads.ProductDTO;
import com.ngocanh.anh05.payloads.ProductResponse;
import com.ngocanh.anh05.repository.CartRepo;
import com.ngocanh.anh05.repository.CategoryRepo;
import com.ngocanh.anh05.repository.ProductRepo;
import com.ngocanh.anh05.service.CartService;
import com.ngocanh.anh05.service.FileService;
import com.ngocanh.anh05.service.ProductService;
import jakarta.transaction.Transactional;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Transactional
@Service
public class ProductServiceImpl implements ProductService {
   @Autowired
   private ProductRepo productRepo;
   @Autowired
   private CategoryRepo categoryRepo;
   @Autowired
   private CartRepo cartRepo;
   @Autowired
   private CartService cartService;
   @Autowired
   private FileService fileService;
   @Autowired
   private ModelMapper modelMapper;
   @Value("${project.image}")
   private String path;

   public ProductServiceImpl() {
   }

   public ProductDTO addProduct(Long categoryId, Product product) {
      Category category = (Category)this.categoryRepo.findById(categoryId).orElseThrow(() -> {
         return new ResourceNotFoundException("Category", "categoryId", categoryId);
      });
      boolean isProductNotPresent = true;
      List<Product> products = category.getProducts();

      for(int i = 0; i < products.size(); ++i) {
         if (((Product)products.get(i)).getProductName().equals(product.getProductName()) && ((Product)products.get(i)).getDescription().equals(product.getDescription())) {
            isProductNotPresent = false;
            break;
         }
      }

      if (isProductNotPresent) {
         product.setImage("default.png");
         product.setCategory(category);
         double specialPrice = product.getPrice() - product.getDiscount() * 0.01 * product.getPrice();
         product.setSpecialPrice(specialPrice);
         Product savedProduct = (Product)this.productRepo.save(product);
         return (ProductDTO)this.modelMapper.map(savedProduct, ProductDTO.class);
      } else {
         throw new APIException("Product already exists !!!");
      }
   }

   public ProductResponse getAllProducts(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
      Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(new String[]{sortBy}).ascending() : Sort.by(new String[]{sortBy}).descending();
      Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
      Page<Product> pageProducts = this.productRepo.findAll(pageDetails);
      List<Product> products = pageProducts.getContent();
      List<ProductDTO> productDTOs = (List)products.stream().map((product) -> {
         return (ProductDTO)this.modelMapper.map(product, ProductDTO.class);
      }).collect(Collectors.toList());
      ProductResponse productResponse = new ProductResponse();
      productResponse.setContent(productDTOs);
      productResponse.setPageNumber(pageProducts.getNumber());
      productResponse.setPageSize(pageProducts.getSize());
      productResponse.setTotalElements(pageProducts.getTotalElements());
      productResponse.setTotalPages(pageProducts.getTotalPages());
      productResponse.setLastPage(pageProducts.isLast());
      return productResponse;
   }

   public ProductDTO getProductById(Long productId) {
      Optional<Product> productOptional = this.productRepo.findById(productId);
      if (productOptional.isPresent()) {
         Product product = (Product)productOptional.get();
         return (ProductDTO)this.modelMapper.map(product, ProductDTO.class);
      } else {
         throw new ResourceNotFoundException("Product", "productId", productId);
      }
   }

   public ProductResponse searchByCategory(Long categoryId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
      Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(new String[]{sortBy}).ascending() : Sort.by(new String[]{sortBy}).descending();
      Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
      Page<Product> pageProducts = this.productRepo.findByCategoryCategoryId(categoryId, pageDetails);
      List<Product> products = pageProducts.getContent();
      List<ProductDTO> productDTOs = (List)products.stream().map((p) -> {
         return (ProductDTO)this.modelMapper.map(p, ProductDTO.class);
      }).collect(Collectors.toList());
      ProductResponse productResponse = new ProductResponse();
      productResponse.setContent(productDTOs);
      productResponse.setPageNumber(pageProducts.getNumber());
      productResponse.setPageSize(pageProducts.getSize());
      productResponse.setTotalElements(pageProducts.getTotalElements());
      productResponse.setTotalPages(pageProducts.getTotalPages());
      productResponse.setLastPage(pageProducts.isLast());
      return productResponse;
   }
public ProductResponse searchProductByKeyword(
        String keyword, Long categoryId,
        Integer pageNumber, Integer pageSize,
        String sortBy, String sortOrder) {

    Sort sort = sortOrder.equalsIgnoreCase("asc")
            ? Sort.by(sortBy).ascending()
            : Sort.by(sortBy).descending();

    Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

    Page<Product> pageProducts;

    if (categoryId != null && categoryId != 0) {
        pageProducts = productRepo
                .findByProductNameContainingIgnoreCaseAndCategory_CategoryId(
                        keyword, categoryId, pageable);
    } else {
        pageProducts = productRepo
                .findByProductNameContainingIgnoreCase(keyword, pageable);
    }

    List<ProductDTO> productDTOs = pageProducts.getContent()
            .stream()
            .map(p -> modelMapper.map(p, ProductDTO.class))
            .toList();

    ProductResponse response = new ProductResponse();
    response.setContent(productDTOs);
    response.setPageNumber(pageProducts.getNumber());
    response.setPageSize(pageProducts.getSize());
    response.setTotalElements(pageProducts.getTotalElements());
    response.setTotalPages(pageProducts.getTotalPages());
    response.setLastPage(pageProducts.isLast());

    return response;
}

   public ProductDTO updateProduct(Long productId, Product product) {
      Product productFromDB = (Product)this.productRepo.findById(productId).orElseThrow(() -> {
         return new ResourceNotFoundException("Product", "productId", productId);
      });
      if (productFromDB == null) {
         throw new APIException("Product not found with productId: " + productId);
      } else {
         product.setImage(productFromDB.getImage());
         product.setProductId(productId);
         product.setCategory(productFromDB.getCategory());
         double specialPrice = product.getPrice() - product.getDiscount() * 0.01 * product.getPrice();
         product.setSpecialPrice(specialPrice);
         Product savedProduct = (Product)this.productRepo.save(product);
         List<Cart> carts = this.cartRepo.findCartsByProductId(productId);
         List<CartDTO> cartDTOs = (List)carts.stream().map((cart) -> {
            CartDTO cartDTO = (CartDTO)this.modelMapper.map(cart, CartDTO.class);
            List<ProductDTO> products = (List)cart.getCartItems().stream().map((p) -> {
               return (ProductDTO)this.modelMapper.map(p.getProduct(), ProductDTO.class);
            }).collect(Collectors.toList());
            cartDTO.setProducts(products);
            return cartDTO;
         }).collect(Collectors.toList());
         cartDTOs.forEach((cart) -> {
            this.cartService.updateProductInCarts(cart.getCartId(), productId);
         });
         return (ProductDTO)this.modelMapper.map(savedProduct, ProductDTO.class);
      }
   }

   public ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException {
      Product productFromDB = (Product)this.productRepo.findById(productId).orElseThrow(() -> {
         return new ResourceNotFoundException("Product", "productId", productId);
      });
      if (productFromDB == null) {
         throw new APIException("Product not found with productId: " + productId);
      } else {
         String fileName = this.fileService.uploadImage(this.path, image);
         productFromDB.setImage(fileName);
         Product updatedProduct = (Product)this.productRepo.save(productFromDB);
         return (ProductDTO)this.modelMapper.map(updatedProduct, ProductDTO.class);
      }
   }

   public String deleteProduct(Long productId) {
      Product product = (Product)this.productRepo.findById(productId).orElseThrow(() -> {
         return new ResourceNotFoundException("Product", "productId", productId);
      });
      List<Cart> carts = this.cartRepo.findCartsByProductId(productId);
      carts.forEach((cart) -> {
         this.cartService.deleteProductFromCart(cart.getCartId(), productId);
      });
      this.productRepo.delete(product);
      return "Product with productId: " + productId + " deleted successfully !!!";
   }

   public InputStream getProductImage(String fileName) throws FileNotFoundException {
      return this.fileService.getResource(this.path, fileName);
   }
}
