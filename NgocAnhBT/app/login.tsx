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
import Animated, {
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { POST_LOGIN } from '../service/APIService';

const { width, height } = Dimensions.get('window');

// ĐỒNG BỘ BẢNG MÀU MỸ PHẨM
const COLORS = {
  primary: '#EABFBB',    // Hồng Nude chủ đạo
  secondary: '#F7D7D4',  // Hồng nhạt decor
  textDark: '#4A4A4A',   // Chữ chính (Xám đen thanh lịch)
  textLight: '#A1A1A1',  // Chữ phụ
  bgLight: '#FFF9F9',    // Nền sáng hồng nhạt
  white: '#FFFFFF',
  error: '#FF7675'       // Màu đỏ pastel cho lỗi
};

export default function ModernLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const scale = useSharedValue(1);
  const shakeOffset = useSharedValue(0);

  const shakeAction = () => {
    shakeOffset.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedFormStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }],
  }));

  const validate = () => {
    let isValid = true;
    const emailRegex = /\S+@\S+\.\S+/;

    if (!email) {
      setEmailError('bạn vui lòng nhập Email');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Email không đúng định dạng');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('bạn vui lòng nhập mật khẩu');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) {
      shakeAction();
      return;
    }

    try {
      setLoading(true);
      const response = await POST_LOGIN(email, password);
      if (response['jwt-token']) {
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      shakeAction();
      Alert.alert('Thông báo', 'Email hoặc mật khẩu không chính xác. bạn kiểm tra lại nhé!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Background Decor */}
      <View style={styles.bgDecor} />
      <View style={styles.circleDecor} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.headerSection}>
            <View style={styles.logoCircle}>
               <MaterialCommunityIcons name="butterfly-outline" size={40} color="#fff" />
            </View>
            <Text style={styles.welcomeText}>Chào bạn thơ!</Text>
            <Text style={styles.subtitleText}>Đăng nhập để cùng làm đẹp mỗi ngày</Text>
          </Animated.View>

          {/* Form Card */}
          <Animated.View 
            style={[styles.formCard, animatedFormStyle]}
            entering={FadeInDown.delay(400).duration(800)} 
          >
            {/* Input Email */}
            <View style={[styles.inputContainer, emailError ? styles.inputError : null]}>
              <Feather name="mail" size={20} color={emailError ? COLORS.error : COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email của bạn"
                placeholderTextColor="#CCC"
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError('');
                }}
                autoCapitalize="none"
              />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            {/* Input Password */}
            <View style={[styles.inputContainer, { marginTop: 18 }, passwordError ? styles.inputError : null]}>
              <Feather name="lock" size={20} color={passwordError ? COLORS.error : COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                placeholderTextColor="#CCC"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError('');
                }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#DDD" />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            <TouchableOpacity 
              style={styles.forgotBtn} 
              onPress={() => router.push('/forgot-password')} // Chuyển sang trang vừa tạo
            >
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            {/* Button Login */}
            <Animated.View style={[animatedButtonStyle, { marginTop: 30 }]}>
              <Pressable
                onPressIn={() => (scale.value = withSpring(0.96))}
                onPressOut={() => (scale.value = withSpring(1))}
                onPress={handleLogin}
                disabled={loading}
                style={styles.loginButton}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
                )}
              </Pressable>
            </Animated.View>
          </Animated.View>

          {/* Footer */}
          <Animated.View entering={FadeInDown.delay(600)} style={styles.footer}>
            <Text style={styles.footerText}>bạn chưa có tài khoản?</Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.registerLink}> Đăng ký ngay</Text>
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
    position: 'absolute', top: 0, width: width, height: height * 0.45,
    backgroundColor: COLORS.primary, borderBottomLeftRadius: 80, borderBottomRightRadius: 80,
  },
  circleDecor: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: COLORS.secondary, top: -40, right: -40, opacity: 0.4
  },
  scrollContent: { paddingHorizontal: 25, paddingTop: height * 0.08, paddingBottom: 40 },
  headerSection: { alignItems: 'center', marginBottom: 35 },
  logoCircle: {
    width: 90, height: 90, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
  },
  welcomeText: { fontSize: 32, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  subtitleText: { fontSize: 15, color: 'rgba(255,255,255,0.9)', marginTop: 8, fontStyle: 'italic' },
  
  formCard: {
    backgroundColor: COLORS.white, borderRadius: 35, padding: 25,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.15, shadowRadius: 25, elevation: 12,
  },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FBFBFB',
    borderRadius: 15, paddingHorizontal: 15, height: 58, borderWidth: 1, borderColor: '#F2F2F2'
  },
  inputError: { borderColor: COLORS.error, backgroundColor: '#FFF9F9' },
  errorText: { color: COLORS.error, fontSize: 12, marginTop: 5, marginLeft: 5, fontWeight: '500' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: COLORS.textDark, fontWeight: '500' },
  forgotBtn: { alignSelf: 'flex-end', marginTop: 15 },
  forgotText: { color: COLORS.primary, fontWeight: '700', fontSize: 14, textDecorationLine: 'underline' },
  
  loginButton: { 
    backgroundColor: COLORS.primary, 
    height: 60, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 2 },
  
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 35 },
  footerText: { color: COLORS.textLight, fontSize: 15 },
  registerLink: { color: COLORS.primary, fontSize: 15, fontWeight: 'bold', textDecorationLine: 'underline' },
});