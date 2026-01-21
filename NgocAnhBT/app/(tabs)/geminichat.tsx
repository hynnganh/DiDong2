import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator, Alert, DeviceEventEmitter, FlatList, Image,
    KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { ASK_GEMINI_AI } from '../../service/APIService';
import { getCartIdFromToken } from "../../service/UserService";
import { IMAGE_API } from "../../service/apiClient";

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    suggested_products?: any[];
}

export default function GeminiChatScreen() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Chào bạn! ✨ Mình là trợ lý AI của Ngọc Anh Beauty. Bạn cần tìm sản phẩm gì cứ bảo mình nhé!', sender: 'ai' }
    ]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false); // Sửa False thành false
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true }); // Sửa True thành true
        }, 100);
    }, [messages, loading]);

    const handleSendMessage = async () => {
        if (!inputText.trim() || loading) return;

        const userMsg = inputText.trim();
        setMessages(prev => [...prev, { id: Date.now().toString(), text: userMsg, sender: 'user' }]);
        setInputText('');
        setLoading(true); // Sửa True thành true

        try {
            const cid = await getCartIdFromToken();
            if (!cid) {
                setLoading(false);
                return Alert.alert("Thông báo", "Bạn vui lòng đăng nhập để mình hỗ trợ tốt nhất nhé!");
            }

            const data = await ASK_GEMINI_AI(userMsg, cid);

            setMessages(prev => [...prev, { 
                id: (Date.now() + 1).toString(), 
                text: data.reply, 
                sender: 'ai',
                // Quan trọng: Gán mảng sản phẩm từ API vào đây
                suggested_products: data.suggested_products || [] 
            }]);

            if (data.added_product_id) DeviceEventEmitter.emit("CartUpdated");

        } catch (error) {
            setMessages(prev => [...prev, { id: 'err', text: 'Kết nối đang bận, bạn thử lại sau nhé! 😢', sender: 'ai' }]);
        } finally {
            setLoading(false); // Sửa False thành false
        }
    };

    const renderItem = ({ item }: { item: Message }) => (
        <View style={[styles.bubbleContainer, item.sender === 'user' ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }]}>
            <View style={[styles.bubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
                <Text style={[styles.bubbleText, { color: item.sender === 'user' ? '#FFF' : '#333' }]}>
                    {item.text}
                </Text>
            </View>

            {/* Hiển thị Card sản phẩm nếu có mảng gợi ý */}
            {item.suggested_products && item.suggested_products.length > 0 && (
                <View style={{ width: '100%', height: 210 }}>
                    <FlatList
                        horizontal
                        data={item.suggested_products}
                        keyExtractor={(p, index) => p.productId?.toString() || index.toString()}
                        showsHorizontalScrollIndicator={false} // Sửa False thành false
                        contentContainerStyle={{ paddingLeft: 10, paddingVertical: 10 }}
                        renderItem={({ item: prod }) => (
                            <TouchableOpacity 
                                activeOpacity={0.8}
                                style={styles.productCard} 
                                onPress={() => router.push({ pathname: "/productdetail", params: { id: prod.productId } })}
                            >
                                <Image source={{ uri: IMAGE_API + prod.image }} style={styles.productImage} />
                                <View style={styles.productInfo}>
                                    <Text numberOfLines={1} style={styles.productName}>{prod.productName}</Text>
                                    <Text style={styles.productPrice}>{prod.price?.toLocaleString()}đ</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ngọc Anh Beauty AI</Text>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={m => m.id}
                contentContainerStyle={{ padding: 15 }}
                showsVerticalScrollIndicator={false} // Sửa False thành false
            />

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#FF8FA3" size="small" />
                    <Text style={styles.loadingText}>Đang kiểm tra kho sản phẩm...</Text>
                </View>
            )}

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
                <View style={styles.inputArea}>
                    <TextInput 
                        style={styles.input} 
                        value={inputText} 
                        onChangeText={setInputText} 
                        placeholder="Nhập tin nhắn..." 
                        returnKeyType="send"
                        onSubmitEditing={handleSendMessage}
                        blurOnSubmit={false}
                    />
                    <TouchableOpacity onPress={handleSendMessage} style={styles.sendBtn}>
                        <Ionicons name="send" size={18} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FDF7F8' },
    header: { flexDirection: 'row', backgroundColor: '#FF8FA3', padding: 15, alignItems: 'center', justifyContent: 'space-between' },
    headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    backBtn: { width: 40 },
    bubbleContainer: { marginBottom: 15, width: '100%' },
    bubble: { padding: 12, borderRadius: 20, maxWidth: '85%', elevation: 1 },
    bubbleText: { fontSize: 15, lineHeight: 22 },
    userBubble: { backgroundColor: '#FF8FA3', borderBottomRightRadius: 2 },
    aiBubble: { backgroundColor: '#FFF', borderBottomLeftRadius: 2, borderWidth: 1, borderColor: '#FFE4E9' },
    productCard: { backgroundColor: '#FFF', borderRadius: 12, width: 150, marginRight: 12, elevation: 3, overflow: 'hidden', borderWidth: 1, borderColor: '#FFE4E9' },
    productImage: { width: '100%', height: 110, resizeMode: 'cover' },
    productInfo: { padding: 8 },
    productName: { fontSize: 13, fontWeight: '600' },
    productPrice: { color: '#FF4D6D', fontSize: 14, fontWeight: 'bold', marginTop: 2 },
    loadingContainer: { flexDirection: 'row', marginLeft: 20, marginBottom: 10, alignItems: 'center' },
    loadingText: { color: '#FF8FA3', marginLeft: 8, fontSize: 13 },
    inputArea: { flexDirection: 'row', padding: 10, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#EEE', alignItems: 'center' },
    input: { flex: 1, backgroundColor: '#F1F3F4', borderRadius: 20, paddingHorizontal: 15, height: 40 },
    sendBtn: { backgroundColor: '#FF8FA3', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }
});