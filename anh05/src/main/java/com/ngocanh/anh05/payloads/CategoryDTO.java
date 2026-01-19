// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05.payloads;

import lombok.Generated;

public class CategoryDTO {
   private Long categoryId;
   private String categoryName;

   @Generated
   public Long getCategoryId() {
      return this.categoryId;
   }

   @Generated
   public String getCategoryName() {
      return this.categoryName;
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
   public boolean equals(final Object o) {
      if (o == this) {
         return true;
      } else if (!(o instanceof CategoryDTO)) {
         return false;
      } else {
         CategoryDTO other = (CategoryDTO)o;
         if (!other.canEqual(this)) {
            return false;
         } else {
            Object this$categoryId = this.getCategoryId();
            Object other$categoryId = other.getCategoryId();
            if (this$categoryId == null) {
               if (other$categoryId != null) {
                  return false;
               }
            } else if (!this$categoryId.equals(other$categoryId)) {
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

            return true;
         }
      }
   }

   @Generated
   protected boolean canEqual(final Object other) {
      return other instanceof CategoryDTO;
   }

   @Generated
   public int hashCode() {
      boolean PRIME = true;
      int result = 1;
      Object $categoryId = this.getCategoryId();
      result = result * 59 + ($categoryId == null ? 43 : $categoryId.hashCode());
      Object $categoryName = this.getCategoryName();
      result = result * 59 + ($categoryName == null ? 43 : $categoryName.hashCode());
      return result;
   }

   @Generated
   public String toString() {
      Long var10000 = this.getCategoryId();
      return "CategoryDTO(categoryId=" + var10000 + ", categoryName=" + this.getCategoryName() + ")";
   }

   @Generated
   public CategoryDTO() {
   }

   @Generated
   public CategoryDTO(final Long categoryId, final String categoryName) {
      this.categoryId = categoryId;
      this.categoryName = categoryName;
   }
}
