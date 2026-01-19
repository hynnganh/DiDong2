// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05;

import com.ngocanh.anh05.config.AppConstants;
import com.ngocanh.anh05.entity.Role;
import com.ngocanh.anh05.repository.RoleRepo;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import java.io.PrintStream;
import java.util.List;
import java.util.Objects;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@SecurityScheme(
   name = "E-Commerce Application",
   scheme = "bearer",
   type = SecuritySchemeType.HTTP,
   in = SecuritySchemeIn.HEADER
)
public class Anh05Application implements CommandLineRunner {
   @Autowired
   private RoleRepo roleRepo;

   public Anh05Application() {
   }

   public static void main(String[] args) {
      SpringApplication.run(Anh05Application.class, args);
   }

   @Bean
   public ModelMapper modelMapper() {
      return new ModelMapper();
   }

   public void run(String... args) throws Exception {
      try {
         Role adminRole = new Role();
         adminRole.setRoleId(AppConstants.ADMIN_ID);
         adminRole.setRoleName("ADMIN");
         Role userRole = new Role();
         userRole.setRoleId(AppConstants.USER_ID);
         userRole.setRoleName("USER");
         List<Role> roles = List.of(adminRole, userRole);
         List<Role> savedRoles = this.roleRepo.saveAll(roles);
         PrintStream var10001 = System.out;
         Objects.requireNonNull(var10001);
         savedRoles.forEach(var10001::println);
      } catch (Exception var6) {
         var6.printStackTrace();
      }

   }
}
