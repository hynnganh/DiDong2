// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05.payloads;

import com.ngocanh.anh05.entity.Role;
import java.util.HashSet;
import java.util.Set;
import lombok.Generated;

public class UserDTO {
   private Long userId;
   private String firstName;
   private String lastName;
   private String mobileNumber;
   private String email;
   private String password;
   private Set<Role> roles = new HashSet();
   private AddressDTO address;
   private CartDTO cart;

   @Generated
   public Long getUserId() {
      return this.userId;
   }

   @Generated
   public String getFirstName() {
      return this.firstName;
   }

   @Generated
   public String getLastName() {
      return this.lastName;
   }

   @Generated
   public String getMobileNumber() {
      return this.mobileNumber;
   }

   @Generated
   public String getEmail() {
      return this.email;
   }

   @Generated
   public String getPassword() {
      return this.password;
   }

   @Generated
   public Set<Role> getRoles() {
      return this.roles;
   }

   @Generated
   public AddressDTO getAddress() {
      return this.address;
   }

   @Generated
   public CartDTO getCart() {
      return this.cart;
   }

   @Generated
   public void setUserId(final Long userId) {
      this.userId = userId;
   }

   @Generated
   public void setFirstName(final String firstName) {
      this.firstName = firstName;
   }

   @Generated
   public void setLastName(final String lastName) {
      this.lastName = lastName;
   }

   @Generated
   public void setMobileNumber(final String mobileNumber) {
      this.mobileNumber = mobileNumber;
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
   public void setRoles(final Set<Role> roles) {
      this.roles = roles;
   }

   @Generated
   public void setAddress(final AddressDTO address) {
      this.address = address;
   }

   @Generated
   public void setCart(final CartDTO cart) {
      this.cart = cart;
   }

   @Generated
   public boolean equals(final Object o) {
      if (o == this) {
         return true;
      } else if (!(o instanceof UserDTO)) {
         return false;
      } else {
         UserDTO other = (UserDTO)o;
         if (!other.canEqual(this)) {
            return false;
         } else {
            label119: {
               Object this$userId = this.getUserId();
               Object other$userId = other.getUserId();
               if (this$userId == null) {
                  if (other$userId == null) {
                     break label119;
                  }
               } else if (this$userId.equals(other$userId)) {
                  break label119;
               }

               return false;
            }

            Object this$firstName = this.getFirstName();
            Object other$firstName = other.getFirstName();
            if (this$firstName == null) {
               if (other$firstName != null) {
                  return false;
               }
            } else if (!this$firstName.equals(other$firstName)) {
               return false;
            }

            label105: {
               Object this$lastName = this.getLastName();
               Object other$lastName = other.getLastName();
               if (this$lastName == null) {
                  if (other$lastName == null) {
                     break label105;
                  }
               } else if (this$lastName.equals(other$lastName)) {
                  break label105;
               }

               return false;
            }

            Object this$mobileNumber = this.getMobileNumber();
            Object other$mobileNumber = other.getMobileNumber();
            if (this$mobileNumber == null) {
               if (other$mobileNumber != null) {
                  return false;
               }
            } else if (!this$mobileNumber.equals(other$mobileNumber)) {
               return false;
            }

            label91: {
               Object this$email = this.getEmail();
               Object other$email = other.getEmail();
               if (this$email == null) {
                  if (other$email == null) {
                     break label91;
                  }
               } else if (this$email.equals(other$email)) {
                  break label91;
               }

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

            label77: {
               Object this$roles = this.getRoles();
               Object other$roles = other.getRoles();
               if (this$roles == null) {
                  if (other$roles == null) {
                     break label77;
                  }
               } else if (this$roles.equals(other$roles)) {
                  break label77;
               }

               return false;
            }

            label70: {
               Object this$address = this.getAddress();
               Object other$address = other.getAddress();
               if (this$address == null) {
                  if (other$address == null) {
                     break label70;
                  }
               } else if (this$address.equals(other$address)) {
                  break label70;
               }

               return false;
            }

            Object this$cart = this.getCart();
            Object other$cart = other.getCart();
            if (this$cart == null) {
               if (other$cart != null) {
                  return false;
               }
            } else if (!this$cart.equals(other$cart)) {
               return false;
            }

            return true;
         }
      }
   }

   @Generated
   protected boolean canEqual(final Object other) {
      return other instanceof UserDTO;
   }

   @Generated
   public int hashCode() {
      boolean PRIME = true;
      int result = 1;
      Object $userId = this.getUserId();
      result = result * 59 + ($userId == null ? 43 : $userId.hashCode());
      Object $firstName = this.getFirstName();
      result = result * 59 + ($firstName == null ? 43 : $firstName.hashCode());
      Object $lastName = this.getLastName();
      result = result * 59 + ($lastName == null ? 43 : $lastName.hashCode());
      Object $mobileNumber = this.getMobileNumber();
      result = result * 59 + ($mobileNumber == null ? 43 : $mobileNumber.hashCode());
      Object $email = this.getEmail();
      result = result * 59 + ($email == null ? 43 : $email.hashCode());
      Object $password = this.getPassword();
      result = result * 59 + ($password == null ? 43 : $password.hashCode());
      Object $roles = this.getRoles();
      result = result * 59 + ($roles == null ? 43 : $roles.hashCode());
      Object $address = this.getAddress();
      result = result * 59 + ($address == null ? 43 : $address.hashCode());
      Object $cart = this.getCart();
      result = result * 59 + ($cart == null ? 43 : $cart.hashCode());
      return result;
   }

   @Generated
   public String toString() {
      Long var10000 = this.getUserId();
      return "UserDTO(userId=" + var10000 + ", firstName=" + this.getFirstName() + ", lastName=" + this.getLastName() + ", mobileNumber=" + this.getMobileNumber() + ", email=" + this.getEmail() + ", password=" + this.getPassword() + ", roles=" + String.valueOf(this.getRoles()) + ", address=" + String.valueOf(this.getAddress()) + ", cart=" + String.valueOf(this.getCart()) + ")";
   }

   @Generated
   public UserDTO() {
   }

   @Generated
   public UserDTO(final Long userId, final String firstName, final String lastName, final String mobileNumber, final String email, final String password, final Set<Role> roles, final AddressDTO address, final CartDTO cart) {
      this.userId = userId;
      this.firstName = firstName;
      this.lastName = lastName;
      this.mobileNumber = mobileNumber;
      this.email = email;
      this.password = password;
      this.roles = roles;
      this.address = address;
      this.cart = cart;
   }
}
