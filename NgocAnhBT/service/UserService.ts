// service/UserService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from "buffer"; // cần để decode base64 trong React Native
import apiClient from "./apiClient";

// ---------- Decode JWT Payload ----------
function decodeJWT(token: string) {
  try {
    const payload = token.split(".")[1]; // Lấy phần payload của JWT
    const decoded = Buffer.from(payload, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch (err) {
    console.log("Decode JWT error:", err);
    return null;
  }
}

// ---------- Lấy full user info từ token ----------
export async function getUserInfoFromToken() {
  try {
    const token = await AsyncStorage.getItem("jwt-token");
    if (!token) return null;

    const payload = decodeJWT(token);
    if (!payload?.email) return null;

    const res = await apiClient.get(
      `/public/users/email/${encodeURIComponent(payload.email)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const user = res.data;

    return {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      roles: user.roles,
      address: user.address,
      cartId: user.cart?.cartId || null, 
    };
  } catch (err) {
    console.log("getUserInfoFromToken error:", err);
    return null;
  }
}

// ---------- Lấy chỉ cartId từ token ----------
export async function getCartIdFromToken(): Promise<number | null> {
  try {
    const userInfo = await getUserInfoFromToken();
 return userInfo?.cartId ?? null;
  } catch {
    return null;
  }
}

// ---------- Lấy tên đầy đủ ----------
export async function getFullNameFromToken(): Promise<string | null> {
  try {
    const userInfo = await getUserInfoFromToken();
    if (!userInfo) return null;
    return `${userInfo.firstName} ${userInfo.lastName}`;
  } catch {
    return null;
  }
}
