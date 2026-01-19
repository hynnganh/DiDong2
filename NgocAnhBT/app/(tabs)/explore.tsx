import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  Layout,
  createAnimatedComponent
} from 'react-native-reanimated';

// Import Service - Đảm bảo đường dẫn này đúng với cấu trúc dự án của bạn
import { GET_CATEGORIES, GET_PRODUCTS_BY_KEYWORD } from '../../service/APIService';
import ProductHome from '../components/home/ProductHome';

const { width } = Dimensions.get('window');
const AnimatedTouchableOpacity = createAnimatedComponent(TouchableOpacity);

export default function Explore() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. Khởi tạo danh mục
  useEffect(() => { 
    loadCategories(); 
  }, []);

  // 2. Xử lý tìm kiếm với Debounce để mượt mà
  useEffect(() => {
    const delay = setTimeout(() => {
      if (keyword.trim().length >= 2) {
        handleSearchApi(keyword);
      } else {
        setProducts([]);
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [keyword]);

  async function loadCategories() {
    try {
      const res = await GET_CATEGORIES(0, 50);
      const colors = ['#FFF0F3', '#F0F4FF', '#FFF9E5', '#F2FFF2', '#F9F2FF', '#F0FBFF'];
      const enriched = res.data.content.map((item: any, index: number) => ({
        ...item,
        bgColor: colors[index % colors.length]
      }));
      setCategories(enriched);
    } catch (e) {
      console.log("Error loading categories:", e);
    }
  }

  // 3. Gọi API theo keyword
  async function handleSearchApi(text: string) {
    try {
      setLoading(true);
      setSearching(true);
      const data = await GET_PRODUCTS_BY_KEYWORD(text, 0, 20, 0);
      
      // Kiểm tra cấu trúc data trả về từ API của bạn
      const resultList = data.content || data || [];
      setProducts(resultList);
    } catch (e) {
      console.log("Error searching products:", e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* --- 1. HEADER --- */}
      <View style={styles.header}>
        <Animated.Text entering={FadeInUp.delay(100)} style={styles.welcomeText}>
          Khám phá vẻ đẹp ✨
        </Animated.Text>
        <Animated.Text entering={FadeInUp.delay(200)} style={styles.mainTitle}>
          Dành cho bạn
        </Animated.Text>
      </View>

      {/* --- 2. SEARCH BOX (FIXED NO BLACK OUTLINE) --- */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchInner}>
          <Feather name="search" size={20} color="#FF8FA3" />
          <TextInput
            value={keyword}
            onChangeText={setKeyword}
            placeholder="Bạn cần tìm mỹ phẩm gì?"
            style={styles.input}
            placeholderTextColor="#A0A0A0"
            selectionColor="#FF8FA3" // Màu con trỏ hồng cực xinh
            underlineColorAndroid="transparent" // Xóa gạch chân mặc định Android
          />
          {keyword.length > 0 && (
            <TouchableOpacity 
              activeOpacity={0.6}
              style={styles.clearBtn}
              onPress={() => {setKeyword(''); setSearching(false); Keyboard.dismiss();}}
            >
              <Feather name="x" size={12} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.filterBtn} 
          activeOpacity={0.8}
          //onPress={() => router.push('/filterproduct')}
        >
          <Feather name="sliders" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* --- 3. CONTENT --- */}
      <View style={{ flex: 1 }}>
        {searching ? (
          <View style={{ flex: 1 }}>
            {loading ? (
              <View style={styles.centerBox}>
                <ActivityIndicator color="#FF8FA3" size="large" />
                <Text style={styles.loadingText}>Đang tìm kiếm...</Text>
              </View>
            ) : products.length > 0 ? (
              <Animated.View entering={FadeInDown} layout={Layout.springify()} style={{ flex: 1 }}>
                <ProductHome title={`Kết quả cho "${keyword}"`} products={products} />
              </Animated.View>
            ) : (
              <Animated.View entering={FadeInUp} style={styles.emptyContainer}>
                <View style={styles.emptyIconCircle}>
                    <Feather name="search" size={40} color="#E0E0E0" />
                </View>
                <Text style={styles.emptyText}>Không tìm thấy kết quả</Text>
                <Text style={styles.emptySub}>Thử tìm kiếm với từ khóa khác nhé!</Text>
              </Animated.View>
            )}
          </View>
        ) : (
          <FlatList
            data={categories}
            keyExtractor={(item) => item.categoryId.toString()}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.columnWrapper}
            ListHeaderComponent={<Text style={styles.sectionLabel}>Danh mục nổi bật</Text>}
            renderItem={({ item, index }) => (
              <AnimatedTouchableOpacity 
                entering={FadeInDown.delay(index * 60).springify()}
                style={[styles.catCard, { backgroundColor: item.bgColor }]}
                activeOpacity={0.8}
                onPress={() => router.push({
                    pathname: "/productcategory",
                    params: { categoryId: item.categoryId, name: item.categoryName },
                })}
              >
                <View style={styles.catContent}>
                  <Text style={styles.catName}>{item.categoryName}</Text>
                  <View style={styles.iconCircle}>
                    <Feather name="chevron-right" size={16} color="#181725" />
                  </View>
                </View>
                <Feather 
                  name="heart" 
                  size={70} 
                  color="rgba(255,143,163,0.06)" 
                  style={styles.bgDecoration} 
                />
              </AnimatedTouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCFCFC' },
  header: { paddingTop:20, paddingHorizontal: 25, marginBottom: 20 },
  welcomeText: { fontSize: 13, color: '#FF8FA3', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.5 },
  mainTitle: { fontSize: 32, fontWeight: '900', color: '#181725', marginTop: 5 },
  
  searchWrapper: { flexDirection: 'row', paddingHorizontal: 25, marginBottom: 25, alignItems: 'center' },
  searchInner: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    height: 56, 
    borderRadius: 22, 
    paddingHorizontal: 16,
    // Đổ bóng (Shadow)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    // Viền nhẹ tinh tế
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  input: { 
    flex: 1, 
    marginLeft: 12, 
    fontSize: 15, 
    color: '#181725', 
    fontWeight: '600',
    // Quan trọng: Xóa khung đen trên môi trường Web
    outlineStyle: 'none', 
  } as any, 
  
  clearBtn: { backgroundColor: '#BBB', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  filterBtn: { 
    width: 56, 
    height: 56, 
    backgroundColor: '#181725', 
    borderRadius: 22, 
    marginLeft: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4
  },

  listContent: { paddingHorizontal: 25, paddingBottom: 100 },
  columnWrapper: { justifyContent: 'space-between' },
  sectionLabel: { fontSize: 18, fontWeight: '800', color: '#181725', marginBottom: 20, marginTop: 10 },
  
  catCard: { 
    width: (width - 65) / 2, 
    height: 115, 
    borderRadius: 30, 
    marginBottom: 15, 
    padding: 20,
    overflow: 'hidden',
    justifyContent: 'center'
  },
  catContent: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    zIndex: 2 
  },
  catName: { fontSize: 16, fontWeight: '800', color: '#181725', flex: 1, marginRight: 5 },
  iconCircle: { 
    width: 30, 
    height: 30, 
    borderRadius: 15, 
    backgroundColor: 'rgba(255,255,255,0.8)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  bgDecoration: { position: 'absolute', right: -15, bottom: -15 },

  centerBox: { alignItems: 'center', marginTop: 60 },
  loadingText: { marginTop: 10, color: '#FF8FA3', fontWeight: '700' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 80 },
  emptyIconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  emptyText: { color: '#181725', fontSize: 18, fontWeight: '800' },
  emptySub: { color: '#A0A0A0', fontSize: 14, marginTop: 5 }
});