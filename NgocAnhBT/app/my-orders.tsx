import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { GET_USER_ORDERS } from "../service/APIService";
import { getUserInfoFromToken } from "../service/UserService";

export default function MyOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const userInfo = await getUserInfoFromToken();
      if (userInfo?.email) {
        const data = await GET_USER_ORDERS(userInfo.email);
        // Tùy vào cấu trúc Backend trả về (có thể là data hoặc data.content)
        setOrders(Array.isArray(data) ? data : data.content || []);
      }
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderIdGroup}>
          <Text style={styles.orderLabel}>Mã đơn hàng</Text>
          <Text style={styles.orderId}>#ORD-{item.orderId}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.orderStatus === 'Delivered' ? '#EFFFF4' : '#FFF9F9' }]}>
          <Text style={[styles.statusText, { color: item.orderStatus === 'Delivered' ? '#53B175' : '#FFB7B2' }]}>
            {item.orderStatus === 'Delivered' ? 'Đã giao' : 'Đang xử lý'}
          </Text>
        </View>
      </View>

      <View style={styles.orderBody}>
        <Text style={styles.dateText}>Ngày đặt: {new Date(item.orderDate).toLocaleDateString('vi-VN')}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
          <Text style={styles.totalPrice}>{item.totalAmount?.toLocaleString()} đ</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.detailBtn}
        onPress={() => router.push(`/order-details?orderId=${item.orderId}`)}
      >
        <Text style={styles.detailBtnText}>Xem chi tiết sản phẩm</Text>
        <Ionicons name="chevron-forward" size={16} color="#A88B8B" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header tinh tế */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đơn hàng của bạn</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="small" color="#FFB7B2" />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.centered}>
          <MaterialCommunityIcons name="bag-personal-outline" size={80} color="#F5F5F5" />
          <Text style={styles.emptyText}>bạn chưa có đơn hàng nào tại shop</Text>
          <TouchableOpacity style={styles.shopNowBtn} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.shopNowText}>Mua sắm ngay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.orderId.toString()}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    height: 60,
  },
  backBtn: { width: 40, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#1A1A1A", fontFamily: 'serif' },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContent: { padding: 20 },
  
  orderCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F5F5F5",
    // Tạo bóng nhẹ sang trọng
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  orderIdGroup: { flex: 1 },
  orderLabel: { fontSize: 12, color: "#AAA", textTransform: 'uppercase', letterSpacing: 1 },
  orderId: { fontSize: 15, fontWeight: "700", color: "#4A4A4A", marginTop: 2 },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: { fontSize: 12, fontWeight: "600" },
  
  orderBody: {
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    paddingBottom: 15,
    marginBottom: 15,
  },
  dateText: { fontSize: 13, color: "#8E8E8E", marginBottom: 10 },
  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { fontSize: 14, color: "#4A4A4A" },
  totalPrice: { fontSize: 18, fontWeight: "800", color: "#FFB7B2" },
  
  detailBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailBtnText: { fontSize: 14, color: "#A88B8B", fontWeight: "500" },
  
  emptyText: { marginTop: 20, fontSize: 15, color: "#A88B8B", fontStyle: 'italic' },
  shopNowBtn: {
    marginTop: 25,
    backgroundColor: "#FFB7B2",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  shopNowText: { color: "#FFF", fontWeight: "600" }
});