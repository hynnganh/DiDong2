import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { changePasswordApi, updateUserInfoApi } from "../service/APIService";
import { getUserInfoFromToken } from "../service/UserService";

export default function ProfileDetails() {
  const router = useRouter();

  // State dữ liệu
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State cho Thông báo (Custom Alert)
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: "", message: "", type: "success", action: () => {} });

  useEffect(() => { fetchUserData(); }, []);

  const fetchUserData = async () => {
    const userInfo = await getUserInfoFromToken();
    if (userInfo) {
      setUser(userInfo);
      setFirstName(userInfo.firstName || "");
      setLastName(userInfo.lastName || "");
      setPhone(userInfo.mobileNumber || "");
    }
  };

  // Hàm kích hoạt thông báo
  const showPopup = (title: string, message: string, type: "success" | "error" = "success", action?: () => void) => {
    setModalConfig({ title, message, type, action: action || (() => setModalVisible(false)) });
    setModalVisible(true);
  };

  const handleUpdateInfo = async () => {
    if (!user?.userId) return;
    try {
      setLoadingInfo(true);
      await updateUserInfoApi(user.userId, { ...user, firstName, lastName, mobileNumber: phone });
      setLoadingInfo(false);
      
      showPopup("Thành công ✨", "Thông tin của bạn đã được lưu lại rồi nhé!", "success", () => {
        setModalVisible(false);
        router.replace("/(tabs)/account");
      });
    } catch (error) {
      setLoadingInfo(false);
      showPopup("Lỗi rồi 🥺", "Không thể cập nhật thông tin lúc này.", "error");
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) return showPopup("Lưu ý", "bạn điền đủ mật khẩu nhé!", "error");
    if (newPassword !== confirmPassword) return showPopup("Lỗi", "Mật khẩu mới không khớp!", "error");

    try {
      setLoadingPassword(true);
      await changePasswordApi(user.userId, oldPassword, newPassword);
      setLoadingPassword(false);
      showPopup("Tuyệt vời ✨", "Mật khẩu đã được thay đổi thành công!", "success");
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (error) {
      setLoadingPassword(false);
      showPopup("Thất bại", "Mật khẩu cũ không đúng bạn ơi!", "error");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        
        {/* MODAL THÔNG BÁO GIỮA MÀN HÌNH */}
        <Modal transparent visible={modalVisible} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={[styles.statusDot, { backgroundColor: modalConfig.type === "success" ? "#FFB7B2" : "#A88B8B" }]} />
              <Text style={styles.modalTitle}>{modalConfig.title}</Text>
              <Text style={styles.modalMessage}>{modalConfig.message}</Text>
              <TouchableOpacity style={styles.modalBtn} onPress={modalConfig.action}>
                <Text style={styles.modalBtnText}>Đã hiểu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}><Ionicons name="chevron-back" size={24} color="#4A4A4A" /></TouchableOpacity>
          <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.container} contentContainerStyle={styles.webContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Hồ sơ bạn thơ</Text>
            <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="Họ" />
            <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Tên" />
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="Số điện thoại" />
            <TouchableOpacity style={styles.mainBtn} onPress={handleUpdateInfo} disabled={loadingInfo}>
              {loadingInfo ? <ActivityIndicator color="#FFF" /> : <Text style={styles.mainBtnText}>Lưu thay đổi</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Bảo mật</Text>
            <TextInput style={styles.input} value={oldPassword} onChangeText={setOldPassword} secureTextEntry placeholder="Mật khẩu hiện tại" />
            <TextInput style={styles.input} value={newPassword} onChangeText={setNewPassword} secureTextEntry placeholder="Mật khẩu mới" />
            <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholder="Xác nhận mật khẩu" />
            <TouchableOpacity style={[styles.mainBtn, { backgroundColor: "#A88B8B" }]} onPress={handleChangePassword} disabled={loadingPassword}>
              {loadingPassword ? <ActivityIndicator color="#FFF" /> : <Text style={styles.mainBtnText}>Đổi mật khẩu</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFF" },
  header: { flexDirection: "row", justifyContent: "space-between", padding: 15, alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  container: { flex: 1 },
  webContainer: { maxWidth: 500, alignSelf: "center", width: "100%", padding: 20 },
  section: { marginBottom: 10 },
  sectionLabel: { color: "#FFB7B2", fontWeight: "700", marginBottom: 15 },
  input: { backgroundColor: "#F9F9F9", padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "#EEE", marginBottom: 12, ...Platform.select({ web: { outlineStyle: 'none' } }) } as any,
  mainBtn: { backgroundColor: "#FFB7B2", padding: 15, borderRadius: 15, alignItems: "center", marginTop: 10 },
  mainBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  divider: { height: 1, backgroundColor: "#EEE", marginVertical: 30 },
  
  // MODAL STYLES
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: 300, backgroundColor: "#FFF", borderRadius: 25, padding: 25, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  statusDot: { width: 50, height: 6, borderRadius: 3, marginBottom: 15 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#333" },
  modalMessage: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 20, lineHeight: 20 },
  modalBtn: { backgroundColor: "#4A4A4A", paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20 },
  modalBtnText: { color: "#FFF", fontWeight: "600" }
});