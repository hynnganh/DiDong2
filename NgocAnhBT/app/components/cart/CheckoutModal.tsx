import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const COLORS = {
  primary: '#EABFBB',
  primaryLight: '#FDF1F0',
  textDark: '#181725',
  textLight: '#7C7C7C',
  border: '#F2F3F2',
  white: '#FFFFFF',
  success: '#4CAF50'
};

const VIETNAM_CITIES = [
  'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu', 'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước', 'Bình Thuận', 'Cà Mau', 'Cần Thơ', 'Cao Bằng', 'Đà Nẵng', 'Đắk Lắk', 'Đắk Nông', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang', 'Hà Nam', 'Hà Nội', 'Hà Tĩnh', 'Hải Dương', 'Hải Phòng', 'Hậu Giang', 'Hòa Bình', 'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu', 'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định', 'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên', 'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên', 'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'TP. Hồ Chí Minh', 'Trà Vinh', 'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
];

export default function CheckoutModal({ totalCost, loading, onPlaceOrder }: any) {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Hà Nội');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'VNPAY'>('CASH');

  // --- LOGIC PHÍ SHIP ĐỒNG BỘ ---
  const MIEN_BAC = ['hà nội', 'tuyên quang', 'lào cai', 'thái nguyên', 'phú thọ', 'bắc ninh', 'hưng yên', 'hải phòng', 'ninh bình', 'lai châu', 'điện biên', 'sơn la', 'lạng sơn', 'quảng ninh', 'cao bằng', 'vĩnh phúc', 'bắc kạn', 'hà giang', 'thái bình', 'nam định', 'hà nam', 'hải dương'];
  const MIEN_TRUNG = ['quảng trị', 'đà nẵng', 'quảng ngãi', 'khánh hòa', 'lâm đồng', 'đắk lắk', 'huế', 'thừa thiên huế', 'thanh hóa', 'nghệ an', 'hà tĩnh', 'quảng bình', 'quảng nam', 'bình định', 'phú yên', 'ninh thuận', 'bình thuận', 'kon tum', 'gia lai', 'đắk nông'];
  const MIEN_NAM = ['tp. hồ chí minh', 'tp.hcm', 'hồ chí minh', 'đồng nai', 'tây ninh', 'cần thơ', 'vĩnh long', 'đồng tháp', 'cà mau', 'an giang', 'bà rịa - vũng tàu', 'long an', 'tiền giang', 'bến tre', 'trà vinh', 'sóc trăng', 'bạc liêu', 'hậu giang', 'kiên giang', 'bình dương', 'bình phước'];

  const getShippingFee = () => {
    if (totalCost >= 500000) return 0;
    const c = city.toLowerCase();
    if (MIEN_NAM.includes(c)) return 15000;
    if (MIEN_TRUNG.includes(c)) return 25000;
    return 35000; // Mặc định miền Bắc hoặc các tỉnh khác
  };

  const shippingFee = getShippingFee();
  const finalTotal = totalCost + shippingFee;

  const handleConfirm = () => {
    if (address.trim().length < 5) {
      Alert.alert('Nàng ơi!', 'Hãy nhập địa chỉ chi tiết hơn nhé! 🎀');
      return;
    }
    onPlaceOrder({ 
      address: address.trim(), 
      city: city, 
      paymentMethod: paymentMethod, 
      shippingFee: shippingFee 
    });
  };

  return (
    <View style={styles.modalContent}>
      <View style={styles.handleBar} />
      <View style={styles.header}>
        <Text style={styles.title}>Thanh toán</Text>
        <View style={styles.priceBadge}>
          <Text style={styles.priceBadgeText}>{finalTotal.toLocaleString()} đ</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Ionicons name="location-outline" size={18} color={COLORS.primary} />
            <Text style={styles.label}>Tỉnh / Thành phố</Text>
          </View>
          <View style={styles.citySelectorContainer}>
            <ScrollView nestedScrollEnabled={true} contentContainerStyle={styles.cityGrid}>
              {VIETNAM_CITIES.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setCity(c)}
                  style={[styles.cityChip, city === c && styles.activeCity]}
                >
                  <Text style={[styles.cityText, city === c && styles.activeCityText]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Địa chỉ nhận hàng (Số nhà, đường...)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ví dụ: 123 Đường ABC, Phường X..."
            placeholderTextColor="#BBBBBB"
            value={address}
            onChangeText={setAddress}
            multiline
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Phương thức thanh toán</Text>
          <View style={styles.payRow}>
            {(['CASH', 'VNPAY'] as const).map((method) => (
              <TouchableOpacity
                key={method}
                onPress={() => setPaymentMethod(method)}
                style={[styles.payOption, paymentMethod === method && styles.activePay]}
              >
                <FontAwesome5 
                  name={method === 'CASH' ? "money-bill-wave" : "wallet"} 
                  size={18} 
                  color={paymentMethod === method ? '#FFF' : COLORS.primary} 
                />
                <Text style={[styles.payText, paymentMethod === method && styles.activePayText]}>
                  {method === 'CASH' ? 'Tiền mặt' : 'VNPay'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.billCard}>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Tạm tính</Text>
            <Text style={styles.billValue}>{totalCost.toLocaleString()} đ</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Phí vận chuyển ({city})</Text>
            <Text style={[styles.billValue, shippingFee === 0 && {color: COLORS.success}]}>
              {shippingFee === 0 ? 'Freeship' : `+${shippingFee.toLocaleString()} đ`}
            </Text>
          </View>
          <View style={styles.dashLine} />
          <View style={styles.billRow}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>{finalTotal.toLocaleString()} đ</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.confirmText}>XÁC NHẬN ĐẶT HÀNG</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 35, borderTopRightRadius: 35, paddingHorizontal: 20, height: '85%' },
  handleBar: { width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 10, alignSelf: 'center', marginVertical: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '900', color: COLORS.textDark },
  priceBadge: { backgroundColor: COLORS.primaryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  priceBadgeText: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },
  section: { marginBottom: 20 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  label: { fontSize: 15, fontWeight: '700', color: COLORS.textDark, marginLeft: 5 },
  citySelectorContainer: { height: 180, backgroundColor: '#FAFAFA', borderRadius: 20, padding: 10, borderWidth: 1, borderColor: '#F0F0F0' },
  cityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingBottom: 10 },
  cityChip: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#EEEEEE', minWidth: '30%', alignItems: 'center' },
  activeCity: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  cityText: { fontSize: 12, color: COLORS.textDark, fontWeight: '500' },
  activeCityText: { color: '#FFF', fontWeight: '700' },
  input: { backgroundColor: '#FAFAFA', borderRadius: 15, padding: 15, fontSize: 14, color: COLORS.textDark, textAlignVertical: 'top', minHeight: 80, borderWidth: 1, borderColor: '#F0F0F0' },
  payRow: { flexDirection: 'row', gap: 12 },
  payOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 15, borderWidth: 1.5, borderColor: COLORS.primary },
  activePay: { backgroundColor: COLORS.primary },
  payText: { marginLeft: 10, fontWeight: '700', color: COLORS.primary },
  activePayText: { color: '#FFF' },
  billCard: { backgroundColor: '#FFF9F9', padding: 20, borderRadius: 25, marginTop: 10 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  billLabel: { color: COLORS.textLight, fontSize: 14 },
  billValue: { color: COLORS.textDark, fontWeight: '600' },
  dashLine: { height: 1, backgroundColor: '#EEE', marginVertical: 12 },
  totalLabel: { fontSize: 16, fontWeight: '800', color: COLORS.textDark },
  totalValue: { fontSize: 22, fontWeight: '900', color: COLORS.primary },
  confirmBtn: { backgroundColor: COLORS.textDark, padding: 18, borderRadius: 20, alignItems: 'center', marginTop: 25 },
  confirmText: { color: '#FFF', fontWeight: '800', fontSize: 16, letterSpacing: 1 },
});