// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import lombok.Generated;

@Entity
@Table(
   name = "addresses"
)
public class Address {
   @Id
   @GeneratedValue(
      strategy = GenerationType.IDENTITY
   )
   private Long addressId;
   private @NotBlank @Size(
   min = 5,
   message = "Street name must contain atleast 5 characters"
) String street;
   private @NotBlank @Size(
   min = 5,
   message = "Building name must contain atleast 5 characters"
) String buildingName;
   private @NotBlank @Size(
   min = 4,
   message = "City name must contain atleast 4 characters"
) String city;
   private @NotBlank @Size(
   min = 2,
   message = "State name must contain atleast 2 characters"
) String state;
   private @NotBlank @Size(
   min = 2,
   message = "Country name must contain atleast 2 characters"
) String country;
   private @NotBlank @Size(
   min = 6,
   message = "Pincode must contain atleast 6 characters"
) String pincode;
   @ManyToMany(
      mappedBy = "addresses"
   )
   private List<User> users = new ArrayList();

   public Address(String country, String state, String city, String pincode, String street, String buildingName) {
      this.country = country;
      this.state = state;
      this.city = city;
      this.pincode = pincode;
      this.street = street;
      this.buildingName = buildingName;
   }

   @Generated
   public Long getAddressId() {
      return this.addressId;
   }

   @Generated
   public String getStreet() {
      return this.street;
   }

   @Generated
   public String getBuildingName() {
      return this.buildingName;
   }

   @Generated
   public String getCity() {
      return this.city;
   }

   @Generated
   public String getState() {
      return this.state;
   }

   @Generated
   public String getCountry() {
      return this.country;
   }

   @Generated
   public String getPincode() {
      return this.pincode;
   }

   @Generated
   public List<User> getUsers() {
      return this.users;
   }

   @Generated
   public void setAddressId(final Long addressId) {
      this.addressId = addressId;
   }

   @Generated
   public void setStreet(final String street) {
      this.street = street;
   }

   @Generated
   public void setBuildingName(final String buildingName) {
      this.buildingName = buildingName;
   }

   @Generated
   public void setCity(final String city) {
      this.city = city;
   }

   @Generated
   public void setState(final String state) {
      this.state = state;
   }

   @Generated
   public void setCountry(final String country) {
      this.country = country;
   }

   @Generated
   public void setPincode(final String pincode) {
      this.pincode = pincode;
   }

   @Generated
   public void setUsers(final List<User> users) {
      this.users = users;
   }

   @Generated
   public boolean equals(final Object o) {
      if (o == this) {
         return true;
      } else if (!(o instanceof Address)) {
         return false;
      } else {
         Address other = (Address)o;
         if (!other.canEqual(this)) {
            return false;
         } else {
            label107: {
               Object this$addressId = this.getAddressId();
               Object other$addressId = other.getAddressId();
               if (this$addressId == null) {
                  if (other$addressId == null) {
                     break label107;
                  }
               } else if (this$addressId.equals(other$addressId)) {
                  break label107;
               }

               return false;
            }

            Object this$street = this.getStreet();
            Object other$street = other.getStreet();
            if (this$street == null) {
               if (other$street != null) {
                  return false;
               }
            } else if (!this$street.equals(other$street)) {
               return false;
            }

            Object this$buildingName = this.getBuildingName();
            Object other$buildingName = other.getBuildingName();
            if (this$buildingName == null) {
               if (other$buildingName != null) {
                  return false;
               }
            } else if (!this$buildingName.equals(other$buildingName)) {
               return false;
            }

            label86: {
               Object this$city = this.getCity();
               Object other$city = other.getCity();
               if (this$city == null) {
                  if (other$city == null) {
                     break label86;
                  }
               } else if (this$city.equals(other$city)) {
                  break label86;
               }

               return false;
            }

            label79: {
               Object this$state = this.getState();
               Object other$state = other.getState();
               if (this$state == null) {
                  if (other$state == null) {
                     break label79;
                  }
               } else if (this$state.equals(other$state)) {
                  break label79;
               }

               return false;
            }

            label72: {
               Object this$country = this.getCountry();
               Object other$country = other.getCountry();
               if (this$country == null) {
                  if (other$country == null) {
                     break label72;
                  }
               } else if (this$country.equals(other$country)) {
                  break label72;
               }

               return false;
            }

            Object this$pincode = this.getPincode();
            Object other$pincode = other.getPincode();
            if (this$pincode == null) {
               if (other$pincode != null) {
                  return false;
               }
            } else if (!this$pincode.equals(other$pincode)) {
               return false;
            }

            Object this$users = this.getUsers();
            Object other$users = other.getUsers();
            if (this$users == null) {
               if (other$users != null) {
                  return false;
               }
            } else if (!this$users.equals(other$users)) {
               return false;
            }

            return true;
         }
      }
   }

   @Generated
   protected boolean canEqual(final Object other) {
      return other instanceof Address;
   }

   @Generated
   public int hashCode() {
      boolean PRIME = true;
      int result = 1;
      Object $addressId = this.getAddressId();
      result = result * 59 + ($addressId == null ? 43 : $addressId.hashCode());
      Object $street = this.getStreet();
      result = result * 59 + ($street == null ? 43 : $street.hashCode());
      Object $buildingName = this.getBuildingName();
      result = result * 59 + ($buildingName == null ? 43 : $buildingName.hashCode());
      Object $city = this.getCity();
      result = result * 59 + ($city == null ? 43 : $city.hashCode());
      Object $state = this.getState();
      result = result * 59 + ($state == null ? 43 : $state.hashCode());
      Object $country = this.getCountry();
      result = result * 59 + ($country == null ? 43 : $country.hashCode());
      Object $pincode = this.getPincode();
      result = result * 59 + ($pincode == null ? 43 : $pincode.hashCode());
      Object $users = this.getUsers();
      result = result * 59 + ($users == null ? 43 : $users.hashCode());
      return result;
   }

   @Generated
   public String toString() {
      Long var10000 = this.getAddressId();
      return "Address(addressId=" + var10000 + ", street=" + this.getStreet() + ", buildingName=" + this.getBuildingName() + ", city=" + this.getCity() + ", state=" + this.getState() + ", country=" + this.getCountry() + ", pincode=" + this.getPincode() + ", users=" + String.valueOf(this.getUsers()) + ")";
   }

   @Generated
   public Address() {
   }

   @Generated
   public Address(final Long addressId, final String street, final String buildingName, final String city, final String state, final String country, final String pincode, final List<User> users) {
      this.addressId = addressId;
      this.street = street;
      this.buildingName = buildingName;
      this.city = city;
      this.state = state;
      this.country = country;
      this.pincode = pincode;
      this.users = users;
   }
}
