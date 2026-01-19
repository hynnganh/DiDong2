import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { SEND_OTP_EMAIL, VERIFY_OTP_AND_RESET_PASSWORD } from '../service/APIService';

const COLORS = { primary: '#EABFBB', textDark: '#4A4A4A', bgLight: '#FFF9F9' };

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false); // Đã sửa dấu ngoặc vuông ở đây

  
  // --- STATE CHO THÔNG BÁO ---
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: "", message: "", action: () => {} });

  // Hàm hiển thị thông báo thay cho Alert
  const showNotice = (title: string, message: string, action?: () => void) => {
    setModalConfig({
      title,
      message,
      action: action || (() => setModalVisible(false))
    });
    setModalVisible(true);
  };

  // BƯỚC 1: GỬI MÃ OTP
  const handleSendOTP = async () => {
    if (!email) {
      showNotice("Lỗi", "bạn nhập email để nhận mã xác nhận nhé!");
      return;
    }
    try {
      setLoading(true);
      await SEND_OTP_EMAIL(email); 
      
      showNotice("Thành công ✨", "Mã xác nhận đã được gửi vào Email của bạn!", () => {
        setModalVisible(false);
        setStep(2);
      });
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.response?.data || "Không thể gửi mã!";
      showNotice("Lỗi", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // BƯỚC 2: XÁC NHẬN OTP VÀ ĐỔI MẬT KHẨU
  const handleVerifyAndReset = async () => {
    if (!otp || !newPassword) {
      showNotice("Lỗi", "bạn nhập đủ mã OTP và mật khẩu mới nhé!");
      return;
    }

    try {
      setLoading(true);
      await VERIFY_OTP_AND_RESET_PASSWORD({
        email: email,
        otp: otp,
        newPassword: newPassword
      });

      showNotice("Chúc mừng bạn! ✨", "Mật khẩu mới đã sẵn sàng rạng rỡ!", () => {
        setModalVisible(false);
        router.dismissAll();
        router.replace('/login');
      });

    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data || "Mã OTP không đúng rồi bạn ơi!";
      showNotice("Lỗi xác thực", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* MODAL THÔNG BÁO TỰ CHẾ (HIỆN GIỮA MÀN HÌNH) */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalConfig.title}</Text>
            <Text style={styles.modalMessage}>{modalConfig.message}</Text>
            <TouchableOpacity 
              style={styles.modalBtn} 
              onPress={modalConfig.action}
            >
              <Text style={styles.modalBtnText}>Đồng ý</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Nút Back */}
      <TouchableOpacity 
        style={styles.backBtn} 
        onPress={() => step === 1 ? router.back() : setStep(1)}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>{step === 1 ? "Quên mật khẩu? 🌸" : "Xác thực OTP 🔐"}</Text>
        <Text style={styles.subtitle}>
          {step === 1 ? "Nhập email để nhận mã bảo mật" : "Nhập mã OTP từ Email và đặt mật khẩu mới"}
        </Text>
      </View>

      {step === 1 ? (
        <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.form}>
          <View style={styles.inputBox}>
            <Feather name="mail" size={20} color={COLORS.primary} />
            <TextInput 
                style={styles.input} 
                placeholder="Email của bạn" 
                value={email} 
                onChangeText={setEmail} 
                autoCapitalize="none" 
                keyboardType="email-address"
                placeholderTextColor="#CCC"
            />
          </View>
          <TouchableOpacity style={styles.submitBtn} onPress={handleSendOTP} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>GỬI MÃ XÁC NHẬN</Text>}
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <Animated.View entering={FadeInRight} style={styles.form}>
          <View style={styles.inputBox}>
            <Feather name="key" size={20} color={COLORS.primary} />
            <TextInput 
                style={styles.input} 
                placeholder="Nhập mã OTP" 
                keyboardType="numeric" 
                value={otp} 
                onChangeText={setOtp} 
                placeholderTextColor="#CCC"
            />
          </View>
          <View style={[styles.inputBox, { marginTop: 15 }]}>
            <Feather name="lock" size={20} color={COLORS.primary} />
            <TextInput 
                style={styles.input} 
                placeholder="Mật khẩu mới" 
                secureTextEntry 
                value={newPassword} 
                onChangeText={setNewPassword} 
                placeholderTextColor="#CCC"
            />
          </View>
          <TouchableOpacity style={styles.submitBtn} onPress={handleVerifyAndReset} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>XÁC NHẬN ĐỔI MẬT KHẨU</Text>}
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLight, padding: 25 },
  backBtn: { marginTop: 40, width: 40, height: 40, justifyContent: 'center' },
  header: { marginTop: 20, marginBottom: 40 },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.textDark },
  subtitle: { fontSize: 15, color: '#A1A1A1', marginTop: 10 },
  form: { 
    backgroundColor: '#fff', 
    padding: 25, 
    borderRadius: 30, 
    elevation: 8, 
    shadowColor: COLORS.primary, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 5,
    maxWidth: 500, // Tối ưu cho laptop
    width: '100%',
    alignSelf: 'center'
  },
  inputBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FBFBFB', 
    borderRadius: 15, 
    paddingHorizontal: 15, 
    height: 55, 
    borderWidth: 1, 
    borderColor: '#F2F2F2' 
  },
  input: { 
    flex: 1, 
    marginLeft: 12, 
    fontSize: 16, 
    color: COLORS.textDark,
    ...Platform.select({ web: { outlineStyle: 'none' } }) 
  } as any,
  submitBtn: { 
    backgroundColor: COLORS.primary, 
    height: 55, 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 25 
  },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  // STYLES CHO MODAL THÔNG BÁO
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: 320,
    backgroundColor: '#FFF',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 10
  },
  modalMessage: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22
  },
  modalBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 15
  },
  modalBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16
  }
});