// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05.payloads;

import lombok.Generated;

public class APIResponse {
   private String message;
   private boolean status;

   @Generated
   public String getMessage() {
      return this.message;
   }

   @Generated
   public boolean isStatus() {
      return this.status;
   }

   @Generated
   public void setMessage(final String message) {
      this.message = message;
   }

   @Generated
   public void setStatus(final boolean status) {
      this.status = status;
   }

   @Generated
   public boolean equals(final Object o) {
      if (o == this) {
         return true;
      } else if (!(o instanceof APIResponse)) {
         return false;
      } else {
         APIResponse other = (APIResponse)o;
         if (!other.canEqual(this)) {
            return false;
         } else if (this.isStatus() != other.isStatus()) {
            return false;
         } else {
            Object this$message = this.getMessage();
            Object other$message = other.getMessage();
            if (this$message == null) {
               if (other$message != null) {
                  return false;
               }
            } else if (!this$message.equals(other$message)) {
               return false;
            }

            return true;
         }
      }
   }

   @Generated
   protected boolean canEqual(final Object other) {
      return other instanceof APIResponse;
   }

   @Generated
   public int hashCode() {
      boolean PRIME = true;
      int result = 1;
      result = result * 59 + (this.isStatus() ? 79 : 97);
      Object $message = this.getMessage();
      result = result * 59 + ($message == null ? 43 : $message.hashCode());
      return result;
   }

   @Generated
   public String toString() {
      String var10000 = this.getMessage();
      return "APIResponse(message=" + var10000 + ", status=" + this.isStatus() + ")";
   }

   @Generated
   public APIResponse() {
   }

   @Generated
   public APIResponse(final String message, final boolean status) {
      this.message = message;
      this.status = status;
   }
}
