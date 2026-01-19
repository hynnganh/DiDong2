import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Animated, { FadeInDown, FadeInUp, FadeOutDown } from "react-native-reanimated";
import apiClient, { IMAGE_API } from "../service/apiClient";
import { ADD_TO_CART } from "../service/APIService";
import { getCartIdFromToken } from "../service/UserService";

const { width } = Dimensions.get("window");

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [cartId, setCartId] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  /* ================= LOAD DATA (PRODUCT & SIMILAR) ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [cid, res] = await Promise.all([
          getCartIdFromToken(),
          apiClient.get(`/public/products/${id}`)
        ]);
        
        const currentProduct = res.data;
        setCartId(cid);
        setProduct(currentProduct);

        // Lấy sản phẩm tương tự (cùng categoryId)
        if (currentProduct.category?.categoryId) {
          const productsRes = await apiClient.get(`/public/categories/${currentProduct.category.categoryId}/products`);
          // Lọc bỏ sản phẩm hiện tại khỏi danh sách gợi ý
          const filtered = productsRes.data.content.filter((p: any) => p.productId !== currentProduct.productId);
          setSimilarProducts(filtered);
        }
      } catch (error) {
        console.log("Load data error:", error);
      }
    };
    loadData();
  }, [id]);

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#FF8FA3" />
      </View>
    );
  }

  const currentPrice = product.specialPrice ?? product.price ?? 0;

  const handleAddToCart = async () => {
    if (!cartId) {
      Alert.alert("Thông báo", "Vui lòng đăng nhập để thực hiện mua hàng.");
      return;
    }
    try {
      await ADD_TO_CART(cartId, product.productId, quantity);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push("/mycart");
      }, 1500);
    } catch (err: any) {
      Alert.alert("Lỗi", "Không thể thêm sản phẩm vào túi.");
    }
  };

  const renderSimilarItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.similarCard}
      onPress={() => router.push({ pathname: "/productdetail", params: { id: item.productId } })}
    >
      <Image source={{ uri: IMAGE_API + item.image }} style={styles.similarImage} />
      <View style={styles.similarInfo}>
        <Text style={styles.similarName} numberOfLines={1}>{item.productName}</Text>
        <Text style={styles.similarPrice}>{item.specialPrice?.toLocaleString() ?? item.price?.toLocaleString()} đ</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* KHẮC PHỤC THANH THỪA Ở TRÊN */}
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* HEADER NỔI TRÊN ẢNH */}
      <View style={styles.floatHeader}>
        <TouchableOpacity style={styles.iconCircle} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#181725" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconCircle}>
          <Feather name="share-2" size={20} color="#181725" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <Animated.View entering={FadeInUp.duration(600)} style={styles.imageWrapper}>
          <Image source={{ uri: IMAGE_API + product.image }} style={styles.image} />
        </Animated.View>

        <View style={styles.mainContent}>
          <Animated.View entering={FadeInDown.delay(200)}>
            <View style={styles.tagRow}>
              <Text style={styles.brandTag}>PREMIUM BEAUTY</Text>
              <View style={styles.stockTag}><Text style={styles.stockText}>SẴN HÀNG</Text></View>
            </View>

            <View style={styles.nameRow}>
              <Text style={styles.productName}>{product.productName}</Text>
              <TouchableOpacity 
                style={[styles.favBtn, isFavorite && styles.favBtnActive]} 
                onPress={() => setIsFavorite(!isFavorite)}
              >
                <AntDesign name={(isFavorite ? "heart" : "hearto") as any} size={22} color={isFavorite ? "#FFF" : "#FF8FA3"} />
              </TouchableOpacity>
            </View>
            <Text style={styles.unitText}>{product.unitWeight || "Chính hãng • 100% Organic"}</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400)} style={styles.pricingRow}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                <Feather name="minus" size={18} color="#181725" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(q => q + 1)}>
                <Feather name="plus" size={18} color="#181725" />
              </TouchableOpacity>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Tổng thanh toán</Text>
              <Text style={styles.productPrice}>{(currentPrice * quantity).toLocaleString()} đ</Text>
            </View>
          </Animated.View>

          <View style={styles.divider} />

          <Animated.View entering={FadeInDown.delay(600)}>
            <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
            <Text style={styles.description}>{product.description}</Text>

            {/* PHẦN SẢN PHẨM TƯƠNG TỰ */}
            {similarProducts.length > 0 && (
              <View style={styles.similarSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Sản phẩm tương tự</Text>
                </View>
                <FlatList
                  data={similarProducts}
                  renderItem={renderSimilarItem}
                  keyExtractor={(item) => item.productId.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.similarList}
                />
              </View>
            )}
          </Animated.View>
          <View style={{ height: 140 }} />
        </View>
      </ScrollView>

      {/* FOOTER NÚT BẤM */}
      <View style={styles.footer}>
        <View style={styles.footerInner}>
          <TouchableOpacity style={styles.cartBtn} onPress={() => router.push("/mycart")}>
            <Feather name="shopping-bag" size={24} color="#181725" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
            <Text style={styles.addButtonText}>Thêm vào giỏ hàng</Text>
            <Feather name="arrow-right" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* SUCCESS MODAL */}
      {showSuccess && (
  <Animated.View 
    entering={FadeInUp.springify().damping(15)} // Dùng spring cho mượt
    exiting={FadeOutDown.duration(300)} 
    style={styles.successOverlay}
  >
    <Animated.View 
      entering={FadeInDown.delay(100).springify()} 
      style={styles.successCard}
    >
      <View style={styles.checkCircle}>
        <Feather name="check" size={40} color="#FFF" />
      </View>
      <Text style={styles.successTitle}>Thành công!</Text>
      <Text style={styles.successSub}>Sản phẩm đã nằm gọn trong túi của bạn rồi nhé! ✨</Text>
      
      {/* Thêm nút đóng nhanh nếu bạn muốn */}
      <TouchableOpacity 
        style={styles.closeMiniBtn} 
        onPress={() => setShowSuccess(false)}
      >
        <Text style={styles.closeText}>Đóng</Text>
      </TouchableOpacity>
    </Animated.View>
  </Animated.View>
)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  floatHeader: { position: 'absolute', top: 50, left: 0, right: 0, zIndex: 10, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  iconCircle: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: 'rgba(255,255,255,0.95)', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  imageWrapper: { width: width, height: 460 },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  mainContent: { marginTop: -40, backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 25, elevation: 15 },
  tagRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  brandTag: { fontSize: 12, fontWeight: '800', color: '#FF8FA3', letterSpacing: 1.5 },
  stockTag: { backgroundColor: '#EFFFF4', padding: 6, borderRadius: 10 },
  stockText: { color: '#00B050', fontSize: 10, fontWeight: '800' },
  nameRow: { flexDirection: "row", justifyContent: "space-between" },
  productName: { fontSize: 24, fontWeight: "900", color: "#181725", flex: 1 },
  favBtn: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' },
  favBtnActive: { backgroundColor: '#FF8FA3', borderColor: '#FF8FA3' },
  unitText: { color: "#A0A0A0", marginBottom: 30 },
  pricingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quantityContainer: { flexDirection: 'row', backgroundColor: '#F8F8F8', borderRadius: 20, padding: 5 },
  qtyBtn: { width: 40, height: 40, backgroundColor: '#FFF', borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  qtyText: { fontSize: 18, fontWeight: '800', marginHorizontal: 15 },
  priceContainer: { alignItems: 'flex-end' },
  priceLabel: { fontSize: 12, color: '#A0A0A0' },
  productPrice: { fontSize: 24, fontWeight: "900", color: "#FF8FA3" },
  divider: { height: 1.5, backgroundColor: "#F5F5F5", marginVertical: 25 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: '#181725', marginBottom: 15 },
  description: { color: "#666", lineHeight: 24, marginBottom: 20 },
  
  /* Similar Products Styles */
  similarSection: { marginTop: 10 },
  sectionHeader: { marginBottom: 15 },
  similarList: { paddingRight: 20 },
  similarCard: { width: 140, marginRight: 15, backgroundColor: '#FFF', borderRadius: 20, padding: 8, borderWidth: 1, borderColor: '#F5F5F5' },
  similarImage: { width: '100%', height: 130, borderRadius: 15, marginBottom: 10 },
  similarInfo: { paddingHorizontal: 4 },
  similarName: { fontSize: 13, fontWeight: '700', color: '#181725' },
  similarPrice: { fontSize: 13, fontWeight: '800', color: '#FF8FA3', marginTop: 2 },

  footer: { position: "absolute", bottom: 0, left: 0, right: 0 },
  footerInner: { backgroundColor: "#FFF", padding: 25, paddingBottom: Platform.OS === "ios" ? 40 : 25, flexDirection: 'row', borderTopLeftRadius: 35, borderTopRightRadius: 35, elevation: 25 },
  cartBtn: { width: 60, height: 60, borderRadius: 20, borderWidth: 1.5, borderColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  addButton: { flex: 1, height: 60, backgroundColor: "#181725", borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  addButtonText: { color: "#FFF", fontSize: 16, fontWeight: "800", marginRight: 10 },
  
  successOverlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(0, 0, 0, 0.4)', // Làm tối nền một chút cho sang
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
},
successCard: {
  width: width * 0.8,
  backgroundColor: '#FFF',
  borderRadius: 30,
  padding: 30,
  alignItems: 'center',
  // Đổ bóng chuẩn Luxury
  shadowColor: "#FF8FA3",
  shadowOffset: { width: 0, height: 15 },
  shadowOpacity: 0.3,
  shadowRadius: 20,
  elevation: 10,
},
checkCircle: {
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: '#FF8FA3',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 20,
},
successTitle: {
  fontSize: 22,
  fontWeight: '900',
  color: '#181725',
  marginBottom: 10
},
successSub: {
  color: '#7C7C7C',
  textAlign: 'center',
  lineHeight: 20
},
closeMiniBtn: {
  marginTop: 20,
  paddingVertical: 8,
  paddingHorizontal: 20,
},
closeText: {
  color: '#FF8FA3',
  fontWeight: '700'
}
});