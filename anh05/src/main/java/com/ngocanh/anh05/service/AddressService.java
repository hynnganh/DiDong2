// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05.service;

import com.ngocanh.anh05.entity.Address;
import com.ngocanh.anh05.payloads.AddressDTO;
import java.util.List;

public interface AddressService {
   AddressDTO createAddress(AddressDTO addressDTO);

   List<AddressDTO> getAddresses();

   AddressDTO getAddress(Long addressId);

   AddressDTO updateAddress(Long addressId, Address address);

   String deleteAddress(Long addressId);
}
