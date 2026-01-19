// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05.service.impl;

import com.ngocanh.anh05.entity.Address;
import com.ngocanh.anh05.entity.User;
import com.ngocanh.anh05.exceptions.APIException;
import com.ngocanh.anh05.exceptions.ResourceNotFoundException;
import com.ngocanh.anh05.payloads.AddressDTO;
import com.ngocanh.anh05.repository.AddressRepo;
import com.ngocanh.anh05.repository.UserRepo;
import com.ngocanh.anh05.service.AddressService;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Transactional
@Service
public class AddressServiceImpl implements AddressService {
   @Autowired
   private AddressRepo addressRepo;
   @Autowired
   private UserRepo userRepo;
   @Autowired
   private ModelMapper modelMapper;

   public AddressServiceImpl() {
   }

   public AddressDTO createAddress(AddressDTO addressDTO) {
      String country = addressDTO.getCountry();
      String state = addressDTO.getState();
      String city = addressDTO.getCity();
      String pincode = addressDTO.getPincode();
      String street = addressDTO.getStreet();
      String buildingName = addressDTO.getBuildingName();
      Address addressFromDB = this.addressRepo.findByCountryAndStateAndCityAndPincodeAndStreetAndBuildingName(country, state, city, pincode, street, buildingName);
      if (addressFromDB != null) {
         throw new APIException("Address already exists with addressId: " + addressFromDB.getAddressId());
      } else {
         Address address = (Address)this.modelMapper.map(addressDTO, Address.class);
         Address savedAddress = (Address)this.addressRepo.save(address);
         return (AddressDTO)this.modelMapper.map(savedAddress, AddressDTO.class);
      }
   }

   public List<AddressDTO> getAddresses() {
      List<Address> addresses = this.addressRepo.findAll();
      List<AddressDTO> addressDTOs = (List)addresses.stream().map((address) -> {
         return (AddressDTO)this.modelMapper.map(address, AddressDTO.class);
      }).collect(Collectors.toList());
      return addressDTOs;
   }

   public AddressDTO getAddress(Long addressId) {
      Address address = (Address)this.addressRepo.findById(addressId).orElseThrow(() -> {
         return new ResourceNotFoundException("Address", "addressId", addressId);
      });
      return (AddressDTO)this.modelMapper.map(address, AddressDTO.class);
   }

   public AddressDTO updateAddress(Long addressId, Address address) {
      Address addressFromDB = this.addressRepo.findByCountryAndStateAndCityAndPincodeAndStreetAndBuildingName(address.getCountry(), address.getState(), address.getCity(), address.getPincode(), address.getStreet(), address.getBuildingName());
        if (addressFromDB != null && !addressFromDB.getAddressId().equals(addressId)) {
             throw new APIException("Address already exists with addressId: " + addressFromDB.getAddressId());
        } else {
             Address existingAddress = (Address)this.addressRepo.findById(addressId).orElseThrow(() -> {
                return new ResourceNotFoundException("Address", "addressId", addressId);
             });
             existingAddress.setCountry(address.getCountry());
             existingAddress.setState(address.getState());
             existingAddress.setCity(address.getCity());
             existingAddress.setPincode(address.getPincode());
             existingAddress.setStreet(address.getStreet());
             existingAddress.setBuildingName(address.getBuildingName());
             Address updatedAddress = (Address)this.addressRepo.save(existingAddress);
             return (AddressDTO)this.modelMapper.map(updatedAddress, AddressDTO.class);
        }
   }

   public String deleteAddress(Long addressId) {
      Address addressFromDB = (Address)this.addressRepo.findById(addressId).orElseThrow(() -> {
         return new ResourceNotFoundException("Address", "addressId", addressId);
      });
      List<User> users = this.userRepo.findByAddress(addressId);
      users.forEach((user) -> {
         user.getAddresses().remove(addressFromDB);
         this.userRepo.save(user);
      });
      this.addressRepo.deleteById(addressId);
      return "Address deleted succesfully with addressId: " + addressId;
   }
}
