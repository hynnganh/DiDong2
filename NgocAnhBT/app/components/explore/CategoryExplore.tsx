import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
  id: number;
  name: string;
}

export default function CategoryExplore({ id, name }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/productcategory',
          params: {
            categoryId: id,
            categoryName: name,
          },
        })
      }
      style={styles.card}
      activeOpacity={0.8}
    >
      <Text style={styles.cardText}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    height: 120,
    borderRadius: 15,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  cardText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});
