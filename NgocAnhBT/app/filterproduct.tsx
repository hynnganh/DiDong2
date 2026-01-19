// import { Feather } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import React, { useState } from 'react';
// import {
//     Dimensions,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from 'react-native';

// const { width } = Dimensions.get('window');

// // -----------------------------------------------------------
// // Dữ liệu mẫu cho Bộ lọc
// // -----------------------------------------------------------

// const initialFilters = {
//     categories: [
//         { id: '1', name: 'Eggs', selected: true },
//         { id: '2', name: 'Noodles & Pasta', selected: false },
//         { id: '3', name: 'Chips & Crisps', selected: false },
//         { id: '4', name: 'Fast Food', selected: false },
//     ],
//     brands: [
//         { id: '5', name: 'Individual Collection', selected: false },
//         { id: '6', name: 'Cocola', selected: true },
//         { id: '7', name: 'Ifad', selected: false },
//         { id: '8', name: 'Kazi Farmas', selected: false },
//     ],
// };

// // -----------------------------------------------------------
// // Component Checkbox Tùy chỉnh
// // -----------------------------------------------------------

// interface FilterItemProps {
//     name: string;
//     selected: boolean;
//     onToggle: () => void;
// }

// const CustomCheckbox: React.FC<FilterItemProps> = ({ name, selected, onToggle }) => {
//     return (
//         <TouchableOpacity style={checkboxStyles.itemContainer} onPress={onToggle}>
//             {/* Vòng tròn bên ngoài (Outline) */}
//             <View
//                 style={[
//                     checkboxStyles.checkbox,
//                     selected ? checkboxStyles.selectedCheckbox : checkboxStyles.unselectedCheckbox,
//                 ]}
//             >
//                 {/* Dấu check (V) */}
//                 {selected && <Feather name="check" size={16} color="white" />}
//             </View>
//             <Text style={checkboxStyles.label}>{name}</Text>
//         </TouchableOpacity>
//     );
// };

// const checkboxStyles = StyleSheet.create({
//     itemContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 12,
//     },
//     checkbox: {
//         width: 24,
//         height: 24,
//         borderRadius: 8,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginRight: 15,
//         borderWidth: 1.5,
//     },
//     selectedCheckbox: {
//         backgroundColor: '#00B050',
//         borderColor: '#00B050',
//     },
//     unselectedCheckbox: {
//         backgroundColor: '#fff',
//         borderColor: '#EFEFEF',
//     },
//     label: {
//         fontSize: 16,
//         color: '#333',
//     },
// });


// export default function filterproduct() {
//     const router = useRouter();
//     const [filters, setFilters] = useState(initialFilters);

//     // Hàm xử lý toggle trạng thái cho một item
//     const handleToggle = (type: 'categories' | 'brands', id: string) => {
//         setFilters((prevFilters) => ({
//             ...prevFilters,
//             [type]: prevFilters[type].map((item) =>
//                 item.id === id ? { ...item, selected: !item.selected } : item
//             ),
//         }));
//     };
    
//     // Xử lý khi nhấn nút Apply Filter
//     const handleApplyFilter = () => {
//         console.log("Applying filters:", filters);
//         // Thêm logic áp dụng bộ lọc và quay lại màn hình trước
//         router.back();
//     };


//     return (
//         <View style={styles.container}>
//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => router.back()}>
//                     <Feather name="x" size={24} color="#333" /> 
//                 </TouchableOpacity>

//                 <Text style={styles.headerTitle}>Filters</Text>
                
//                 <View style={{ width: 24 }} />
//             </View>

//             <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                
//                 <Text style={styles.sectionTitle}>Categories</Text>
//                 <View style={styles.listSection}>
//                     {filters.categories.map((category) => (
//                         <CustomCheckbox
//                             key={category.id}
//                             name={category.name}
//                             selected={category.selected}
//                             onToggle={() => handleToggle('categories', category.id)}
//                         />
//                     ))}
//                 </View>
                
//                 {/* 2. Brand */}
//                 <Text style={styles.sectionTitle}>Brand</Text>
//                 <View style={styles.listSection}>
//                     {filters.brands.map((brand) => (
//                         <CustomCheckbox
//                             key={brand.id}
//                             name={brand.name}
//                             selected={brand.selected}
//                             onToggle={() => handleToggle('brands', brand.id)}
//                         />
//                     ))}
//                 </View>
//             </ScrollView>

//             {/* Footer - Apply Filter Button */}
//             <View style={styles.footer}>
//                 <TouchableOpacity 
//                     style={styles.applyButton}
//                     onPress={handleApplyFilter}
//                 >
//                     <Text style={styles.applyButtonText}>Apply Filter</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F7F7F7', // Màu nền tổng thể nhạt
//     },

//     // Header
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: 20,
//         paddingTop: 50, // Điều chỉnh cho khu vực an toàn (Status Bar)
//         paddingBottom: 15,
//         backgroundColor: '#fff', // Màu nền Header trắng
//         borderBottomWidth: 1,
//         borderBottomColor: '#eee',
//     },
//     headerTitle: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: '#333',
//     },

//     // Content
//     contentContainer: {
//         flex: 1,
//         paddingHorizontal: 20,
//     },
//     sectionTitle: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: '#333',
//         marginTop: 25,
//         marginBottom: 10,
//     },
//     listSection: {
//         backgroundColor: '#fff',
//         borderRadius: 15,
//         paddingHorizontal: 20,
//         paddingVertical: 10,
//     },

//     // Footer & Button
//     footer: {
//         paddingHorizontal: 20,
//         paddingVertical: 20,
//         paddingBottom: 35, // Thêm padding dưới cho khu vực an toàn (safe area)
//         backgroundColor: '#F7F7F7', // Cùng màu nền
//         // Có thể thêm shadow nếu cần
//     },
//     applyButton: {
//         backgroundColor: '#00B050',
//         height: 65,
//         borderRadius: 20,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     applyButtonText: {
//         color: '#fff',
//         fontSize: 18,
//         fontWeight: '600',
//     },
// });