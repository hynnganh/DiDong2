// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios, { AxiosResponse } from 'axios';
// import apiClient from './apiClient';

// const API_URL = "http://172.20.10.3:8080/api"; // đổi IP theo máy bạn

// async function getToken() {
//   return await AsyncStorage.getItem('jwt-token');
// }

// const api = axios.create({
//   baseURL: API_URL,
//   timeout: 15000,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
//   }
// });

// api.interceptors.request.use(async (config) => {
//   const token = await getToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => Promise.reject(error));

// export async function callApi(endpoint: string, method: 'GET'|'POST'|'PUT'|'DELETE', data: any = null): Promise<AxiosResponse<any>> {
//   try {
//     return await api.request({ url: endpoint, method, data });
//   } catch (error: any) {
//     console.error(`Error at ${method} ${endpoint}:`, error.response?.data || error.message);
//     throw error;
//   }
// }

// // LOGIN
// export async function POST_LOGIN(email: string, password: string) {
//   console.log('Sending login payload:', { email, password });
//   const res = await callApi('/login', 'POST', { email, password });
//   console.log('Login response:', res.data);

//   const token = res.data['jwt-token'];
//   if (!token) throw new Error('No token received');

//   await AsyncStorage.setItem('jwt-token', token);
//   return res.data;
// }

// // REGISTER
// export async function POST_REGISTER(payload: any) {
//   const res = await callApi('/register', 'POST', payload);
//   console.log('Register response:', res.data);
//   return res;
// }

// // GET CATEGORIES
// export async function GET_CATEGORIES(
//   pageNumber: number = 0,
//   pageSize: number = 5,
//   sortBy: string = 'categoryId',
//   sortOrder: string = 'asc'
// ) {
//   const query = `?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
//   return await callApi(`/public/categories${query}`, 'GET');
// }

// // Lấy tất cả sản phẩm
// export async function GET_ALL_PRODUCTS() {
//   const pageSize = 1000;
//   const res = await callApi(`/public/products?pageNumber=0&pageSize=${pageSize}&sortBy=productId&sortOrder=asc`, 'GET');
//   return res.data.content;
// }

// Lấy sản phẩm theo danh mục
export async function GET_PRODUCTS_BY_CATEGORY(categoryId: number) {
  const res = await callApi(
    `/public/categories/${categoryId}/products?pageNumber=0&pageSize=50&sortBy=productId&sortOrder=asc`,
    'GET'
  );
  return res.data;
}

// // Lấy chi tiết sản phẩm
// export async function GET_PRODUCT_DETAIL(productId: number) {
//   return (await callApi(`/public/products/${productId}`, 'GET')).data;
// }

// // Lấy chi tiết giỏ hàng (CartDTO)
// export async function GET_CART(userEmail: string, cartId: number) {
//   const res = await callApi(
//     `/public/users/${encodeURIComponent(userEmail)}/carts/${cartId}`,
//     'GET'
//   );
//   return res.data; 
// }

// // Cập nhật số lượng (Dùng PUT theo Controller)
// export async function UPDATE_CART_QUANTITY(cartId: number, productId: number, quantity: number) {
//   return await callApi(
//     `/public/carts/${cartId}/products/${productId}/quantity/${quantity}`,
//     'PUT'
//   );
// }

// // Xóa sản phẩm khỏi giỏ (Dùng DELETE theo Controller)
// export async function DELETE_FROM_CART(cartId: number, productId: number) {
//   return await callApi(
//     `/public/carts/${cartId}/product/${productId}`,
//     'DELETE'
//   );
// }

// // Thêm sản phẩm vào giỏ hàng
// export async function ADD_TO_CART(cartId: number, productId: number, quantity: number) {
//   const url = `/public/carts/${cartId}/products/${productId}/quantity/${quantity}`;
//   console.log("CALL API:", url);

//   const res = await callApi(url, 'POST');
//   return res.data;
// }

// // LẤY CART ID THEO EMAIL
// export async function GET_CART_ID_BY_EMAIL(email: string): Promise<number | null> {
//   try {
//     const res = await callApi(
//       `/public/users/email/${encodeURIComponent(email)}`,
//       'GET'
//     );
//     return res.data?.cartId ?? null;
//   } catch {
//     return null;
//   }
// }

// TÌM KIẾM SẢN PHẨM THEO TỪ KHÓA VỚI CATEGORY ID
export async function GET_PRODUCTS_BY_KEYWORD(
  keyword: string,
  page: number = 0, 
  size: number = 10, 
  categoryId: number = 0
) {
    const endpoint = `/public/products/keyword/${encodeURIComponent(keyword)}` + 
                   `?pageNumber=${page}` +
                   `&pageSize=${size}` +
                   `&sortBy=productId` +
                   `&sortOrder=asc` +
                   `&categoryId=${categoryId}`;

  const res = await callApi(endpoint, 'GET');
  return res.data; 
}
// export async function SEARCH_PRODUCTS(
//   keyword: string,
//   page = 0,
//   size = 10,
//   categoryId = 9
// ) {
//   const res = await callApi(
//     `/products/search?keyword=${encodeURIComponent(keyword)}&pageNumber=${page}&pageSize=${size}&categoryId=${categoryId}`,
//     'GET'
//   );
//   return res.data;
// }

// // ĐẶT HÀNG
// export const placeOrderApi = async (
//   email: string,
//   cartId: number,
//   paymentMethod: string,
//   address: string
// ) => {
//   const encodedEmail = encodeURIComponent(email);
//   const endpoint = `/public/users/${encodedEmail}/carts/${cartId}/payments/${paymentMethod}/order`;

//   const addressPayload = {
//     addressLine: address, // Đây là chuỗi địa chỉ người dùng nhập
//     city: "Hồ Chí Minh",
//     state: "VN",
//     country: "VN",
//     pincode: "70000"
//   };

//   console.log("🚀 Đang đặt hàng tại: ", endpoint);
//   return await callApi(endpoint, 'POST', addressPayload);
// };


// /**
//  * XÓA SẢN PHẨM KHỎI GIỎ HÀNG
//  * Endpoint: /public/carts/${cartId}/products/${productId}
//  * Method: DELETE
//  */
// export async function DELETE_CART_ITEM(cartId: number, productId: number) {
//   const endpoint = `/public/carts/${cartId}/products/${productId}`;
//   console.log(`[API] Delete Item: ${endpoint}`);
  
//   return await callApi(endpoint, 'DELETE');
// }


// // Lấy đơn hàng của người dùng theo email
// export async function GET_USER_ORDERS(email: string) {
//   const endpoint = `/public/users/${encodeURIComponent(email)}/orders`;
//   const res = await callApi(endpoint, 'GET');
//   return res.data; // Thường trả về một mảng hoặc object có content
// }


// // Lấy chi tiết đơn hàng theo orderId
// export async function GET_ORDER_DETAILS(email: string, orderId: string) {
//   const endpoint = `/public/users/${encodeURIComponent(email)}/orders/${orderId}`;
//   const res = await callApi(endpoint, 'GET');
//   return res.data;
// }


// // --- THANH TOÁN VNPAY ---
// // 1. Cập nhật hàm nhận tham số amount
// export async function CREATE_VNPAY_PAYMENT(amount: string | number) {
//   try {
//     // Truyền amount lên server để tạo hóa đơn đúng số tiền
//     const res = await axios.get(`http://172.20.10.3:3000/payment?amount=${amount}`);
//     console.log('VNPay response:', res.data);
//     return res.data;   // Kỳ vọng trả về { url: "..." }
//   } catch (error: any) {
//     console.error('VNPay error:', error.response?.data || error.message);
//     throw error;
//   }
// }

// // 2. Hàm này đã ổn, đảm bảo placeOrderApi nhận đúng 4 tham số
// export const CONFIRM_ORDER_AFTER_PAYMENT = async (
//   email: string,
//   cartId: number,
//   address: string
// ) => {
//   return await placeOrderApi(email, cartId, "VNPAY", address);
// };



// // --- QUÊN MẬT KHẨU & OTP ---

// // 1. Gửi yêu cầu mã OTP về Email
// export async function SEND_OTP_EMAIL(email: string) {
//   const endpoint = `/forgot-password/send-otp`;
//   console.log(`[API] Đang yêu cầu gửi OTP tới: ${email}`);
//   return await callApi(endpoint, 'POST', { email });
// }

// // 2. Xác thực OTP và đặt lại mật khẩu mới
// export async function VERIFY_OTP_AND_RESET_PASSWORD(payload: any) {
//   const endpoint = `/forgot-password/verify`;
//   console.log(`[API] Gửi xác thực OTP:`, payload); // Xem payload có đủ 3 trường không
  
//   try {
//     const res = await callApi(endpoint, 'POST', payload);
//     console.log(`[API] Kết quả verify:`, res.data); // Xem server trả về gì
//     return res;
//   } catch (error) {
//     throw error;
//   }
// }



// // --- GEMINI AI ---
// const GEMINI_SERVER_URL = "http://localhost:5000/ask";
// export async function ASK_GEMINI_AI(message: string, cartId: number) {
//   try {
//     const res = await axios.post(GEMINI_SERVER_URL, 
//       { 
//         message: message,
//         cartId: cartId 
//       },
//       { 
//         headers: { 'Content-Type': 'application/json' },
//         timeout: 20000 
//       }
//     );
//     if (res.data && res.data.status === "success") {
//       return res.data; 
//     }
    
//     throw new Error(res.data?.message || "Server trả về lỗi");

//   } catch (error: any) {
//     console.error('❌ Lỗi kết nối AI:', error.message);
//     return {
//       status: "error",
//       reply: "Hic, kết nối với Ngọc Anh AI đang chập chờn, bạn kiểm tra mạng hoặc thử lại sau nhé! 💖",
//       added_product_id: null
//     };
//   }
// }


// // 1. API Cập nhật thông tin cá nhân (PUT)
// export const updateUserInfoApi = async (userId: number, userData: any) => {
//     try {
//         const token = await AsyncStorage.getItem("token"); 
//         const response = await apiClient.put(`/public/users/${userId}`, userData, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };

// // 2. API Đổi mật khẩu (POST)
// export const changePasswordApi = async (userId: number, oldPassword: string, newPassword: string) => {
//     return await apiClient.put(`/public/users/${userId}/change-password`, {
//         oldPassword,
//         newPassword
//     });
// };


import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosResponse } from 'axios';
import apiClient from './apiClient';

const API_URL = "http://172.20.10.3:8080/api"; 

async function getToken() {
  return await AsyncStorage.getItem('jwt-token');
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export async function callApi(endpoint: string, method: 'GET'|'POST'|'PUT'|'DELETE', data: any = null): Promise<AxiosResponse<any>> {
  try {
    return await api.request({ url: endpoint, method, data });
  } catch (error: any) {
    console.error(`Error at ${method} ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
}

// ==========================================
//          AUTHENTICATION (LOGIN/REG)
// ==========================================

export async function POST_LOGIN(email: string, password: string) {
  const res = await callApi('/login', 'POST', { email, password });
  const token = res.data['jwt-token'];
  if (!token) throw new Error('No token received');
  await AsyncStorage.setItem('jwt-token', token);
  return res.data;
}

export async function POST_REGISTER(payload: any) {
  return await callApi('/register', 'POST', payload);
}

// ==========================================
//          PRODUCTS & CATEGORIES
// ==========================================

export async function GET_CATEGORIES(pageNumber = 0, pageSize = 5, sortBy = 'categoryId', sortOrder = 'asc') {
  const query = `?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
  return await callApi(`/public/categories${query}`, 'GET');
}

export async function GET_ALL_PRODUCTS() {
  const res = await callApi(`/public/products?pageNumber=0&pageSize=1000&sortBy=productId&sortOrder=asc`, 'GET');
  return res.data.content;
}

export async function GET_PRODUCT_DETAIL(productId: number) {
  return (await callApi(`/public/products/${productId}`, 'GET')).data;
}

// ==========================================
//                CART LOGIC
// ==========================================

export async function GET_CART(userEmail: string, cartId: number) {
  return (await callApi(`/public/users/${encodeURIComponent(userEmail)}/carts/${cartId}`, 'GET')).data;
}

export async function ADD_TO_CART(cartId: number, productId: number, quantity: number) {
  return (await callApi(`/public/carts/${cartId}/products/${productId}/quantity/${quantity}`, 'POST')).data;
}

export async function UPDATE_CART_QUANTITY(cartId: number, productId: number, quantity: number) {
  return await callApi(`/public/carts/${cartId}/products/${productId}/quantity/${quantity}`, 'PUT');
}

// Xóa sản phẩm khỏi giỏ (Dùng DELETE theo Controller)
export async function DELETE_FROM_CART(cartId: number, productId: number) {
  return await callApi(
    `/public/carts/${cartId}/product/${productId}`,
    'DELETE'
  );
}

export async function DELETE_CART_ITEM(cartId: number, productId: number) {
  return await callApi(`/public/carts/${cartId}/products/${productId}`, 'DELETE');
}

export async function GET_CART_ID_BY_EMAIL(email: string): Promise<number | null> {
  try {
    const res = await callApi(`/public/users/email/${encodeURIComponent(email)}`, 'GET');
    return res.data?.cartId ?? null;
  } catch { return null; }
}

export const CLEAR_CART_API = async (email: string, cartId: number) => {
  return await callApi(`/public/users/${email}/carts/${cartId}/clear`, 'DELETE');
};
// ==========================================
//           ORDER & SHIPPING (FIXED)
// ==========================================

/**
 * ✅ ĐẶT HÀNG (FIXED): Chuyển sang dùng RequestParams thay vì Body
 * Khớp với Controller: /public/users/{emailId}/carts/{cartId}/place-order
 */
// export const placeOrderApi = async (email: string, cartId: number, payment: string, address: string, city: string) => {
//   const url = `/public/users/${email}/carts/${cartId}/place-order?paymentMethod=${payment}&city=${city}&detailAddress=${address}`;
//   return await callApi(url, 'POST');
// };

export async function placeOrderApi(
  email: string, 
  cartId: number, 
  paymentMethod: string, 
  address: string, 
  city: string, 
  shippingFee: number 
) {
  // Gộp tham số trực tiếp vào URL
  const url = `/public/users/${email}/carts/${cartId}/payments/${paymentMethod}/order` 
            + `?address=${encodeURIComponent(address)}`
            + `&city=${encodeURIComponent(city)}`
            + `&shippingFee=${shippingFee}`;

  const response = await callApi(url, 'POST', null);
  return response;
}

export async function GET_USER_ORDERS(email: string) {
  return (await callApi(`/public/users/${encodeURIComponent(email)}/orders`, 'GET')).data;
}

// Lấy chi tiết đơn hàng theo orderId
export async function GET_ORDER_DETAILS(email: string, orderId: string) {
  const endpoint = `/public/users/${encodeURIComponent(email)}/orders/${orderId}`;
  const res = await callApi(endpoint, 'GET');
  return res.data;
}
// ==========================================
//          VNPAY & PAYMENT FLOW
// ==========================================

export async function CREATE_VNPAY_PAYMENT(amount: string | number) {
  const res = await axios.get(`http://172.20.10.3:3000/payment?amount=${amount}`);
  return res.data;
}

export const CONFIRM_ORDER_AFTER_PAYMENT = async (
  email: string,
  cartId: number,
  address: string,
  city: string,
  shippingFee: number
) => {
  return await placeOrderApi(email, cartId, "VNPAY", address, city, shippingFee);
};

// ==========================================
//          USER PROFILE & PASSWORD
// ==========================================

export const updateUserInfoApi = async (userId: number, userData: any) => {
    const token = await getToken(); 
    return (await apiClient.put(`/public/users/${userId}`, userData, {
        headers: { Authorization: `Bearer ${token}` },
    })).data;
};

export const changePasswordApi = async (userId: number, oldPassword: string, newPassword: string) => {
    return await apiClient.put(`/public/users/${userId}/change-password`, {
        oldPassword,
        newPassword
    });
};

// --- QUÊN MẬT KHẨU & OTP ---

// 1. Gửi yêu cầu mã OTP về Email
export async function SEND_OTP_EMAIL(email: string) {
  const endpoint = `/forgot-password/send-otp`;
  console.log(`[API] Đang yêu cầu gửi OTP tới: ${email}`);
  return await callApi(endpoint, 'POST', { email });
}

// 2. Xác thực OTP và đặt lại mật khẩu mới
export async function VERIFY_OTP_AND_RESET_PASSWORD(payload: any) {
  const endpoint = `/forgot-password/verify`;
  console.log(`[API] Gửi xác thực OTP:`, payload);
  
  try {
    const res = await callApi(endpoint, 'POST', payload);
    console.log(`[API] Kết quả verify:`, res.data);
    return res;
  } catch (error) {
    throw error;
  }
}



// --- GEMINI AI ---
const GEMINI_SERVER_URL = "http://localhost:5000/ask";
export async function ASK_GEMINI_AI(message: string, cartId: number) {
  try {
    const res = await axios.post(GEMINI_SERVER_URL, 
      { 
        message: message,
        cartId: cartId 
      },
      { 
        headers: { 'Content-Type': 'application/json' },
        timeout: 20000 
      }
    );
    if (res.data && res.data.status === "success") {
      return res.data; 
    }
    
    throw new Error(res.data?.message || "Server trả về lỗi");

  } catch (error: any) {
    console.error('❌ Lỗi kết nối AI:', error.message);
    return {
      status: "error",
      reply: "Hic, kết nối với Ngọc Anh AI đang chập chờn, bạn kiểm tra mạng hoặc thử lại sau nhé! 💖",
      added_product_id: null
    };
  }
}
