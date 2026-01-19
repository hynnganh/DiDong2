// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Generated;

@Entity
@Table(
   name = "categories"
)
public class Category {
   @Id
   @GeneratedValue(
      strategy = GenerationType.IDENTITY
   )
   private Long categoryId;
   private @NotBlank @Size(
   min = 5,
   message = "Category name must contain atleast 5 characters"
) String categoryName;
   @OneToMany(
      mappedBy = "category",
      cascade = {CascadeType.ALL}
   )
   private List<Product> products;

   @Generated
   public Long getCategoryId() {
      return this.categoryId;
   }

   @Generated
   public String getCategoryName() {
      return this.categoryName;
   }

   @Generated
   public List<Product> getProducts() {
      return this.products;
   }

   @Generated
   public void setCategoryId(final Long categoryId) {
      this.categoryId = categoryId;
   }

   @Generated
   public void setCategoryName(final String categoryName) {
      this.categoryName = categoryName;
   }

   @Generated
   public void setProducts(final List<Product> products) {
      this.products = products;
   }

   @Generated
   public boolean equals(final Object o) {
      if (o == this) {
         return true;
      } else if (!(o instanceof Category)) {
         return false;
      } else {
         Category other = (Category)o;
         if (!other.canEqual(this)) {
            return false;
         } else {
            label47: {
               Object this$categoryId = this.getCategoryId();
               Object other$categoryId = other.getCategoryId();
               if (this$categoryId == null) {
                  if (other$categoryId == null) {
                     break label47;
                  }
               } else if (this$categoryId.equals(other$categoryId)) {
                  break label47;
               }

               return false;
            }

            Object this$categoryName = this.getCategoryName();
            Object other$categoryName = other.getCategoryName();
            if (this$categoryName == null) {
               if (other$categoryName != null) {
                  return false;
               }
            } else if (!this$categoryName.equals(other$categoryName)) {
               return false;
            }

            Object this$products = this.getProducts();
            Object other$products = other.getProducts();
            if (this$products == null) {
               if (other$products != null) {
                  return false;
               }
            } else if (!this$products.equals(other$products)) {
               return false;
            }

            return true;
         }
      }
   }

   @Generated
   protected boolean canEqual(final Object other) {
      return other instanceof Category;
   }

   @Generated
   public int hashCode() {
      boolean PRIME = true;
      int result = 1;
      Object $categoryId = this.getCategoryId();
      result = result * 59 + ($categoryId == null ? 43 : $categoryId.hashCode());
      Object $categoryName = this.getCategoryName();
      result = result * 59 + ($categoryName == null ? 43 : $categoryName.hashCode());
      Object $products = this.getProducts();
      result = result * 59 + ($products == null ? 43 : $products.hashCode());
      return result;
   }

   @Generated
   public String toString() {
      Long var10000 = this.getCategoryId();
      return "Category(categoryId=" + var10000 + ", categoryName=" + this.getCategoryName() + ", products=" + String.valueOf(this.getProducts()) + ")";
   }

   @Generated
   public Category() {
   }

   @Generated
   public Category(final Long categoryId, final String categoryName, final List<Product> products) {
      this.categoryId = categoryId;
      this.categoryName = categoryName;
      this.products = products;
   }
}
