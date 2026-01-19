import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GET_ORDER_DETAILS } from "../service/APIService";
import { getUserInfoFromToken } from "../service/UserService";
import { IMAGE_API } from "../service/apiClient";

const COLORS = {
  primary: '#EABFBB',    // Hồng Nude chủ đạo
  secondary: '#F7D7D4',
  text: '#4A4A4A',
  subText: '#A1A1A1',
  border: '#F2F2F2',
  bg: '#FFF9F9',
  white: '#FFFFFF',
  success: '#53B175'
};

export default function OrderDetails() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      const userInfo = await getUserInfoFromToken();
      if (userInfo?.email && orderId) {
        const data = await GET_ORDER_DETAILS(userInfo.email, orderId as string);
        setOrder(data);
      }
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFinancials = () => {
    if (!order || !order.orderItems) return { subTotal: 0, shippingFee: 0 };
    const subTotal = order.orderItems.reduce((sum: number, item: any) => {
      const price = item.orderedPrice || item.product?.specialPrice || item.product?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
    const shippingFee = order.totalAmount - subTotal;
    return { subTotal, shippingFee: shippingFee > 0 ? shippingFee : 0 };
  };

  const { subTotal, shippingFee } = getFinancials();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* Trạng thái đơn hàng */}
        <View style={styles.statusSection}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="package-variant-closed" size={35} color={COLORS.primary} />
          </View>
          <Text style={styles.orderIdText}>Mã đơn: #ORD-{order?.orderId}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{order?.orderStatus || 'ĐÃ TIẾP NHẬN'}</Text>
          </View>
          <Text style={styles.dateText}>
            Ngày đặt: {order?.orderDate ? new Date(order.orderDate).toLocaleDateString('vi-VN') : '18/01/2026'}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* ✅ KHỐI ĐỊA CHỈ GỘP (Sửa lại trường shippingAddress) */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="location-sharp" size={18} color={COLORS.primary} />
            <Text style={styles.infoLabel}>THÔNG TIN GIAO HÀNG</Text>
          </View>
          <View style={styles.addressBox}>
            <Text style={styles.customerName}>Người nhận: {order?.email?.split('@')[0]}</Text>
            <Text style={styles.addressText}>
              {/* Lấy trực tiếp từ shippingAddress của order */}
              {order?.shippingAddress || "Chưa cập nhật địa chỉ chi tiết"}
              {"\n"}
            </Text>
          </View>
        </View>

        {/* Danh sách sản phẩm */}
        <Text style={styles.sectionTitle}>SẢN PHẨM TRONG ĐƠN</Text>
        {order?.orderItems?.map((item: any, index: number) => (
          <View key={index} style={styles.productCard}>
            <Image 
              source={{ uri: `${IMAGE_API}${item.product?.image}` }} 
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>{item.product?.productName}</Text>
              <Text style={styles.productCategory}>{item.product?.category?.categoryName || 'Mỹ phẩm'}</Text>
              <View style={styles.qtyPriceRow}>
                <Text style={styles.productQty}>x{item.quantity}</Text>
                <Text style={styles.productPrice}>
                  {Number(item.orderedPrice || item.product?.specialPrice || item.product?.price || 0).toLocaleString('vi-VN')} đ
                </Text>             
              </View>
            </View>
          </View>
        ))}

        {/* Tổng kết thanh toán */}
        <View style={styles.paymentCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.paymentLabel}>Tạm tính</Text>
            <Text style={styles.paymentValue}>{subTotal.toLocaleString()} đ</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.paymentLabel}>Phí vận chuyển</Text>
            <Text style={[styles.paymentValue, shippingFee === 0 && { color: COLORS.success }]}>
              {shippingFee === 0 ? "Miễn phí" : `+${shippingFee.toLocaleString()} đ`}
            </Text>
          </View>
          
          <View style={styles.dashedLine} />

          <View style={[styles.rowBetween, { marginTop: 10 }]}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>{order?.totalAmount?.toLocaleString()} đ</Text>
          </View>
          <View style={styles.methodTag}>
            <Text style={styles.paymentMethod}>
              Thanh toán: {order?.payment?.paymentMethod || 'Tiền mặt (COD)'}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.reorderBtn}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.reorderText}>TIẾP TỤC MUA SẮM</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, height: 60 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  content: { paddingHorizontal: 20 },
  statusSection: { alignItems: 'center', marginTop: 10 },
  iconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center' },
  orderIdText: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginTop: 12 },
  statusBadge: { backgroundColor: COLORS.primary, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, marginTop: 8 },
  statusText: { color: '#FFF', fontWeight: '800', fontSize: 11 },
  dateText: { color: COLORS.subText, fontSize: 13, marginTop: 10 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: COLORS.text, marginBottom: 15, marginTop: 10 },
  
  // Product Card
  productCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 18, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  productImage: { width: 65, height: 65, borderRadius: 12, backgroundColor: COLORS.bg },
  productInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  productName: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  productCategory: { fontSize: 12, color: COLORS.subText },
  qtyPriceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  productQty: { fontSize: 13, color: COLORS.text, fontWeight: '600' },
  productPrice: { fontSize: 15, fontWeight: '700', color: COLORS.primary },
  
  // Info Card (Gộp)
  infoCard: { backgroundColor: COLORS.bg, borderRadius: 20, padding: 20, marginBottom: 20 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoLabel: { marginLeft: 10, fontWeight: '800', color: COLORS.text, fontSize: 12, letterSpacing: 0.5 },
  addressBox: { paddingLeft: 28 },
  customerName: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  addressText: { color: COLORS.text, fontSize: 14, lineHeight: 22, opacity: 0.8 },
  
  // Payment Card
  paymentCard: { marginTop: 10, padding: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  paymentLabel: { color: COLORS.subText, fontSize: 14 },
  paymentValue: { color: COLORS.text, fontWeight: '600' },
  dashedLine: { height: 1, borderBottomWidth: 1, borderColor: COLORS.border, borderStyle: 'dashed', marginVertical: 10 },
  totalLabel: { fontSize: 17, fontWeight: '800', color: COLORS.text },
  totalValue: { fontSize: 24, fontWeight: '900', color: COLORS.primary },
  methodTag: { alignItems: 'flex-end', marginTop: 5 },
  paymentMethod: { fontSize: 12, color: COLORS.subText, backgroundColor: '#F0F0F0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  
  reorderBtn: { backgroundColor: COLORS.primary, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 20, elevation: 3 },
  reorderText: { color: '#FFF', fontWeight: '800', fontSize: 15, letterSpacing: 1 }
});