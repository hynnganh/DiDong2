import { useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { height } = Dimensions.get('window');

// Giả định ảnh nhân viên giao hàng nằm ở đây
const BACKGROUND_IMAGE = require('../assets/images/ngocanh.png'); 
// Giả định logo trắng nằm ở đây
const CARROT_WHITE_ICON = require('../assets/images/logo.png'); 

export default function orboarding() {
    const router = useRouter();
    
    // Hàm xử lý khi nhấn nút
    const handleGetStarted = () => {
        // Chuyển sang màn hình tiếp theo (ví dụ: màn hình đăng nhập/trang chủ)
        console.log("Navigating to next screen...");
        router.push('/login'); 
    };

    return (
        <ImageBackground 
            source={BACKGROUND_IMAGE} 
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                {/* 1. Logo Trắng */}
                <Image 
                    source={CARROT_WHITE_ICON}
                    style={styles.whiteCarrot}
                />

                {/* 2. Nội dung text */}
                <Text style={styles.title}>Welcome to our store</Text>
                <Text style={styles.subtitle}>Ger your groceries in as fast as one hour</Text>
                
                {/* 3. Nút bấm */}
                <TouchableOpacity 
                    style={styles.button}
                    onPress={handleGetStarted}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    // View chứa nội dung text, căn chỉnh ở dưới cùng
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: height * 0.1, // Đẩy nội dung lên trên một chút
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Thêm lớp phủ mờ nhẹ
    },
    whiteCarrot: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#DEDEDE', // Màu trắng hơi xám
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#53B175', // Màu xanh lá cây của Nectar
        width: '90%',
        height: 60,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
    },
});