// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05.controller;

import com.ngocanh.anh05.entity.Address;
import com.ngocanh.anh05.payloads.AddressDTO;
import com.ngocanh.anh05.service.AddressService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/admin"})
@SecurityRequirement(
   name = "E-Commerce Application"
)
@CrossOrigin(
   origins = {"*"}
)
public class AddressController {
   @Autowired
   private AddressService addressService;

   public AddressController() {
   }

   @PostMapping({"/address"})
   public ResponseEntity<AddressDTO> createAddress(@RequestBody @Valid AddressDTO addressDTO) {
      AddressDTO savedAddressDTO = this.addressService.createAddress(addressDTO);
      return new ResponseEntity(savedAddressDTO, HttpStatus.CREATED);
   }

   @GetMapping({"/addresses"})
   public ResponseEntity<List<AddressDTO>> getAddresses() {
      List<AddressDTO> addressDTOs = this.addressService.getAddresses();
      return new ResponseEntity(addressDTOs, HttpStatus.FOUND);
   }

   @GetMapping({"/addresses/{addressId}"})
   public ResponseEntity<AddressDTO> getAddress(@PathVariable Long addressId) {
      AddressDTO addressDTO = this.addressService.getAddress(addressId);
      return new ResponseEntity(addressDTO, HttpStatus.FOUND);
   }

   @PutMapping({"/addresses/{addressId}"})
   public ResponseEntity<AddressDTO> updateAddress(@PathVariable Long addressId, @RequestBody Address address) {
      AddressDTO addressDTO = this.addressService.updateAddress(addressId, address);
      return new ResponseEntity(addressDTO, HttpStatus.OK);
   }

   @DeleteMapping({"/addresses/{addressId}"})
   public ResponseEntity<String> deleteAddress(@PathVariable Long addressId) {
      String status = this.addressService.deleteAddress(addressId);
      return new ResponseEntity(status, HttpStatus.OK);
   }
}
