import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp
} from 'react-native-reanimated';

import { GET_ALL_PRODUCTS, GET_PRODUCTS_BY_KEYWORD } from '@/service/APIService';
import { IMAGE_API } from '@/service/apiClient';
import CategoryHome from '../components/home/CategoryHome';
import ProductHome from '../components/home/ProductHome';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 40;

const BANNERS = [
  { id: '1', image: require('../../assets/images/bg2.jpg'), title: 'Làn da không tuổi', sub: 'GIẢM 30% SERUM' },
  { id: '2', image: require('../../assets/images/banner6.jpg'), title: 'Makeup Tự Nhiên', sub: 'MỚI VỀ' },
  { id: '3', image: require('../../assets/images/banner4.jpg'), title: 'Môi xinh rạng rỡ', sub: 'MUA 1 TẶNG 1' },
];

const debounce = (func: Function, delay: number) => {
  let timeoutId: any;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export default function HomeScreen() {
  const router = useRouter();
  const [exclusiveOffers, setExclusiveOffers] = useState<any[]>([]);
  const [bestSelling, setBestSelling] = useState<any[]>([]);
  const [makeupProducts, setMakeupProducts] = useState<any[]>([]);

  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const indexRef = useRef(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = indexRef.current === BANNERS.length - 1 ? 0 : indexRef.current + 1;
      indexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const onViewRef = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      setActiveIndex(newIndex);
      indexRef.current = newIndex;
    }
  });

  const fetchData = async () => {
    try {
      const products = await GET_ALL_PRODUCTS();
      const formattedProducts = products.map((p: any) => ({
        ...p,
        specialPrice: p.specialPrice || p.price 
      }));
      setExclusiveOffers([...formattedProducts].sort((a, b) => b.productId - a.productId).slice(0, 6));
      setBestSelling([...formattedProducts].sort((a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0)).slice(0, 6));
      setMakeupProducts(formattedProducts.slice(0, 10));
    } catch (err) {
      console.log('Error loading data:', err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSearch = useCallback(
    debounce(async (text: string) => {
      if (text.trim().length < 2) { setSearchResults([]); return; }
      setLoadingSearch(true);
      try {
        const data = await GET_PRODUCTS_BY_KEYWORD(text, 0, 10);
        setSearchResults(data.content || data || []);
      } finally { setLoadingSearch(false); }
    }, 500), []
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
        
        {/* --- HEADER --- */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.brandName}>NGỌC ÁNH</Text>
            <View style={styles.locationRow}>
              <Feather name="map-pin" size={14} color="#FF8FA3" />
              <Text style={styles.locationText}>Mỹ Phẩm Chất Lượng</Text>
            </View>
          </View>
          <View style={styles.headerIcons}>
             <TouchableOpacity activeOpacity={0.7} style={styles.iconCircle} onPress={() => router.push('/mycart')}>
                <Feather name="shopping-cart" size={20} color="#181725" />
             </TouchableOpacity>
             <TouchableOpacity activeOpacity={0.7} style={styles.profileBox}>
                <Image source={require('../../assets/images/avt.jpg')} style={styles.profileImage} />
             </TouchableOpacity>
          </View>
        </Animated.View>

        {/* --- SEARCH BAR (FIXED: NO BLACK OUTLINE) --- */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="#FF8FA3" />
            <TextInput
              placeholder="Bạn đang tìm mỹ phẩm gì?"
              placeholderTextColor="#A0A0A0"
              style={styles.searchInput}
              value={keyword}
              onChangeText={(t) => { setKeyword(t); handleSearch(t); }}
              selectionColor="#FF8FA3" // Màu con trỏ hồng
              underlineColorAndroid="transparent" // Xóa vạch Android
            />
            {keyword.length > 0 && (
              <TouchableOpacity 
                activeOpacity={0.6}
                onPress={() => { setKeyword(''); setSearchResults([]); Keyboard.dismiss(); }}
                style={styles.clearButton}
              >
                <Feather name="x" size={12} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* --- CONTENT --- */}
        <View style={styles.contentContainer}>
          {loadingSearch ? (
            <View style={styles.centerBox}>
              <ActivityIndicator color="#FF8FA3" size="large" />
              <Text style={styles.loadingText}>Đang tìm sản phẩm...</Text>
            </View>
          ) : searchResults.length > 0 ? (
            <View style={styles.resultsList}>
              <Animated.View entering={FadeInDown.duration(400)} style={styles.resultHeader}>
                <Text style={styles.resultTitle}>Kết quả tìm thấy</Text>
                <View style={styles.countBadge}>
                   <Text style={styles.countText}>{searchResults.length}</Text>
                </View>
              </Animated.View>

              {searchResults.map((item, index) => {
                const imageUri = item.image ? `${IMAGE_API}${item.image}` : 'https://via.placeholder.com/150';
                return (
                  <Animated.View 
                    key={item.productId} 
                    entering={FadeInDown.delay(index * 100).springify()}
                  >
                    <TouchableOpacity 
                      style={styles.searchItem}
                      activeOpacity={0.8}
                      onPress={() => router.push({ pathname: '/productdetail', params: { id: item.productId }})}
                    >
                      <View style={styles.searchItemImg}>
                        <Image source={{ uri: imageUri }} style={styles.fullImage} resizeMode="contain" />
                      </View>
                      <View style={styles.searchItemInfo}>
                        <Text style={styles.searchItemName} numberOfLines={1}>{item.productName}</Text>
                        <Text style={styles.searchItemPrice}>
                          {new Intl.NumberFormat('vi-VN').format(item.specialPrice || item.price)}
                          <Text style={{fontSize: 12}}> đ</Text>
                        </Text>
                      </View>
                      <Feather name="chevron-right" size={20} color="#E2E2E2" />
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          ) : keyword.length < 2 ? (
            <Animated.View entering={FadeInDown}>
              {/* BANNER CAROUSEL */}
              <View style={{ marginBottom: 20 }}>
                <FlatList
                  ref={flatListRef}
                  data={BANNERS}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onViewableItemsChanged={onViewRef.current}
                  viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                  getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
                  renderItem={({ item }) => (
                    <View style={styles.bannerWrapper}>
                      <Image source={item.image} style={styles.bannerImage} />
                      <View style={styles.bannerOverlay}>
                        <Text style={styles.bannerSub}>{item.sub}</Text>
                        <Text style={styles.bannerMain}>{item.title}</Text>
                        <TouchableOpacity activeOpacity={0.8} style={styles.bannerBtn}>
                          <Text style={styles.bannerBtnText}>Mua ngay</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                />
                <View style={styles.pagination}>
                  {BANNERS.map((_, i) => (
                    <View key={i} style={[styles.dot, activeIndex === i ? styles.activeDot : styles.inactiveDot]} />
                  ))}
                </View>
              </View>

              <View style={styles.contentContainer1}>
    <ProductHome title="✨ Sản Phẩm Mới Về" products={exclusiveOffers} />
    <ProductHome title="💖 Bán Chạy Nhất" products={bestSelling} />
    
    {/* Category có thể để tràn viền hoặc nằm trong lề tùy sở thích */}
    <CategoryHome /> 
    
    <ProductHome title="💄 Bộ Sưu Tập Makeup" products={makeupProducts} />
  </View>
            </Animated.View>
          ) : (
            <Animated.View entering={FadeInUp} style={styles.noResultBox}>
              <Feather name="search" size={50} color="#F0F0F0" />
              <Text style={styles.noResultText}>Không tìm thấy sản phẩm</Text>
              <Text style={styles.noResultSub}>Hãy thử tìm kiếm với từ khóa khác nhé!</Text>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCFCFC' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop:20, paddingBottom: 15, backgroundColor: '#FFF' },
  headerLeft: { flex: 1 },
  brandName: { fontSize: 22, fontWeight: 'bold', letterSpacing: 2, color: '#181725' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  locationText: { fontSize: 11, color: '#FF8FA3', fontWeight: '600', marginLeft: 4, textTransform: 'uppercase' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F9F9F9', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  profileBox: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden' },
  profileImage: { width: '100%', height: '100%' },

  searchWrapper: { backgroundColor: '#FFF', paddingBottom: 15, paddingTop: 5 },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F5F5F5', 
    marginHorizontal: 20, 
    borderRadius: 30, 
    paddingHorizontal: 18, 
    height: 52,
    borderWidth: 1,
    borderColor: '#EFEFEF'
  },
  searchInput: { 
    flex: 1, 
    marginLeft: 12, 
    fontSize: 15, 
    color: '#181725', 
    fontWeight: '500',
    // Khử viền đen khi focus trên Web/Desktop
    outlineStyle: 'none', 
  } as any,
  clearButton: { backgroundColor: '#BBB', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },

  contentContainer: { flex: 1 },
  contentContainer1: {   paddingHorizontal: 16, },
  bannerWrapper: { width: width, paddingHorizontal: 20, height: 210 },
  bannerImage: { width: BANNER_WIDTH, height: '100%', borderRadius: 25 },
  bannerOverlay: { position: 'absolute', left: 40, top: 35 },
  bannerSub: { color: '#FF8FA3', fontWeight: 'bold', fontSize: 11 },
  bannerMain: { fontSize: 22, fontWeight: 'bold', color: '#181725', marginTop: 5, width: 180 },
  bannerBtn: { backgroundColor: '#181725', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, marginTop: 15, alignSelf: 'flex-start' },
  bannerBtnText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },

  pagination: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  dot: { height: 5, borderRadius: 3, marginHorizontal: 3 },
  activeDot: { width: 18, backgroundColor: '#FF8FA3' },
  inactiveDot: { width: 5, backgroundColor: '#E2E2E2' },

  resultsList: { paddingHorizontal: 20, paddingTop: 10 },
  resultHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  resultTitle: { fontSize: 18, fontWeight: '800', color: '#181725' },
  countBadge: { backgroundColor: '#FF8FA3', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 12, marginLeft: 10 },
  countText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },

  searchItem: { 
    padding: 12, 
    backgroundColor: '#FFF', 
    borderRadius: 24, 
    marginBottom: 15, 
    flexDirection: 'row', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  searchItemImg: { width: 70, height: 70, backgroundColor: '#FFF', borderRadius: 18, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  fullImage: { width: '85%', height: '85%' },
  searchItemInfo: { flex: 1, marginLeft: 15 },
  searchItemName: { fontSize: 16, fontWeight: '700', color: '#181725', marginBottom: 4 },
  searchItemPrice: { fontSize: 15, color: '#FF8FA3', fontWeight: '800' },

  centerBox: { alignItems: 'center', marginTop: 50 },
  loadingText: { marginTop: 10, color: '#FF8FA3', fontWeight: '600' },
  noResultBox: { alignItems: 'center', marginTop: 60, paddingHorizontal: 40 },
  noResultText: { fontSize: 17, fontWeight: '800', color: '#181725', marginTop: 15 },
  noResultSub: { fontSize: 14, color: '#A0A0A0', marginTop: 5, textAlign: 'center' }
});