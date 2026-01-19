// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05.payloads;

import lombok.Generated;

public class ProductDTO {
   private Long productId;
   private String productName;
   private String image;
   private String description;
   private Integer quantity;
   private double price;
   private double discount;
   private double specialPrice;
   private CategoryDTO category;

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
   public CategoryDTO getCategory() {
      return this.category;
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
   public void setCategory(final CategoryDTO category) {
      this.category = category;
   }

   @Generated
   public boolean equals(final Object o) {
      if (o == this) {
         return true;
      } else if (!(o instanceof ProductDTO)) {
         return false;
      } else {
         ProductDTO other = (ProductDTO)o;
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

            Object this$quantity = this.getQuantity();
            Object other$quantity = other.getQuantity();
            if (this$quantity == null) {
               if (other$quantity != null) {
                  return false;
               }
            } else if (!this$quantity.equals(other$quantity)) {
               return false;
            }

            label76: {
               Object this$productName = this.getProductName();
               Object other$productName = other.getProductName();
               if (this$productName == null) {
                  if (other$productName == null) {
                     break label76;
                  }
               } else if (this$productName.equals(other$productName)) {
                  break label76;
               }

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

            Object this$description = this.getDescription();
            Object other$description = other.getDescription();
            if (this$description == null) {
               if (other$description != null) {
                  return false;
               }
            } else if (!this$description.equals(other$description)) {
               return false;
            }

            Object this$category = this.getCategory();
            Object other$category = other.getCategory();
            if (this$category == null) {
               if (other$category != null) {
                  return false;
               }
            } else if (!this$category.equals(other$category)) {
               return false;
            }

            return true;
         }
      }
   }

   @Generated
   protected boolean canEqual(final Object other) {
      return other instanceof ProductDTO;
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
      return result;
   }

   @Generated
   public String toString() {
      Long var10000 = this.getProductId();
      return "ProductDTO(productId=" + var10000 + ", productName=" + this.getProductName() + ", image=" + this.getImage() + ", description=" + this.getDescription() + ", quantity=" + this.getQuantity() + ", price=" + this.getPrice() + ", discount=" + this.getDiscount() + ", specialPrice=" + this.getSpecialPrice() + ", category=" + String.valueOf(this.getCategory()) + ")";
   }

   @Generated
   public ProductDTO() {
   }

   @Generated
   public ProductDTO(final Long productId, final String productName, final String image, final String description, final Integer quantity, final double price, final double discount, final double specialPrice, final CategoryDTO category) {
      this.productId = productId;
      this.productName = productName;
      this.image = image;
      this.description = description;
      this.quantity = quantity;
      this.price = price;
      this.discount = discount;
      this.specialPrice = specialPrice;
      this.category = category;
   }
}
