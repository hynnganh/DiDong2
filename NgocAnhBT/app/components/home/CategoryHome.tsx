import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GET_CATEGORIES } from "../../../service/APIService";

const { width } = Dimensions.get("window");

export interface CategoryItem {
  categoryId: number;
  categoryName: string;
}

export default function CategoryHome() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await GET_CATEGORIES(0, 50);
        if (res?.data?.content && Array.isArray(res.data.content)) {
          setCategories(res.data.content);
        }
      } catch (err) {
        console.log("Fetch categories error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Loading mượt mà hơn với ActivityIndicator
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#FF8FA3" size="small" />
      </View>
    );
  }

  if (!categories.length) return null;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Danh Mục</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.seeAllText}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={category.categoryId}
            style={[
              styles.categoryBox, 
              // Đổi màu xen kẽ nhẹ nhàng để trông sinh động hơn
              { backgroundColor: index % 2 === 0 ? '#FFF0F3' : '#F6F6F6' }
            ]}
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: "/productcategory",
                params: {
                  categoryId: category.categoryId,
                  name: category.categoryName,
                },
              })
            }
          >
            <View style={styles.iconCircle}>
               <MaterialCommunityIcons 
                 name={index % 2 === 0 ? "lipstick" : "face-woman-shimmer"} 
                 size={20} 
                 color="#FF8FA3" 
               />
            </View>
            <Text style={styles.categoryText} numberOfLines={1}>
              {category.categoryName}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  loadingContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginHorizontal:5,
    marginBottom: 15,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#181725",
    letterSpacing: -0.5
  },
  subTitle: {
    color: "#FF8FA3",
    fontWeight: "300"
  },
  seeAllText: { 
    fontSize: 13, 
    color: "#7C7C7C", 
    fontWeight: "600" 
  },
  scrollContent: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  categoryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 15,
    marginRight: 12,
    borderRadius: 25, // Bo tròn dạng capsule
    // Đổ bóng nhẹ cho mượt
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  categoryText: { 
    fontSize: 14, 
    fontWeight: "700", 
    color: "#181725" 
  },
});