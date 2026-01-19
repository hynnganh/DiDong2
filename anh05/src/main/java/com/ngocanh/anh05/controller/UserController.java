// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05.controller;

import com.ngocanh.anh05.payloads.UserDTO;
import com.ngocanh.anh05.payloads.UserResponse;
import com.ngocanh.anh05.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api"})
@SecurityRequirement(
   name = "E-Commerce Application"
)
@CrossOrigin(
   origins = {"*"}
)
public class UserController {
   @Autowired
   private UserService userService;

   public UserController() {
   }

   @GetMapping({"/admin/users"})
   public ResponseEntity<UserResponse> getUsers(@RequestParam(name = "pageNumber",defaultValue = "0",required = false) Integer pageNumber, @RequestParam(name = "pageSize",defaultValue = "5",required = false) Integer pageSize, @RequestParam(name = "sortBy",defaultValue = "userId",required = false) String sortBy, @RequestParam(name = "sortOrder",defaultValue = "asc",required = false) String sortOrder) {
      UserResponse userResponse = this.userService.getAllUsers(pageNumber, pageSize, sortBy, sortOrder);
      return new ResponseEntity(userResponse, HttpStatus.OK);
   }

   @GetMapping({"/public/users/{userId}"})
   public ResponseEntity<UserDTO> getUser(@PathVariable Long userId) {
      UserDTO user = this.userService.getUserById(userId);
      return new ResponseEntity(user, HttpStatus.OK);
   }

   @GetMapping({"/public/users/email/{email}"})
   public ResponseEntity<UserDTO> getUserEmail(@PathVariable String email) {
      UserDTO user = this.userService.getUserByEmail(email);
      return new ResponseEntity(user, HttpStatus.OK);
   }

   @PutMapping({"/public/users/{userId}"})
   public ResponseEntity<UserDTO> updateUser(@RequestBody UserDTO userDTO, @PathVariable Long userId) {
      UserDTO updatedUser = this.userService.updateUser(userId, userDTO);
      return new ResponseEntity(updatedUser, HttpStatus.OK);
   }

   @PutMapping({"/public/users/role/{userId}/{roleId}"})
   public ResponseEntity<UserDTO> updateRoleUser(@PathVariable Long roleId, @PathVariable Long userId) {
      UserDTO updatedUser = this.userService.updateUserRoles(userId, roleId);
      return new ResponseEntity(updatedUser, HttpStatus.OK);
   }

   @DeleteMapping({"/admin/users/{userId}"})
   public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
      String status = this.userService.deleteUser(userId);
      return new ResponseEntity(status, HttpStatus.OK);
   }

@PutMapping("/public/users/{userId}/change-password")
public ResponseEntity<String> changePassword(
        @PathVariable Long userId, 
        @RequestBody Map<String, String> passwordData) {
    
    String oldPassword = passwordData.get("oldPassword");
    String newPassword = passwordData.get("newPassword");
    
    userService.updatePassword(userId, oldPassword, newPassword);
    
    return new ResponseEntity<>("Đổi mật khẩu thành công! ✨", HttpStatus.OK);
}
}
