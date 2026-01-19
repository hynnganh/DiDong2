import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" />

      {/* Tabs */}
      <Stack.Screen name="(tabs)" />

      {/* Product detail */}
      <Stack.Screen
        name="productdetail"
        options={{ headerShown: true, title: "Product Detail" }}
      />
    </Stack>
  );
}
