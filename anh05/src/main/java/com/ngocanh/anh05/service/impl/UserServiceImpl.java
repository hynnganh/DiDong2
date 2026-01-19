package com.ngocanh.anh05.service.impl;

import com.ngocanh.anh05.config.AppConstants;
import com.ngocanh.anh05.entity.*;
import com.ngocanh.anh05.exceptions.APIException;
import com.ngocanh.anh05.exceptions.ResourceNotFoundException;
import com.ngocanh.anh05.payloads.*;
import com.ngocanh.anh05.repository.AddressRepo;
import com.ngocanh.anh05.repository.RoleRepo;
import com.ngocanh.anh05.repository.UserRepo;
import com.ngocanh.anh05.service.CartService;
import com.ngocanh.anh05.service.UserService;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Transactional
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RoleRepo roleRepo;

    @Autowired
    private AddressRepo addressRepo;

    @Autowired
    private CartService cartService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public UserDTO registerUser(UserDTO userDTO) {
        try {
            User user = modelMapper.map(userDTO, User.class);
            
            // Khởi tạo giỏ hàng cho người dùng mới
            Cart cart = new Cart();
            cart.setUser(user);
            user.setCart(cart);

            // Gán Role mặc định là USER
            Role role = roleRepo.findById(AppConstants.USER_ID)
                    .orElseThrow(() -> new ResourceNotFoundException("Role", "roleId", AppConstants.USER_ID));
            user.getRoles().add(role);

            // Xử lý địa chỉ
            AddressDTO addressDTO = userDTO.getAddress();
            Address address = addressRepo.findByCountryAndStateAndCityAndPincodeAndStreetAndBuildingName(
                    addressDTO.getCountry(), addressDTO.getState(), addressDTO.getCity(),
                    addressDTO.getPincode(), addressDTO.getStreet(), addressDTO.getBuildingName());

            if (address == null) {
                address = new Address(addressDTO.getCountry(), addressDTO.getState(), addressDTO.getCity(),
                        addressDTO.getPincode(), addressDTO.getStreet(), addressDTO.getBuildingName());
                address = addressRepo.save(address);
            }

            user.setAddresses(List.of(address));
            User registeredUser = userRepo.save(user);

            // Chuyển đổi về DTO để trả về
            UserDTO responseDTO = modelMapper.map(registeredUser, UserDTO.class);
            responseDTO.setAddress(modelMapper.map(address, AddressDTO.class));
            
            return responseDTO;
        } catch (DataIntegrityViolationException e) {
            throw new APIException("Người dùng đã tồn tại với email: " + userDTO.getEmail());
        }
    }

    @Override
    public UserResponse getAllUsers(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        
        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<User> pageUsers = userRepo.findAll(pageDetails);
        List<User> users = pageUsers.getContent();

        if (users.isEmpty()) {
            throw new APIException("Không tìm thấy người dùng nào!");
        }

        List<UserDTO> userDTOs = users.stream().map(user -> {
            UserDTO dto = modelMapper.map(user, UserDTO.class);
            
            if (!user.getAddresses().isEmpty()) {
                dto.setAddress(modelMapper.map(user.getAddresses().get(0), AddressDTO.class));
            }

            if (user.getCart() != null) {
                CartDTO cartDTO = modelMapper.map(user.getCart(), CartDTO.class);
                List<ProductDTO> products = user.getCart().getCartItems().stream()
                        .map(item -> modelMapper.map(item.getProduct(), ProductDTO.class))
                        .collect(Collectors.toList());
                cartDTO.setProducts(products);
                dto.setCart(cartDTO);
            }
            return dto;
        }).collect(Collectors.toList());

        UserResponse userResponse = new UserResponse();
        userResponse.setContent(userDTOs);
        userResponse.setPageNumber(pageUsers.getNumber());
        userResponse.setPageSize(pageUsers.getSize());
        userResponse.setTotalElements(pageUsers.getTotalElements());
        userResponse.setTotalPages(pageUsers.getTotalPages());
        userResponse.setLastPage(pageUsers.isLast());
        
        return userResponse;
    }

    @Override
    public UserDTO getUserById(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));
        
        return convertToDTO(user);
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        
        return convertToDTO(user);
    }

 @Override
public UserDTO updateUser(Long userId, UserDTO userDTO) {
    User user = userRepo.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));

    // CHỈ SET NẾU DỮ LIỆU GỬI LÊN KHÔNG NULL
    if (userDTO.getFirstName() != null) user.setFirstName(userDTO.getFirstName());
    if (userDTO.getLastName() != null) user.setLastName(userDTO.getLastName());
    if (userDTO.getMobileNumber() != null) user.setMobileNumber(userDTO.getMobileNumber());
    
    // Nếu không gửi email mới thì giữ nguyên email cũ trong DB
    if (userDTO.getEmail() != null) user.setEmail(userDTO.getEmail());

    User updatedUser = userRepo.save(user);
    return convertToDTO(updatedUser);
}
    @Override
    public void updatePassword(String email, String encodedPassword) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        
        user.setPassword(encodedPassword);
        userRepo.save(user);
    }

    @Override
    public String deleteUser(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));
        
        // Xóa sạch các item trong giỏ hàng trước khi xóa user
        if (user.getCart() != null) {
            Long cartId = user.getCart().getCartId();
            user.getCart().getCartItems().forEach(item -> 
                cartService.deleteProductFromCart(cartId, item.getProduct().getProductId())
            );
        }
        
        userRepo.delete(user);
        return "Người dùng với ID " + userId + " đã được xóa thành công!";
    }

    @Override
    public UserDTO updateUserRoles(Long userId, Long roleId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        user.getRoles().clear();
        if (roleId.equals(AppConstants.ADMIN_ID)) {
            Role adminRole = roleRepo.findById(AppConstants.ADMIN_ID).get();
            user.getRoles().add(adminRole);
        }
        
        Role userRole = roleRepo.findById(AppConstants.USER_ID).get();
        user.getRoles().add(userRole);
        
        User updatedUser = userRepo.save(user);
        return modelMapper.map(updatedUser, UserDTO.class);
    }

    // Hàm hỗ trợ chuyển đổi User sang UserDTO để tránh lặp lại code
    private UserDTO convertToDTO(User user) {
        UserDTO dto = modelMapper.map(user, UserDTO.class);
        
        if (user.getAddresses() != null && !user.getAddresses().isEmpty()) {
            dto.setAddress(modelMapper.map(user.getAddresses().get(0), AddressDTO.class));
        }

        if (user.getCart() != null) {
            CartDTO cartDTO = modelMapper.map(user.getCart(), CartDTO.class);
            List<ProductDTO> products = user.getCart().getCartItems().stream()
                    .map(item -> modelMapper.map(item.getProduct(), ProductDTO.class))
                    .collect(Collectors.toList());
            cartDTO.setProducts(products);
            dto.setCart(cartDTO);
        }
        return dto;
    }

    @Override
public void updatePassword(Long userId, String oldPassword, String newPassword) {
    // 1. Tìm người dùng
    User user = userRepo.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));

    // 2. Kiểm tra mật khẩu cũ có khớp không
    if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
        throw new APIException("Mật khẩu cũ không chính xác rồi nàng ơi! 😢");
    }

    // 3. Mã hóa mật khẩu mới và lưu lại
    user.setPassword(passwordEncoder.encode(newPassword));
    userRepo.save(user);
}
}