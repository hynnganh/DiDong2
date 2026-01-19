import { Feather, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { GET_PRODUCTS_BY_CATEGORY } from '../service/APIService';
import { IMAGE_API } from '../service/apiClient';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 44) / 2; // Tính toán để card khít hơn

export default function ProductCategory() {
  const router = useRouter();
  const { categoryId, categoryName } = useLocalSearchParams();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await GET_PRODUCTS_BY_CATEGORY(Number(categoryId));
      setProducts(data.content);
    } catch (err) {
      console.log('Load products error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }: any) => (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
      <TouchableOpacity
        style={styles.productCard}
        activeOpacity={0.9}
        onPress={() =>
          router.push({
            pathname: '/productdetail',
            params: { id: item.productId },
          })
        }
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: IMAGE_API + item.image }}
            style={styles.productImage}
          />
          <TouchableOpacity style={styles.wishlistBtn}>
            <Ionicons name="heart-outline" size={18} color="#FF8FA3" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.productName}
          </Text>
          <Text style={styles.productBrand}>Beauty Glow Official</Text>
          
          <View style={styles.productBottom}>
            <Text style={styles.productPrice}>
               {new Intl.NumberFormat('vi-VN').format(item.price)}
               <Text style={styles.currency}>đ</Text>
            </Text>

            <TouchableOpacity style={styles.addButton}>
              <Feather name="plus" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="small" color="#FF8FA3" />
        <Text style={styles.loadingText}>Đang tìm sản phẩm ưng ý...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* --- HEADER SANG CHẢNH --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color="#181725" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{categoryName}</Text>
            <Text style={styles.headerSub}>{products.length} sản phẩm</Text>
        </View>

        <TouchableOpacity style={styles.filterBtn} onPress={() => router.push('/filterproduct')}>
          <Feather name="sliders" size={20} color="#181725" />
        </TouchableOpacity>
      </View>

      {/* --- DANH SÁCH --- */}
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.productId.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Feather name="package" size={50} color="#EEE" />
                <Text style={styles.emptyText}>Chưa có sản phẩm nào ở mục này</Text>
            </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCFCFC' },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    padding: 20,
    backgroundColor: '#fff',
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitleContainer: { alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#181725' },
  headerSub: { fontSize: 12, color: '#A0A0A0', fontWeight: '500' },
  filterBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end' },

  /* List */
  listContent: { paddingHorizontal: 16, paddingVertical: 20 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 16 },

  /* Product Card */
  productCard: {
    width: COLUMN_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    // Đổ bóng kiểu hiện đại
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F8F8F8'
  },
  imageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#FFF9FA',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  productImage: { width: '80%', height: '80%', resizeMode: 'contain' },
  wishlistBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: { padding: 12 },
  productName: { fontSize: 14, fontWeight: '700', color: '#181725', marginBottom: 2 },
  productBrand: { fontSize: 11, color: '#A0A0A0', marginBottom: 10 },
  productBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 16, fontWeight: '800', color: '#FF8FA3' },
  currency: { fontSize: 12 },
  addButton: {
    backgroundColor: '#181725',
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loadingText: { marginTop: 10, color: '#A0A0A0', fontSize: 13 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 10, color: '#A0A0A0' }
});