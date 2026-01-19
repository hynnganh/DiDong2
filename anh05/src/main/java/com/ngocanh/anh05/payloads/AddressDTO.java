// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05.payloads;

import lombok.Generated;

public class AddressDTO {
   private Long addressId;
   private String street;
   private String buildingName;
   private String city;
   private String state;
   private String country;
   private String pincode;

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
   public boolean equals(final Object o) {
      if (o == this) {
         return true;
      } else if (!(o instanceof AddressDTO)) {
         return false;
      } else {
         AddressDTO other = (AddressDTO)o;
         if (!other.canEqual(this)) {
            return false;
         } else {
            label95: {
               Object this$addressId = this.getAddressId();
               Object other$addressId = other.getAddressId();
               if (this$addressId == null) {
                  if (other$addressId == null) {
                     break label95;
                  }
               } else if (this$addressId.equals(other$addressId)) {
                  break label95;
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

            label74: {
               Object this$city = this.getCity();
               Object other$city = other.getCity();
               if (this$city == null) {
                  if (other$city == null) {
                     break label74;
                  }
               } else if (this$city.equals(other$city)) {
                  break label74;
               }

               return false;
            }

            label67: {
               Object this$state = this.getState();
               Object other$state = other.getState();
               if (this$state == null) {
                  if (other$state == null) {
                     break label67;
                  }
               } else if (this$state.equals(other$state)) {
                  break label67;
               }

               return false;
            }

            Object this$country = this.getCountry();
            Object other$country = other.getCountry();
            if (this$country == null) {
               if (other$country != null) {
                  return false;
               }
            } else if (!this$country.equals(other$country)) {
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

            return true;
         }
      }
   }

   @Generated
   protected boolean canEqual(final Object other) {
      return other instanceof AddressDTO;
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
      return result;
   }

   @Generated
   public String toString() {
      Long var10000 = this.getAddressId();
      return "AddressDTO(addressId=" + var10000 + ", street=" + this.getStreet() + ", buildingName=" + this.getBuildingName() + ", city=" + this.getCity() + ", state=" + this.getState() + ", country=" + this.getCountry() + ", pincode=" + this.getPincode() + ")";
   }

   @Generated
   public AddressDTO() {
   }

   @Generated
   public AddressDTO(final Long addressId, final String street, final String buildingName, final String city, final String state, final String country, final String pincode) {
      this.addressId = addressId;
      this.street = street;
      this.buildingName = buildingName;
      this.city = city;
      this.state = state;
      this.country = country;
      this.pincode = pincode;
   }
}
