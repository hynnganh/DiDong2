import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import Animated, { FadeInRight, FadeOutLeft, Layout } from 'react-native-reanimated';

// Import từ Service
import {
  CLEAR_CART_API // Nàng hãy đảm bảo hàm này dùng apiClient.delete
  ,
  DELETE_CART_ITEM,
  GET_CART,
  placeOrderApi,
  UPDATE_CART_QUANTITY
} from '../../service/APIService';
import { getCartIdFromToken, getUserInfoFromToken } from '../../service/UserService';

// Import Components
import CheckoutModal from '../components/cart/CheckoutModal';
import ProductCart from '../components/cart/ProductCart';

const COLORS = {
  primary: '#EABFBB',
  secondary: '#F7D7D4',
  textDark: '#4A4A4A',
  textLight: '#A1A1A1',
  bg: '#FFF9F9',
  white: '#FFFFFF'
};

export default function MyCart() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [currentCartId, setCurrentCartId] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOrdering, setIsOrdering] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const calculateTotal = (items: any[]) => {
    const total = items.reduce((sum, i) => sum + (i.specialPrice || i.price) * i.quantity, 0);
    setTotalCost(total);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [userInfo, cid] = await Promise.all([
        getUserInfoFromToken(),
        getCartIdFromToken()
      ]);

      if (userInfo && cid) {
        setUserEmail(userInfo.email);
        setCurrentCartId(cid);
        const data = await GET_CART(userInfo.email, cid);
        const products = data.products || [];
        setCartItems(products);
        calculateTotal(products);
      }
    } catch (error) {
      console.error("Lỗi tải giỏ hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQtyChange = async (productId: number, newQty: number) => {
    if (newQty < 1) return;
    const previousItems = [...cartItems];
    const updatedItems = cartItems.map(item =>
      item.productId === productId ? { ...item, quantity: newQty } : item
    );
    setCartItems(updatedItems);
    calculateTotal(updatedItems);

    try {
      await UPDATE_CART_QUANTITY(currentCartId!, productId, newQty);
    } catch (error) {
      setCartItems(previousItems);
      calculateTotal(previousItems);
      Alert.alert("Lỗi", "Không thể cập nhật số lượng.");
    }
  };

  const handleDeleteItem = async (productId: number) => {
    try {
      await DELETE_CART_ITEM(currentCartId!, productId);
      const updatedItems = cartItems.filter(item => item.productId !== productId);
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (error) {
      Alert.alert("Lỗi", "Xóa sản phẩm thất bại.");
    }
  };

  /* ================= XỬ LÝ ĐẶT HÀNG ================= */
  const handlePlaceOrder = async (info: { 
    address: string, 
    city: string, 
    paymentMethod: string, 
    shippingFee: number 
  }) => {
    if (!userEmail || !currentCartId) return;
    const finalAmount = totalCost + info.shippingFee;

    // 1. LUỒNG ONLINE: CHƯA XÓA GIỎ
    if (info.paymentMethod === 'CARD' || info.paymentMethod === 'VNPAY') {
      setIsModalVisible(false);
      router.push({
        pathname: '/payment',
        params: { 
          email: userEmail,
          cartId: currentCartId,
          address: info.address,
          city: info.city,
          shippingFee: info.shippingFee,
          amount: finalAmount 
        }
      });
      return;
    }

    // 2. LUỒNG TIỀN MẶT: XÓA GIỎ KHI THÀNH CÔNG
    try {
      setIsOrdering(true);
      const response = await placeOrderApi(
        userEmail,
        currentCartId,
        info.paymentMethod,
        info.address,
        info.city,
        info.shippingFee
      );

      if (response.status === 201 || response.status === 200) {
        // A. Xóa trên Server (Dùng apiClient để có Token)
        try {
          await CLEAR_CART_API(userEmail, currentCartId);
        } catch (err) {
          console.log("Server dọn dẹp hơi chậm, nhưng đơn đã tạo xong!");
        }

        // B. Cập nhật UI ngay lập tức
        setCartItems([]);
        setTotalCost(0);
        setIsModalVisible(false);

        // C. Chuyển trang kèm đủ params để OrderAccepted có thể dùng nếu cần
        router.replace({
          pathname: '/orderaccepted',
          params: { 
            orderId: response.data.orderId,
            totalAmount: finalAmount,
            email: userEmail,
            cartId: currentCartId
          }
        });
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Đặt hàng thất bại.";
      Alert.alert("Thông báo", errorMsg);
    } finally {
      setIsOrdering(false);
    }
  };

  const renderItem = ({ item, index }: any) => (
    <Swipeable renderRightActions={() => (
      <TouchableOpacity style={styles.deleteAction} onPress={() => handleDeleteItem(item.productId)}>
        <Feather name="trash-2" size={24} color="#FFF" />
      </TouchableOpacity>
    )}>
      <Animated.View 
        entering={FadeInRight.delay(index * 100)} 
        exiting={FadeOutLeft}
        layout={Layout.springify()}
      >
        <ProductCart
          id={item.productId}
          name={item.productName}
          price={item.specialPrice || item.price}
          quantity={item.quantity}
          imageUri={item.image}
          onQuantityChange={(q) => handleQtyChange(item.productId, q)}
        />
      </Animated.View>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Túi xách của nàng</Text>
            <View style={styles.headerLine} />
          </View>

          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : cartItems.length === 0 ? (
            <View style={styles.centered}>
              <MaterialCommunityIcons name="shopping-outline" size={80} color="#F5F5F5" />
              <Text style={styles.emptyText}>Giỏ hàng đang chờ nàng đó!</Text>
              <TouchableOpacity style={styles.shopBtn} onPress={() => router.replace('/')}>
                <Text style={styles.shopBtnText}>ĐI MUA SẮM NGAY</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.productId.toString()}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
              />
              <View style={styles.footer}>
                <View style={styles.totalBox}>
                  <Text style={styles.totalLabel}>Tổng báu vật</Text>
                  <Text style={styles.totalPrice}>{totalCost.toLocaleString()} đ</Text>
                </View>
                <TouchableOpacity 
                  style={styles.checkoutBtn} 
                  onPress={() => setIsModalVisible(true)}
                >
                  <Text style={styles.checkoutText}>TIẾN HÀNH ĐẶT HÀNG</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        <Modal animationType="slide" transparent visible={isModalVisible}>
          <View style={styles.modalOverlay}>
            <TouchableOpacity style={{flex: 1}} onPress={() => setIsModalVisible(false)} />
            <CheckoutModal
              totalCost={totalCost}
              loading={isOrdering}
              onClose={() => setIsModalVisible(false)}
              onPlaceOrder={handlePlaceOrder}
            />
          </View>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1 },
  header: { padding: 20, alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textDark, letterSpacing: 0.5 },
  headerLine: { width: 40, height: 3, backgroundColor: COLORS.primary, marginTop: 5, borderRadius: 2 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { marginTop: 15, fontSize: 16, color: COLORS.textLight, fontWeight: '500', textAlign: 'center' },
  shopBtn: { 
    marginTop: 25, backgroundColor: COLORS.primary, paddingHorizontal: 40, paddingVertical: 15, borderRadius: 20, elevation: 5
  },
  shopBtnText: { color: '#FFF', fontWeight: '800', letterSpacing: 1 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 160 },
  deleteAction: { 
    backgroundColor: '#FF7675', width: 70, height: '85%', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginLeft: 10, marginTop: 10 
  },
  footer: { 
    position: 'absolute', bottom: 0, width: '100%', padding: 25, backgroundColor: '#FFF', borderTopLeftRadius: 35, borderTopRightRadius: 35, 
    elevation: 25, shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.08, shadowRadius: 15 
  },
  totalBox: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' },
  totalLabel: { fontSize: 15, color: COLORS.textLight, fontWeight: '600' },
  totalPrice: { fontSize: 24, fontWeight: '900', color: COLORS.primary },
  checkoutBtn: { 
    backgroundColor: COLORS.textDark, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 5
  },
  checkoutText: { color: '#FFF', fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }
});