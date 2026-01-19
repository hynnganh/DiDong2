import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { POST_REGISTER } from '../service/APIService';

const { width, height } = Dimensions.get('window');

// ĐỊNH NGHĨA BẢNG MÀU MỸ PHẨM
const COLORS = {
  primary: '#EABFBB',    // Hồng Nude chủ đạo
  secondary: '#F7D7D4',  // Hồng nhạt decor
  textDark: '#4A4A4A',   // Chữ chính
  textLight: '#A1A1A1',  // Chữ phụ
  bgLight: '#FFF9F9',    // Nền sáng hồng
  white: '#FFFFFF',
  error: '#FF7675'
};

const ModernInput = ({ label, icon, value, setValue, error, secure = false, ...props }: any) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputContainer, error && styles.inputError]}>
      <Feather name={icon} size={18} color={COLORS.primary} style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        secureTextEntry={secure}
        placeholder={`Nhập ${label.toLowerCase()}...`}
        placeholderTextColor="#CCC"
        {...props}
      />
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState({
    street: "", buildingName: "", city: "", state: "", country: "", pincode: ""
  });

  const scale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleRegister = async () => {
    setLoading(true);
    setErrors({});
    try {
      await POST_REGISTER({ firstName, lastName, mobileNumber, email, password, address });
      Alert.alert("🎉 Thành công", "Chào mừng bạn thơ đã gia nhập cộng đồng làm đẹp!");
      router.replace('/login');
    } catch (err: any) {
      const data = err?.response?.data;
      if (typeof data === 'object') setErrors(data);
      else Alert.alert("Lỗi", data || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Background Decor mới */}
      <View style={styles.bgDecor} />
      <View style={styles.circleDecor} />
      
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Header */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Feather name="chevron-left" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Tạo tài khoản</Text>
            <Text style={styles.subtitle}>Bắt đầu hành trình tỏa sáng của riêng bạn</Text>
          </Animated.View>

          {/* Form Card */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.formCard}>
            
            <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="flower-outline" size={20} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
            </View>

            <View style={styles.row}>
                <View style={{flex: 1, marginRight: 10}}>
                    <ModernInput label="Họ" icon="user" value={firstName} setValue={setFirstName} error={errors.firstName} />
                </View>
                <View style={{flex: 1}}>
                    <ModernInput label="Tên" icon="user" value={lastName} setValue={setLastName} error={errors.lastName} />
                </View>
            </View>
            
            <ModernInput label="Số điện thoại" icon="phone" value={mobileNumber} setValue={setMobileNumber} error={errors.mobileNumber} keyboardType="phone-pad" />
            <ModernInput label="Email" icon="mail" value={email} setValue={setEmail} error={errors.email} keyboardType="email-address" />
            <ModernInput label="Mật khẩu" icon="lock" value={password} setValue={setPassword} error={errors.password} secure />

            <View style={styles.divider} />
            
            <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="map-marker-outline" size={20} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>
            </View>
            
            <ModernInput label="Đường" icon="map-pin" value={address.street} setValue={(v:any)=>setAddress({...address, street:v})} error={errors.street}/>
            <ModernInput label="Thành phố" icon="map" value={address.city} setValue={(v:any)=>setAddress({...address, city:v})} error={errors.city}/>
            
            <View style={styles.row}>
                <View style={{flex: 1, marginRight: 10}}>
                    <ModernInput label="Quốc gia" icon="globe" value={address.country} setValue={(v:any)=>setAddress({...address, country:v})} error={errors.country}/>
                </View>
                <View style={{flex: 1}}>
                    <ModernInput label="Mã bưu điện" icon="hash" value={address.pincode} setValue={(v:any)=>setAddress({...address, pincode:v})} error={errors.pincode}/>
                </View>
            </View>

            {/* Register Button - Chuyển sang tone Hồng Nude */}
            <Animated.View style={[animatedButtonStyle, { marginTop: 25 }]}>
              <Pressable
                onPressIn={() => (scale.value = withSpring(0.96))}
                onPressOut={() => (scale.value = withSpring(1))}
                onPress={handleRegister}
                disabled={loading}
                style={styles.btn}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>ĐĂNG KÝ NGAY</Text>}
              </Pressable>
            </Animated.View>

            <TouchableOpacity onPress={() => router.push('/login')} style={styles.footerLink}>
              <Text style={styles.footerText}>Đã có tài khoản? <Text style={styles.linkText}>Đăng nhập ngay</Text></Text>
            </TouchableOpacity>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.bgLight },
  bgDecor: { 
    position: 'absolute', 
    top: 0, 
    width: width, 
    height: height * 0.35, 
    backgroundColor: COLORS.primary, 
    borderBottomLeftRadius: 60, 
    borderBottomRightRadius: 60 
  },
  circleDecor: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.secondary,
    top: -50,
    right: -50,
    opacity: 0.5
  },
  scrollContent: { paddingHorizontal: 20, paddingTop: height * 0.06, paddingBottom: 40 },
  header: { marginBottom: 25, paddingHorizontal: 5 },
  backBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 12, 
    backgroundColor: 'rgba(255,255,255,0.25)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  title: { fontSize: 30, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.9)', marginTop: 5, fontStyle: 'italic' },
  
  formCard: { 
    backgroundColor: COLORS.white, 
    borderRadius: 35, 
    padding: 22, 
    shadowColor: COLORS.primary, 
    shadowOffset: { width: 0, height: 15 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 25, 
    elevation: 12 
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginTop: 5 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.textDark, marginLeft: 8, textTransform: 'uppercase', letterSpacing: 1 },
  
  inputWrapper: { marginBottom: 18 },
  label: { fontSize: 12, color: COLORS.textLight, marginBottom: 8, fontWeight: '700', marginLeft: 4, textTransform: 'uppercase' },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FBFBFB', 
    borderRadius: 15, 
    paddingHorizontal: 15, 
    height: 52,
    borderWidth: 1,
    borderColor: '#F2F2F2'
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: COLORS.textDark, fontWeight: '500' },
  inputError: { borderWidth: 1, borderColor: COLORS.error },
  errorText: { color: COLORS.error, fontSize: 11, marginTop: 5, marginLeft: 5 },
  
  row: { flexDirection: 'row' },
  divider: { height: 1, backgroundColor: '#FDF2F2', marginVertical: 25 },
  
  btn: { 
    backgroundColor: COLORS.primary, 
    height: 58, 
    borderRadius: 18, 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15, letterSpacing: 2 },
  
  footerLink: { marginTop: 20, alignItems: 'center' },
  footerText: { color: COLORS.textLight, fontSize: 14 },
  linkText: { color: COLORS.primary, fontWeight: 'bold', textDecorationLine: 'underline' },
});