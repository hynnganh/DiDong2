// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05.payloads;

import java.util.List;
import lombok.Generated;

public class ProductResponse {
   private List<ProductDTO> content;
   private Integer pageNumber;
   private Integer pageSize;
   private Long totalElements;
   private Integer totalPages;
   private boolean lastPage;

   @Generated
   public List<ProductDTO> getContent() {
      return this.content;
   }

   @Generated
   public Integer getPageNumber() {
      return this.pageNumber;
   }

   @Generated
   public Integer getPageSize() {
      return this.pageSize;
   }

   @Generated
   public Long getTotalElements() {
      return this.totalElements;
   }

   @Generated
   public Integer getTotalPages() {
      return this.totalPages;
   }

   @Generated
   public boolean isLastPage() {
      return this.lastPage;
   }

   @Generated
   public void setContent(final List<ProductDTO> content) {
      this.content = content;
   }

   @Generated
   public void setPageNumber(final Integer pageNumber) {
      this.pageNumber = pageNumber;
   }

   @Generated
   public void setPageSize(final Integer pageSize) {
      this.pageSize = pageSize;
   }

   @Generated
   public void setTotalElements(final Long totalElements) {
      this.totalElements = totalElements;
   }

   @Generated
   public void setTotalPages(final Integer totalPages) {
      this.totalPages = totalPages;
   }

   @Generated
   public void setLastPage(final boolean lastPage) {
      this.lastPage = lastPage;
   }

   @Generated
   public boolean equals(final Object o) {
      if (o == this) {
         return true;
      } else if (!(o instanceof ProductResponse)) {
         return false;
      } else {
         ProductResponse other = (ProductResponse)o;
         if (!other.canEqual(this)) {
            return false;
         } else if (this.isLastPage() != other.isLastPage()) {
            return false;
         } else {
            label73: {
               Object this$pageNumber = this.getPageNumber();
               Object other$pageNumber = other.getPageNumber();
               if (this$pageNumber == null) {
                  if (other$pageNumber == null) {
                     break label73;
                  }
               } else if (this$pageNumber.equals(other$pageNumber)) {
                  break label73;
               }

               return false;
            }

            Object this$pageSize = this.getPageSize();
            Object other$pageSize = other.getPageSize();
            if (this$pageSize == null) {
               if (other$pageSize != null) {
                  return false;
               }
            } else if (!this$pageSize.equals(other$pageSize)) {
               return false;
            }

            label59: {
               Object this$totalElements = this.getTotalElements();
               Object other$totalElements = other.getTotalElements();
               if (this$totalElements == null) {
                  if (other$totalElements == null) {
                     break label59;
                  }
               } else if (this$totalElements.equals(other$totalElements)) {
                  break label59;
               }

               return false;
            }

            Object this$totalPages = this.getTotalPages();
            Object other$totalPages = other.getTotalPages();
            if (this$totalPages == null) {
               if (other$totalPages != null) {
                  return false;
               }
            } else if (!this$totalPages.equals(other$totalPages)) {
               return false;
            }

            Object this$content = this.getContent();
            Object other$content = other.getContent();
            if (this$content == null) {
               if (other$content != null) {
                  return false;
               }
            } else if (!this$content.equals(other$content)) {
               return false;
            }

            return true;
         }
      }
   }

   @Generated
   protected boolean canEqual(final Object other) {
      return other instanceof ProductResponse;
   }

   @Generated
   public int hashCode() {
      boolean PRIME = true;
      int result = 1;
      result = result * 59 + (this.isLastPage() ? 79 : 97);
      Object $pageNumber = this.getPageNumber();
      result = result * 59 + ($pageNumber == null ? 43 : $pageNumber.hashCode());
      Object $pageSize = this.getPageSize();
      result = result * 59 + ($pageSize == null ? 43 : $pageSize.hashCode());
      Object $totalElements = this.getTotalElements();
      result = result * 59 + ($totalElements == null ? 43 : $totalElements.hashCode());
      Object $totalPages = this.getTotalPages();
      result = result * 59 + ($totalPages == null ? 43 : $totalPages.hashCode());
      Object $content = this.getContent();
      result = result * 59 + ($content == null ? 43 : $content.hashCode());
      return result;
   }

   @Generated
   public String toString() {
      String var10000 = String.valueOf(this.getContent());
      return "ProductResponse(content=" + var10000 + ", pageNumber=" + this.getPageNumber() + ", pageSize=" + this.getPageSize() + ", totalElements=" + this.getTotalElements() + ", totalPages=" + this.getTotalPages() + ", lastPage=" + this.isLastPage() + ")";
   }

   @Generated
   public ProductResponse() {
   }

   @Generated
   public ProductResponse(final List<ProductDTO> content, final Integer pageNumber, final Integer pageSize, final Long totalElements, final Integer totalPages, final boolean lastPage) {
      this.content = content;
      this.pageNumber = pageNumber;
      this.pageSize = pageSize;
      this.totalElements = totalElements;
      this.totalPages = totalPages;
      this.lastPage = lastPage;
   }
}
