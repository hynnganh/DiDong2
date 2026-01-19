// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05.service;

import com.ngocanh.anh05.payloads.UserDTO;
import com.ngocanh.anh05.payloads.UserResponse;

public interface UserService {
   UserDTO updateUserRoles(Long userId, Long roleId);

   UserDTO registerUser(UserDTO userDTO);

   UserResponse getAllUsers(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

   UserDTO getUserById(Long userId);

   UserDTO getUserByEmail(String email);

   UserDTO updateUser(Long userId, UserDTO userDTO);

   String deleteUser(Long userId);

   void updatePassword(String email, String newEncodedPassword);
   void updatePassword(Long userId, String oldPassword, String newPassword);
}