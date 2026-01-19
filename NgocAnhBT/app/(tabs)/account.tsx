import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { getUserInfoFromToken } from "../../service/UserService";

const AVATAR_DEFAULT = require("../../assets/images/avt.jpg");

export default function Account() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const userInfo = await getUserInfoFromToken();
    setUser(userInfo);
    setLoading(false);
  };

  const menuItems = [
    { title: "Đơn hàng của tôi", icon: "bag-outline", path: "/my-orders" },
    { title: "Thông tin cá nhân", icon: "person-outline", path: "/profile-details" },
    { title: "Địa chỉ giao hàng", icon: "location-outline", path: "/addresses" },
    { title: "Phương thức thanh toán", icon: "card-outline", path: "/payment-methods" },
    { title: "Mã giảm giá", icon: "pricetag-outline", path: "/promos" },
    { title: "Thông báo", icon: "notifications-outline", path: "/notifications" },
    { title: "Trợ giúp & Hỗ trợ", icon: "help-circle-outline", path: "/help" },
  ];

  if (loading) return (
    <View style={styles.loadingContainer}><ActivityIndicator color="#FFB7B2" /></View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}><Text style={styles.headerTitle}>Tài khoản</Text></View>

        {/* Profile Card */}
        <TouchableOpacity 
          style={styles.profileSection}
          onPress={() => router.push("/profile-details")}
        >
          <Image source={AVATAR_DEFAULT} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.firstName} {user?.lastName || "bạn thơ"}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
          <AntDesign name="right" size={16} color="#A88B8B" />
        </TouchableOpacity>

        {/* Menu List */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={styles.menuItem}
              onPress={() => item.path ? router.push(item.path as any) : Alert.alert("Coming Soon")}
            >
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon as any} size={22} color="#A88B8B" />
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <AntDesign name="right" size={14} color="#D1D1D1" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace("/login")}>
          <Ionicons name="log-out-outline" size={20} color="#FFB7B2" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFF" },
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center" },
  header: { padding: 25 },
  headerTitle: { fontSize: 24, fontWeight: "300", color: "#1A1A1A" },
  profileSection: {
    flexDirection: "row", alignItems: "center", padding: 20,
    backgroundColor: "#FFF9F9", marginHorizontal: 20, borderRadius: 20,
  },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  userInfo: { flex: 1, marginLeft: 15 },
  userName: { fontSize: 18, fontWeight: "600", color: "#4A4A4A" },
  userEmail: { fontSize: 12, color: "#A88B8B" },
  menuContainer: { marginTop: 20, paddingHorizontal: 25 },
  menuItem: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: "#F8F8F8",
  },
  menuLeft: { flexDirection: "row", alignItems: "center" },
  menuTitle: { fontSize: 15, color: "#555", marginLeft: 15 },
  logoutButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    marginTop: 40, marginHorizontal: 40, height: 50, borderRadius: 25,
    borderWidth: 1, borderColor: "#FFB7B2",
  },
  logoutText: { fontSize: 15, fontWeight: "600", color: "#FFB7B2", marginLeft: 10 },
});