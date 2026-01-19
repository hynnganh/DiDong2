// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05.payloads;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import lombok.Generated;

public class LoginCredentials {
   @Column(
      unique = true,
      nullable = false
   )
   private @Email String email;
   private String password;

   @Generated
   public String getEmail() {
      return this.email;
   }

   @Generated
   public String getPassword() {
      return this.password;
   }

   @Generated
   public void setEmail(final String email) {
      this.email = email;
   }

   @Generated
   public void setPassword(final String password) {
      this.password = password;
   }

   @Generated
   public boolean equals(final Object o) {
      if (o == this) {
         return true;
      } else if (!(o instanceof LoginCredentials)) {
         return false;
      } else {
         LoginCredentials other = (LoginCredentials)o;
         if (!other.canEqual(this)) {
            return false;
         } else {
            Object this$email = this.getEmail();
            Object other$email = other.getEmail();
            if (this$email == null) {
               if (other$email != null) {
                  return false;
               }
            } else if (!this$email.equals(other$email)) {
               return false;
            }

            Object this$password = this.getPassword();
            Object other$password = other.getPassword();
            if (this$password == null) {
               if (other$password != null) {
                  return false;
               }
            } else if (!this$password.equals(other$password)) {
               return false;
            }

            return true;
         }
      }
   }

   @Generated
   protected boolean canEqual(final Object other) {
      return other instanceof LoginCredentials;
   }

   @Generated
   public int hashCode() {
      boolean PRIME = true;
      int result = 1;
      Object $email = this.getEmail();
      result = result * 59 + ($email == null ? 43 : $email.hashCode());
      Object $password = this.getPassword();
      result = result * 59 + ($password == null ? 43 : $password.hashCode());
      return result;
   }

   @Generated
   public String toString() {
      String var10000 = this.getEmail();
      return "LoginCredentials(email=" + var10000 + ", password=" + this.getPassword() + ")";
   }

   @Generated
   public LoginCredentials() {
   }

   @Generated
   public LoginCredentials(final String email, final String password) {
      this.email = email;
      this.password = password;
   }
}
