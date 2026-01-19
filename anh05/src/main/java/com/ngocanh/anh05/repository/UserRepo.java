// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05.repository;

import com.ngocanh.anh05.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
   @Query("SELECT u FROM User u JOIN FETCH u.addresses a WHERE a.addressId = ?1")
   List<User> findByAddress(Long addressId);

   Optional<User> findByEmail(String email);
}
