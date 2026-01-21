// import { CONFIRM_ORDER_AFTER_PAYMENT, CREATE_VNPAY_PAYMENT } from '@/service/APIService';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { useEffect, useRef, useState } from 'react';
// import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';

// export default function Payment() {
//     const [isSaving, setIsSaving] = useState(false);
//     const router = useRouter();
//     const params = useLocalSearchParams();
//     const hasInitiated = useRef(false); // Chống loop vô tận

//     useEffect(() => {
//         const handlePaymentFlow = async () => {
//             if (hasInitiated.current) return;

//             // 1. Kiểm tra xem có tham số trả về từ Server không
//             const responseCode = params.vnp_ResponseCode;

//             if (responseCode) {
//                 hasInitiated.current = true;
//                 if (responseCode === '00') {
//                     await finalizeOrder();
//                 } else {
//                     // Nếu không phải 00 (ví dụ 24 - hủy), quay về cart luôn
//                     await AsyncStorage.removeItem('temp_order');
//                     router.replace('/mycart');
//                 }
//                 return;
//             }

//             // 2. Nếu không có tham số trả về -> Khởi tạo thanh toán mới
//             if (params.amount && !isSaving) {
//                 hasInitiated.current = true;
//                 await startCheckout();
//             }
//         };

//         handlePaymentFlow();
//     }, [params.vnp_ResponseCode]);

//     const startCheckout = async () => {
//         try {
//             await AsyncStorage.setItem('temp_order', JSON.stringify({
//                 email: params.email,
//                 cartId: params.cartId,
//                 address: params.address,
//                 city: params.city,
//                 shippingFee: params.shippingFee
//             }));

//             const res = await CREATE_VNPAY_PAYMENT(params.amount as string);
//             if (res.url) {
//                 window.location.href = res.url;
//             }
//         } catch (error) {
//             Alert.alert("Lỗi", "Không thể khởi tạo thanh toán.");
//             router.replace('/mycart');
//         }
//     };

//     const finalizeOrder = async () => {
//         try {
//             setIsSaving(true);
//             const savedData = await AsyncStorage.getItem('temp_order');
//             if (savedData) {
//                 const { email, cartId, address, city, shippingFee } = JSON.parse(savedData);
//                 const res = await CONFIRM_ORDER_AFTER_PAYMENT(
//                     email, Number(cartId), address, city, Number(shippingFee)
//                 );
                
//                 await AsyncStorage.removeItem('temp_order');
//                 router.replace({
//                     pathname: '/orderaccepted',
//                     params: { 
//                         orderId: String(res.data.orderId || res.data.id), 
//                         totalAmount: String(res.data.totalAmount || res.data.totalPrice),
//                         cartId: String(cartId)
//                     }
//                 });
//             }
//         } catch (error) {
//             Alert.alert("Lỗi", "Giao dịch khớp nhưng tạo đơn thất bại. Liên hệ shop bạn nhé!");
//             router.replace('/mycart');
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     return (
//         <View style={styles.center}>
//             <ActivityIndicator size="large" color="#EABFBB" />
//             <Text style={styles.text}>
//                 {isSaving ? "Đang xác nhận đơn hàng..." : "Đang xử lý kết quả..."}
//             </Text>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF9F9' },
//     text: { marginTop: 15, color: '#4A4A4A', fontWeight: '600' }
// });

import { CONFIRM_ORDER_AFTER_PAYMENT, CREATE_VNPAY_PAYMENT } from '@/service/APIService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';

export default function Payment() {
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();
    const params = useLocalSearchParams();
    const hasInitiated = useRef(false);

    useEffect(() => {
        const handlePaymentFlow = async () => {
            if (hasInitiated.current) return;

            const responseCode = params.vnp_ResponseCode;

            if (responseCode) {
                hasInitiated.current = true;
                if (responseCode === '00') {
                    // Thanh toán thành công -> Tiến hành chốt đơn và xóa giỏ hàng
                    await finalizeOrder();
                } else {
                    // TRƯỜNG HỢP HỦY: Không xóa 'temp_order' ở đây nếu bạn cần dùng lại dữ liệu
                    // Chỉ cần thông báo và đẩy về lại giỏ hàng
                    Alert.alert("Thông báo", "Giao dịch đã bị hủy. Sản phẩm vẫn còn trong giỏ của bạn nhé! ✨");
                    router.replace('/mycart');
                }
                return;
            }

            if (params.amount && !isSaving) {
                hasInitiated.current = true;
                await startCheckout();
            }
        };

        handlePaymentFlow();
    }, [params.vnp_ResponseCode]);

    const startCheckout = async () => {
        try {
            // Lưu tạm thông tin đơn hàng để đợi VNPay trả về thành công mới xử lý tiếp
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
                
                // Gửi lệnh tạo đơn hàng thực sự lên Server
                const res = await CONFIRM_ORDER_AFTER_PAYMENT(
                    email, Number(cartId), address, city, Number(shippingFee)
                );
                
                // CHỈ XÓA DỮ LIỆU TẠM SAU KHI SERVER BÁO TẠO ĐƠN THÀNH CÔNG
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
            Alert.alert("Lỗi", "Giao dịch khớp nhưng tạo đơn thất bại. Liên hệ shop nhé!");
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