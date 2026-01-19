import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    DeviceEventEmitter,
    FlatList,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { ASK_GEMINI_AI } from '../../service/APIService';
import { getCartIdFromToken } from "../../service/UserService";
import { IMAGE_API } from "../../service/apiClient";

interface Product {
    id: string;
    name: string;
    price: string;
    image: string;
}

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    product?: Product;
}

export default function GeminiChatScreen() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([
        { 
            id: '1', 
            text: 'Chào bạn! ✨ Mình là trợ lý AI của Ngọc Anh Beauty. bạn cần tìm mỹ phẩm hay muốn thêm món nào vào giỏ cứ bảo mình nhé!', 
            sender: 'ai' 
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    // Tự động cuộn xuống khi có tin nhắn mới
    useEffect(() => {
        if (messages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: true });
        }
    }, [messages, loading]);

    const handleSendMessage = async () => {
        if (!inputText.trim() || loading) return;

        const userMsg = inputText.trim();
        const userMsgId = Date.now().toString();

        setMessages(prev => [...prev, { id: userMsgId, text: userMsg, sender: 'user' }]);
        setInputText('');
        setLoading(true);
        Keyboard.dismiss();

        try {
            // 1. Lấy Cart ID từ hệ thống
            const cid = await getCartIdFromToken();
            
            if (!cid) {
                setLoading(false);
                Alert.alert("Thông báo", "bạn vui lòng đăng nhập để AI hỗ trợ tốt nhất nhé!");
                return;
            }

            // 2. Gọi API Server Python
            const data = await ASK_GEMINI_AI(userMsg, cid);

            // 3. Cập nhật tin nhắn từ AI
            const aiMsgId = (Date.now() + 1).toString();
            setMessages(prev => [...prev, { 
                id: aiMsgId, 
                text: data.reply, 
                sender: 'ai',
                product: data.product_data ? {
                    id: data.product_data.productId,
                    name: data.product_data.productName,
                    price: (data.product_data.specialPrice ?? data.product_data.price)?.toLocaleString(),
                    image: data.product_data.image 
                } : undefined
            }]);

            // 4. Nếu AI báo đã thêm vào giỏ -> Phát tín hiệu cho trang MyCart load lại
            if (data.added_product_id) {
                DeviceEventEmitter.emit("CartUpdated");
                // Optional: Alert.alert("Thành công", "Đã thêm vào giỏ hàng!");
            }

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { 
                id: 'err', 
                text: 'Hic, đường truyền mỹ phẩm đang bận chút. bạn thử lại sau nhé! 😢', 
                sender: 'ai' 
            }]);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: Message }) => (
        <View style={[
            styles.bubbleContainer, 
            item.sender === 'user' ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }
        ]}>
            {/* Tin nhắn văn bản */}
            <View style={[
                styles.bubble, 
                item.sender === 'user' ? styles.userBubble : styles.aiBubble
            ]}>
                <Text style={[
                    styles.bubbleText,
                    { color: item.sender === 'user' ? '#FFF' : '#333' }
                ]}>
                    {item.text}
                </Text>
            </View>

            {/* CARD SẢN PHẨM GỢI Ý - CÓ THỂ TÍCH VÀO XEM CHI TIẾT */}
            {item.product && (
                <TouchableOpacity 
                    activeOpacity={0.9}
                    style={styles.productCard}
                    onPress={() => router.push({ 
                        pathname: "/productdetail", 
                        params: { id: item.product?.id } 
                    })}
                >
                    <View style={styles.imageWrapper}>
                        <Image 
                            source={{ uri: IMAGE_API + item.product.image }} 
                            style={styles.productImage} 
                        />
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Gợi ý cho bạn</Text>
                        </View>
                    </View>
                    
                    <View style={styles.productInfo}>
                        <Text style={styles.productName} numberOfLines={1}>
                            {item.product.name}
                        </Text>
                        <Text style={styles.productPrice}>{item.product.price} đ</Text>
                        
                        <View style={styles.detailBtn}>
                            <Text style={styles.detailBtnText}>Xem chi tiết</Text>
                            <Ionicons name="chevron-forward" size={14} color="#FF8FA3" />
                        </View>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.headerTitleRow}>
                    <Ionicons name="sparkles" size={18} color="white" />
                    <Text style={styles.headerTitle}>Ngọc Anh Beauty AI</Text>
                </View>
                <View style={{ width: 40 }} /> 
            </View>

            {/* Danh sách tin nhắn */}
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            {/* Trạng thái AI đang xử lý */}
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#FF8FA3" size="small" />
                    <Text style={styles.loadingText}>AI đang tìm báu vật...</Text>
                </View>
            )}

            {/* Ô nhập liệu */}
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.inputArea}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="bạn muốn tìm gì hôm nay?" 
                        value={inputText} 
                        onChangeText={setInputText}
                        placeholderTextColor="#A0A0A0"
                    />
                    <TouchableOpacity 
                        onPress={handleSendMessage} 
                        style={[styles.sendBtn, !inputText.trim() && { opacity: 0.6 }]}
                        disabled={!inputText.trim() || loading}
                    >
                        <Ionicons name="send" size={18} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FDF7F8' },
    header: { 
        flexDirection: 'row', 
        backgroundColor: '#FF8FA3', 
        paddingVertical: 15, 
        paddingHorizontal: 10,
        alignItems: 'center', 
        justifyContent: 'space-between',
        elevation: 4
    },
    backBtn: { width: 40, alignItems: 'center' },
    headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 8 },
    
    listContent: { padding: 15, paddingBottom: 20 },
    bubbleContainer: { marginBottom: 18, width: '100%' },
    bubble: { 
        padding: 14, 
        borderRadius: 20, 
        maxWidth: '82%',
        elevation: 1,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05, shadowRadius: 2
    },
    userBubble: { backgroundColor: '#FF8FA3', borderBottomRightRadius: 4 },
    aiBubble: { 
        backgroundColor: '#FFF', 
        borderBottomLeftRadius: 4, 
        borderWidth: 1, 
        borderColor: '#FFE4E9' 
    },
    bubbleText: { fontSize: 15, lineHeight: 22 },

    // PRODUCT CARD STYLES
    productCard: {
        backgroundColor: '#FFF',
        borderRadius: 18,
        width: 230,
        marginTop: 10,
        marginLeft: 5,
        borderWidth: 1,
        borderColor: '#FFE4E9',
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#FF8FA3', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2, shadowRadius: 6,
    },
    imageWrapper: { position: 'relative', width: '100%', height: 140 },
    productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    badge: {
        position: 'absolute', top: 8, left: 8,
        backgroundColor: 'rgba(255, 143, 163, 0.9)',
        paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8
    },
    badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
    productInfo: { padding: 12 },
    productName: { fontSize: 14, fontWeight: '700', color: '#333' },
    productPrice: { fontSize: 16, color: '#FF4D6D', fontWeight: 'bold', marginVertical: 6 },
    detailBtn: { 
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#FFF0F3', paddingVertical: 8, borderRadius: 10, marginTop: 4
    },
    detailBtnText: { color: '#FF8FA3', fontSize: 12, fontWeight: 'bold', marginRight: 4 },

    loadingContainer: { flexDirection: 'row', marginLeft: 20, marginBottom: 15, alignItems: 'center' },
    loadingText: { color: '#FF8FA3', marginLeft: 8, fontSize: 13, fontWeight: '600' },

    inputArea: { 
        flexDirection: 'row', padding: 12, backgroundColor: '#FFF', 
        borderTopWidth: 1, borderColor: '#EEE', alignItems: 'center'
    },
    input: { 
        flex: 1, backgroundColor: '#F1F3F4', borderRadius: 25, 
        paddingHorizontal: 18, height: 46, fontSize: 15, color: '#333'
    },
    sendBtn: { 
        backgroundColor: '#FF8FA3', width: 46, height: 46, borderRadius: 23, 
        justifyContent: 'center', alignItems: 'center', marginLeft: 10 
    }
});