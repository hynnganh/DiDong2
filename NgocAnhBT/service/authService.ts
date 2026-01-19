import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient'; // Import file apiClient bạn đã cấu hình IP

export const AuthService = {
  
  // 1. ĐĂNG NHẬP
  login: async (email: string, password: string) => {
    try {
      console.log("Đang gọi API Login:", email);
      
      const response = await apiClient.post('/auth/login', { 
        email: email, 
        password: password 
      });

      // Java trả về: { accessToken: "...", user: { ... } }
      const { accessToken, user } = response.data;

      if (accessToken) {
        // Lưu token để các request sau tự động gắn vào Header
        await AsyncStorage.setItem('jwt-token', accessToken);
        
        // Lưu thông tin user (để hiển thị tên, avatar ở màn hình Home)
        await AsyncStorage.setItem('user-info', JSON.stringify(user));
        
        return true; // Login thành công
      }
      return false;
    } catch (error: any) {
      console.error("Lỗi Login:", error.response?.data || error.message);
      // Ném lỗi ra để màn hình Login hiển thị Alert
      throw error.response?.data || "Lỗi kết nối đến Server"; 
    }
  },

  // 2. ĐĂNG KÝ
  register: async (fullName: string, email: string, password: string) => {
    try {
      console.log("Đang gọi API Register:", email);

      const response = await apiClient.post('/auth/register', { 
        fullName: fullName, 
        email: email, 
        password: password 
      });

      return response.data; // Trả về text "Đăng ký thành công" từ Java
    } catch (error: any) {
      console.error("Lỗi Register:", error.response?.data || error.message);
      throw error.response?.data || "Lỗi đăng ký";
    }
  },

  // 3. ĐĂNG XUẤT
  logout: async () => {
    await AsyncStorage.removeItem('jwt-token');
    await AsyncStorage.removeItem('user-info');
  },

  // 4. KIỂM TRA ĐÃ LOGIN CHƯA (Dùng cho Splash Screen)
  checkAuth: async () => {
    const token = await AsyncStorage.getItem('jwt-token');
    return !!token; // Trả về true nếu có token, false nếu không
  }
};