import { CLEAR_CART_API } from '@/service/APIService';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { BackHandler, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    FadeIn,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

export default function OrderAcceptedScreen() {
    const router = useRouter();
    // Nhận params từ màn hình Checkout/Payment
    const { orderId, totalAmount, cartId, email } = useLocalSearchParams(); 

    const scale = useSharedValue(1);

    useEffect(() => {
        let isMounted = true;

        // 1. Logic dọn dẹp giỏ hàng
        const handleClearCart = async () => {
            if (cartId && email) {
                console.log(`🚀 Bắt đầu xóa giỏ hàng: ID ${cartId}, Email: ${email}`);
                try {
                    const response = await CLEAR_CART_API(String(email), Number(cartId));
                    if (isMounted) {
                        console.log("=== ĐÃ CHẠY QUA LỆNH XÓA ===");
                        console.log("Kết quả từ Server:", response);
                    }
                } catch (error) {
                    console.error("❌ Lỗi xóa giỏ hàng:", error);
                }
            } else {
                console.warn("⚠️ Thiếu cartId hoặc email trong params, không thể xóa giỏ hàng!");
            }
        };

        handleClearCart();

        // 2. Kích hoạt hiệu ứng nhịp đập cho icon
        scale.value = withRepeat(
            withSequence(
                withTiming(1.15, { duration: 1000 }), 
                withTiming(1, { duration: 1000 })
            ), 
            -1, 
            true
        );

        // 3. Chặn nút Back vật lý trên Android
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            router.replace('/(tabs)'); // Đẩy về trang chủ thay vì quay lại trang thanh toán
            return true;
        });

        return () => {
            isMounted = false;
            backHandler.remove();
        };
    }, [cartId, email]); // Chạy lại nếu params thay đổi

    // Style động cho icon check
    const iconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.contentWrapper}>
                    {/* Icon Success với hiệu ứng Reanimated */}
                    <Animated.View entering={FadeIn.duration(800)} style={[styles.iconContainer, iconStyle]}>
                        <View style={styles.mainCircle}>
                            <MaterialCommunityIcons name="check-all" size={60} color="white" />
                        </View>
                    </Animated.View>

                    <Animated.Text entering={FadeInUp.delay(300)} style={styles.mainTitle}>
                        Đặt hàng thành công!
                    </Animated.Text>

                    {/* Hộp thông tin đơn hàng */}
                    <Animated.View entering={FadeInUp.delay(500)} style={styles.infoBox}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Mã đơn hàng:</Text>
                            <Text style={styles.highlight}>#ORD-{orderId || "N/A"}</Text>
                        </View>
                        {totalAmount && (
                            <View style={[styles.infoRow, { marginTop: 15 }]}>
                                <Text style={styles.infoLabel}>Tổng thanh toán:</Text>
                                <Text style={styles.highlight}>
                                    {Number(totalAmount).toLocaleString('vi-VN')} đ
                                </Text>
                            </View>
                        )}
                    </Animated.View>

                    <Animated.Text entering={FadeInUp.delay(700)} style={styles.description}>
                        Báu vật của nàng đang được chuẩn bị và sẽ sớm được giao tới tận tay. Đừng quên theo dõi trạng thái đơn hàng nhé! 🌸
                    </Animated.Text>
                </View>

                {/* Các nút điều hướng */}
                <Animated.View entering={FadeInUp.delay(900)} style={styles.footer}>
                    <TouchableOpacity 
                        style={styles.primaryBtn} 
                        onPress={() => router.replace('/(tabs)')}
                    >
                        <Text style={styles.primaryBtnText}>TIẾP TỤC MUA SẮM</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.secondaryBtn}
                        onPress={() => router.push('/my-orders')} 
                    >
                        <Text style={styles.secondaryBtnText}>XEM ĐƠN HÀNG CỦA TÔI</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFF9F9' },
    container: { flex: 1, paddingHorizontal: 30 },
    contentWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    iconContainer: { marginBottom: 20 },
    mainCircle: { 
        width: 110, height: 110, borderRadius: 55, 
        backgroundColor: '#EABFBB', justifyContent: 'center', 
        alignItems: 'center', elevation: 10,
        shadowColor: '#EABFBB', shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3, shadowRadius: 10,
    },
    mainTitle: { 
        fontSize: 26, fontWeight: '900', color: '#4A4A4A', 
        marginBottom: 25, textAlign: 'center' 
    },
    infoBox: { 
        backgroundColor: 'white', padding: 25, borderRadius: 25, 
        width: '100%', borderWidth: 1, borderColor: '#F2F2F2',
        elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 5,
    },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    infoLabel: { fontSize: 14, color: '#A1A1A1', fontWeight: '600' },
    highlight: { color: '#4A4A4A', fontWeight: '800', fontSize: 16 },
    description: { 
        textAlign: 'center', color: '#A1A1A1', marginTop: 30, 
        lineHeight: 22, paddingHorizontal: 10
    },
    footer: { paddingBottom: 40, width: '100%' },
    primaryBtn: { 
        backgroundColor: '#EABFBB', height: 60, borderRadius: 20, 
        justifyContent: 'center', alignItems: 'center', marginBottom: 15,
        elevation: 4, shadowColor: '#EABFBB', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 5,
    },
    primaryBtnText: { color: 'white', fontWeight: '800', letterSpacing: 1 },
    secondaryBtn: { height: 50, justifyContent: 'center', alignItems: 'center' },
    secondaryBtnText: { color: '#A1A1A1', fontWeight: '700', textDecorationLine: 'underline' },
});