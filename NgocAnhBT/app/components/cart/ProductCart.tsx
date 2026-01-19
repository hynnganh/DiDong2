import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IMAGE_API } from '../../../service/apiClient';

// ✅ Định nghĩa Interface chuẩn
interface ProductCartProps {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUri: string;
  onQuantityChange: (newQty: number) => void; 
}

export default function ProductCart({ name, price, quantity, imageUri, onQuantityChange }: ProductCartProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: IMAGE_API + imageUri }} style={styles.image} />
      
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.price}>{price.toLocaleString()} đ</Text>
        
        <View style={styles.actionRow}>
          <View style={styles.qtyContainer}>
            <TouchableOpacity 
              style={[styles.qtyBtn, quantity <= 1 && styles.disabledBtn]} 
              onPress={() => quantity > 1 && onQuantityChange(quantity - 1)}
            >
              <Feather name="minus" size={16} color={quantity <= 1 ? "#CCC" : "#181725"} />
            </TouchableOpacity>
            
            <Text style={styles.qtyText}>{quantity}</Text>
            
            <TouchableOpacity 
              style={styles.qtyBtn} 
              onPress={() => onQuantityChange(quantity + 1)}
            >
              <Feather name="plus" size={16} color="#181725" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: '#FFF', padding: 12, borderRadius: 22, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  image: { width: 90, height: 90, borderRadius: 18, backgroundColor: '#F9F9F9' },
  details: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  name: { fontSize: 16, fontWeight: '700', color: '#181725' },
  price: { fontSize: 15, color: '#FF8FA3', fontWeight: '800' },
  actionRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  qtyContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, padding: 4 },
  qtyBtn: { width: 30, height: 30, backgroundColor: '#FFF', borderRadius: 8, justifyContent: 'center', alignItems: 'center', elevation: 1 },
  disabledBtn: { backgroundColor: '#F9F9F9' },
  qtyText: { paddingHorizontal: 12, fontSize: 15, fontWeight: '900', color: '#181725' }
});