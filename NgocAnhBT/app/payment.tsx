import { CONFIRM_ORDER_AFTER_PAYMENT, CREATE_VNPAY_PAYMENT } from '@/service/APIService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';

export default function Payment() {
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();
    const params = useLocalSearchParams();
    const hasInitiated = useRef(false); // Chống loop vô tận

    useEffect(() => {
        const handlePaymentFlow = async () => {
            if (hasInitiated.current) return;

            // 1. Kiểm tra xem có tham số trả về từ Server không
            const responseCode = params.vnp_ResponseCode;

            if (responseCode) {
                hasInitiated.current = true;
                if (responseCode === '00') {
                    await finalizeOrder();
                } else {
                    // Nếu không phải 00 (ví dụ 24 - hủy), quay về cart luôn
                    await AsyncStorage.removeItem('temp_order');
                    router.replace('/mycart');
                }
                return;
            }

            // 2. Nếu không có tham số trả về -> Khởi tạo thanh toán mới
            if (params.amount && !isSaving) {
                hasInitiated.current = true;
                await startCheckout();
            }
        };

        handlePaymentFlow();
    }, [params.vnp_ResponseCode]);

    const startCheckout = async () => {
        try {
            await AsyncStorage.setItem('temp_order', JSON.stringify({
                email: params.email,
                cartId: params.cartId,
                address: params.address,
                city: params.city,
                shippingFee: params.shippingFee
            }));

            const res = await CREATE_VNPAY_PAYMENT(params.amount as string);
            if (res.url) {
                window.location.href = res.url;
            }
        } catch (error) {
            Alert.alert("Lỗi", "Không thể khởi tạo thanh toán.");
            router.replace('/mycart');
        }
    };

    const finalizeOrder = async () => {
        try {
            setIsSaving(true);
            const savedData = await AsyncStorage.getItem('temp_order');
            if (savedData) {
                const { email, cartId, address, city, shippingFee } = JSON.parse(savedData);
                const res = await CONFIRM_ORDER_AFTER_PAYMENT(
                    email, Number(cartId), address, city, Number(shippingFee)
                );
                
                await AsyncStorage.removeItem('temp_order');
                router.replace({
                    pathname: '/orderaccepted',
                    params: { 
                        orderId: String(res.data.orderId || res.data.id), 
                        totalAmount: String(res.data.totalAmount || res.data.totalPrice),
                        cartId: String(cartId)
                    }
                });
            }
        } catch (error) {
            Alert.alert("Lỗi", "Giao dịch khớp nhưng tạo đơn thất bại. Liên hệ shop nàng nhé!");
            router.replace('/mycart');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View style={styles.center}>
            <ActivityIndicator size="large" color="#EABFBB" />
            <Text style={styles.text}>
                {isSaving ? "Đang xác nhận đơn hàng..." : "Đang xử lý kết quả..."}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF9F9' },
    text: { marginTop: 15, color: '#4A4A4A', fontWeight: '600' }
});