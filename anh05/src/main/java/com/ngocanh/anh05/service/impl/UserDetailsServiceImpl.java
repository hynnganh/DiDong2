// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05.service.impl;

import com.ngocanh.anh05.config.UserInfoConfig;
import com.ngocanh.anh05.entity.User;
import com.ngocanh.anh05.exceptions.ResourceNotFoundException;
import com.ngocanh.anh05.repository.UserRepo;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
   @Autowired
   private UserRepo userRepo;

   public UserDetailsServiceImpl() {
   }

   public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
      Optional<User> user = this.userRepo.findByEmail(username);
      return (UserDetails)user.map(UserInfoConfig::new).orElseThrow(() -> {
         return new ResourceNotFoundException("User", "email", username);
      });
   }
}
