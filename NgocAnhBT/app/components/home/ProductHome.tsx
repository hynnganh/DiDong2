import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { IMAGE_API } from '../../../service/apiClient';

const { width } = Dimensions.get('window');

export interface ProductItem {
  productId: number;
  productName: string;
  quantity: string;
  specialPrice: number;
  image?: string;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const ProductCard = ({ product, index }: { product: ProductItem; index: number }) => {
  const router = useRouter();
  const scale = useSharedValue(1);

  const imageUri = product.image
    ? `${IMAGE_API}${product.image}`
    : 'https://via.placeholder.com/150';

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => (scale.value = withSpring(0.96));
  const onPressOut = () => (scale.value = withSpring(1));

  return (
    <AnimatedTouchableOpacity
      entering={FadeInRight.delay(index * 100).duration(600)}
      style={[styles.productCard, animatedStyle]}
      activeOpacity={1}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={() =>
        router.push({
          pathname: '/productdetail',
          params: { id: String(product.productId) },
        })
      }
    >
      {/* Badge giảm giá hoặc Hot (Nếu cần thêm sau này) */}
      <View style={styles.badgeLabel}>
         <Text style={styles.badgeText}>New</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.productImage} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.productName} numberOfLines={1}>
          {product.productName}
        </Text>
        <Text style={styles.productQuantity}>
          {product.quantity || 'Chính hãng'}
        </Text>

        <View style={styles.productBottom}>
          <View>
            <Text style={styles.priceLabel}>Giá bán</Text>
            <Text style={styles.productPrice}>
              {new Intl.NumberFormat('vi-VN').format(product.specialPrice)}
              <Text style={styles.currency}> đ</Text>
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.addButton} 
            activeOpacity={0.7}
            onPress={(e) => {
               e.stopPropagation();
               console.log("Thêm vào giỏ:", product.productId);
            }}
          >
            <Feather name="shopping-bag" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </AnimatedTouchableOpacity>
  );
};

export default function ProductHome({
  title,
  products,
}: {
  title: string;
  products: ProductItem[];
}) {
  return (
    <View style={styles.mainWrapper}>
      <Animated.View entering={FadeInDown.delay(200)} style={styles.sectionHeader}>
        <View style={styles.titleLine}>
           <View style={styles.verticalLine} />
           <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.seeAll}>Xem hết</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollPadding}
        snapToInterval={width * 0.45 + 15} 
        decelerationRate="fast"
      >
        {products.map((product, index) => (
          <ProductCard key={product.productId} product={product} index={index} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { marginBottom: 30 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  titleLine: { flexDirection: 'row', alignItems: 'center' },
  verticalLine: { width: 4, height: 18, backgroundColor: '#FF8FA3', borderRadius: 2, marginRight: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#181725', letterSpacing: -0.5 },
  seeAll: { color: '#7C7C7C', fontSize: 13, fontWeight: '600' },
  scrollPadding: { paddingLeft: 5, paddingRight: 5 },

  productCard: {
    width: width * 0.45,
    marginRight: 15,
    borderRadius: 24,
    backgroundColor: 'white',
    padding: 8,
    // Shadow tinh tế hơn
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F8F8F8',
  },
  imageContainer: {
    width: '100%',
    height: 130,
    backgroundColor: '#FFF9FA', // Nền hồng cực nhạt cho ảnh
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  productImage: {
    width: '85%',
    height: '85%',
    resizeMode: 'contain',
  },
  badgeLabel: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: '#FF8FA3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    zIndex: 1,
  },
  badgeText: { color: 'white', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' },
  infoContainer: { padding: 8, marginTop: 4 },
  productName: { fontSize: 15, fontWeight: '700', color: '#181725', marginBottom: 2 },
  productQuantity: { fontSize: 11, color: '#A0A0A0', marginBottom: 10 },
  productBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceLabel: { fontSize: 9, color: '#C0C0C0', textTransform: 'uppercase', marginBottom: 2 },
  productPrice: { fontSize: 15, fontWeight: '800', color: '#FF8FA3' },
  currency: { fontSize: 11, fontWeight: '600' },
  addButton: {
    backgroundColor: '#181725', // Nút màu đen tạo sự sang trọng (Luxury Contrast)
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});