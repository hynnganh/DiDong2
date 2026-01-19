// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05.repository;

import com.ngocanh.anh05.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepo extends JpaRepository<Role, Long> {
}
