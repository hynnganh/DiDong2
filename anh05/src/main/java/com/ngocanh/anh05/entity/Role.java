// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Generated;

@Entity
@Table(
   name = "roles"
)
public class Role {
   @Id
   private Long roleId;
   private String roleName;

   @Generated
   public Long getRoleId() {
      return this.roleId;
   }

   @Generated
   public String getRoleName() {
      return this.roleName;
   }

   @Generated
   public void setRoleId(final Long roleId) {
      this.roleId = roleId;
   }

   @Generated
   public void setRoleName(final String roleName) {
      this.roleName = roleName;
   }

   @Generated
   public boolean equals(final Object o) {
      if (o == this) {
         return true;
      } else if (!(o instanceof Role)) {
         return false;
      } else {
         Role other = (Role)o;
         if (!other.canEqual(this)) {
            return false;
         } else {
            Object this$roleId = this.getRoleId();
            Object other$roleId = other.getRoleId();
            if (this$roleId == null) {
               if (other$roleId != null) {
                  return false;
               }
            } else if (!this$roleId.equals(other$roleId)) {
               return false;
            }

            Object this$roleName = this.getRoleName();
            Object other$roleName = other.getRoleName();
            if (this$roleName == null) {
               if (other$roleName != null) {
                  return false;
               }
            } else if (!this$roleName.equals(other$roleName)) {
               return false;
            }

            return true;
         }
      }
   }

   @Generated
   protected boolean canEqual(final Object other) {
      return other instanceof Role;
   }

   @Generated
   public int hashCode() {
      boolean PRIME = true;
      int result = 1;
      Object $roleId = this.getRoleId();
      result = result * 59 + ($roleId == null ? 43 : $roleId.hashCode());
      Object $roleName = this.getRoleName();
      result = result * 59 + ($roleName == null ? 43 : $roleName.hashCode());
      return result;
   }

   @Generated
   public String toString() {
      Long var10000 = this.getRoleId();
      return "Role(roleId=" + var10000 + ", roleName=" + this.getRoleName() + ")";
   }

   @Generated
   public Role() {
   }

   @Generated
   public Role(final Long roleId, final String roleName) {
      this.roleId = roleId;
      this.roleName = roleName;
   }
}
