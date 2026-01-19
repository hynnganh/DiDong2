// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import lombok.Generated;

@Entity
@Table(
   name = "products"
)
public class Product {
   @Id
   @GeneratedValue(
      strategy = GenerationType.AUTO
   )
   private Long productId;
   private @NotBlank @Size(
   min = 3,
   message = "Product name must contain atleast 3 characters"
) String productName;
   private String image;
   private @NotBlank @Size(
   min = 6,
   message = "Product description must contain atleast 6 characters"
) String description;
   private Integer quantity;
   private double price;
   private double discount;
   private double specialPrice;
   @ManyToOne
   @JoinColumn(
      name = "category_id"
   )
   private Category category;
   @OneToMany(
      mappedBy = "product",
      cascade = {CascadeType.PERSIST, CascadeType.MERGE},
      fetch = FetchType.EAGER
   )
   private List<CartItem> products = new ArrayList();
   @OneToMany(
      mappedBy = "product",
      cascade = {CascadeType.PERSIST, CascadeType.MERGE}
   )
   private List<OrderItem> orderItems = new ArrayList();

   @Generated
   public Long getProductId() {
      return this.productId;
   }

   @Generated
   public String getProductName() {
      return this.productName;
   }

   @Generated
   public String getImage() {
      return this.image;
   }

   @Generated
   public String getDescription() {
      return this.description;
   }

   @Generated
   public Integer getQuantity() {
      return this.quantity;
   }

   @Generated
   public double getPrice() {
      return this.price;
   }

   @Generated
   public double getDiscount() {
      return this.discount;
   }

   @Generated
   public double getSpecialPrice() {
      return this.specialPrice;
   }

   @Generated
   public Category getCategory() {
      return this.category;
   }

   @Generated
   public List<CartItem> getProducts() {
      return this.products;
   }

   @Generated
   public List<OrderItem> getOrderItems() {
      return this.orderItems;
   }

   @Generated
   public void setProductId(final Long productId) {
      this.productId = productId;
   }

   @Generated
   public void setProductName(final String productName) {
      this.productName = productName;
   }

   @Generated
   public void setImage(final String image) {
      this.image = image;
   }

   @Generated
   public void setDescription(final String description) {
      this.description = description;
   }

   @Generated
   public void setQuantity(final Integer quantity) {
      this.quantity = quantity;
   }

   @Generated
   public void setPrice(final double price) {
      this.price = price;
   }

   @Generated
   public void setDiscount(final double discount) {
      this.discount = discount;
   }

   @Generated
   public void setSpecialPrice(final double specialPrice) {
      this.specialPrice = specialPrice;
   }

   @Generated
   public void setCategory(final Category category) {
      this.category = category;
   }

   @Generated
   public void setProducts(final List<CartItem> products) {
      this.products = products;
   }

   @Generated
   public void setOrderItems(final List<OrderItem> orderItems) {
      this.orderItems = orderItems;
   }

   @Generated
   public boolean equals(final Object o) {
      if (o == this) {
         return true;
      } else if (!(o instanceof Product)) {
         return false;
      } else {
         Product other = (Product)o;
         if (!other.canEqual(this)) {
            return false;
         } else if (Double.compare(this.getPrice(), other.getPrice()) != 0) {
            return false;
         } else if (Double.compare(this.getDiscount(), other.getDiscount()) != 0) {
            return false;
         } else if (Double.compare(this.getSpecialPrice(), other.getSpecialPrice()) != 0) {
            return false;
         } else {
            Object this$productId = this.getProductId();
            Object other$productId = other.getProductId();
            if (this$productId == null) {
               if (other$productId != null) {
                  return false;
               }
            } else if (!this$productId.equals(other$productId)) {
               return false;
            }

            label107: {
               Object this$quantity = this.getQuantity();
               Object other$quantity = other.getQuantity();
               if (this$quantity == null) {
                  if (other$quantity == null) {
                     break label107;
                  }
               } else if (this$quantity.equals(other$quantity)) {
                  break label107;
               }

               return false;
            }

            Object this$productName = this.getProductName();
            Object other$productName = other.getProductName();
            if (this$productName == null) {
               if (other$productName != null) {
                  return false;
               }
            } else if (!this$productName.equals(other$productName)) {
               return false;
            }

            Object this$image = this.getImage();
            Object other$image = other.getImage();
            if (this$image == null) {
               if (other$image != null) {
                  return false;
               }
            } else if (!this$image.equals(other$image)) {
               return false;
            }

            label86: {
               Object this$description = this.getDescription();
               Object other$description = other.getDescription();
               if (this$description == null) {
                  if (other$description == null) {
                     break label86;
                  }
               } else if (this$description.equals(other$description)) {
                  break label86;
               }

               return false;
            }

            label79: {
               Object this$category = this.getCategory();
               Object other$category = other.getCategory();
               if (this$category == null) {
                  if (other$category == null) {
                     break label79;
                  }
               } else if (this$category.equals(other$category)) {
                  break label79;
               }

               return false;
            }

            label72: {
               Object this$products = this.getProducts();
               Object other$products = other.getProducts();
               if (this$products == null) {
                  if (other$products == null) {
                     break label72;
                  }
               } else if (this$products.equals(other$products)) {
                  break label72;
               }

               return false;
            }

            Object this$orderItems = this.getOrderItems();
            Object other$orderItems = other.getOrderItems();
            if (this$orderItems == null) {
               if (other$orderItems != null) {
                  return false;
               }
            } else if (!this$orderItems.equals(other$orderItems)) {
               return false;
            }

            return true;
         }
      }
   }

   @Generated
   protected boolean canEqual(final Object other) {
      return other instanceof Product;
   }

   @Generated
   public int hashCode() {
      boolean PRIME = true;
      int result = 1;
      long $price = Double.doubleToLongBits(this.getPrice());
      result = result * 59 + (int)($price >>> 32 ^ $price);
      long $discount = Double.doubleToLongBits(this.getDiscount());
      result = result * 59 + (int)($discount >>> 32 ^ $discount);
      long $specialPrice = Double.doubleToLongBits(this.getSpecialPrice());
      result = result * 59 + (int)($specialPrice >>> 32 ^ $specialPrice);
      Object $productId = this.getProductId();
      result = result * 59 + ($productId == null ? 43 : $productId.hashCode());
      Object $quantity = this.getQuantity();
      result = result * 59 + ($quantity == null ? 43 : $quantity.hashCode());
      Object $productName = this.getProductName();
      result = result * 59 + ($productName == null ? 43 : $productName.hashCode());
      Object $image = this.getImage();
      result = result * 59 + ($image == null ? 43 : $image.hashCode());
      Object $description = this.getDescription();
      result = result * 59 + ($description == null ? 43 : $description.hashCode());
      Object $category = this.getCategory();
      result = result * 59 + ($category == null ? 43 : $category.hashCode());
      Object $products = this.getProducts();
      result = result * 59 + ($products == null ? 43 : $products.hashCode());
      Object $orderItems = this.getOrderItems();
      result = result * 59 + ($orderItems == null ? 43 : $orderItems.hashCode());
      return result;
   }

   @Generated
   public String toString() {
      Long var10000 = this.getProductId();
      return "Product(productId=" + var10000 + ", productName=" + this.getProductName() + ", image=" + this.getImage() + ", description=" + this.getDescription() + ", quantity=" + this.getQuantity() + ", price=" + this.getPrice() + ", discount=" + this.getDiscount() + ", specialPrice=" + this.getSpecialPrice() + ", category=" + String.valueOf(this.getCategory()) + ", products=" + String.valueOf(this.getProducts()) + ", orderItems=" + String.valueOf(this.getOrderItems()) + ")";
   }

   @Generated
   public Product() {
   }

   @Generated
   public Product(final Long productId, final String productName, final String image, final String description, final Integer quantity, final double price, final double discount, final double specialPrice, final Category category, final List<CartItem> products, final List<OrderItem> orderItems) {
      this.productId = productId;
      this.productName = productName;
      this.image = image;
      this.description = description;
      this.quantity = quantity;
      this.price = price;
      this.discount = discount;
      this.specialPrice = specialPrice;
      this.category = category;
      this.products = products;
      this.orderItems = orderItems;
   }
}
