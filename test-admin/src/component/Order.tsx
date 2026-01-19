import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    NumberField,
    DateField,
    EmailField,
    ChipField,
    WrapperField,
    Show,
    SimpleShowLayout,
    ArrayField,
    ImageField,
    Labeled
} from 'react-admin';

// -----------------------------------------------------------
// 1. DANH SÁCH ĐƠN HÀNG (Order List)
// -----------------------------------------------------------
export const OrderList = () => (
    <List 
        sort={{ field: 'orderDate', order: 'DESC' }}
        title="Danh sách đơn hàng"
    >
        <Datagrid rowClick="show" bulkActionButtons={false}>
            <TextField source="id" label="Mã đơn hàng" />
            <EmailField source="email" label="Khách hàng" />
            <DateField source="orderDate" label="Ngày đặt" showTime />
            
            <NumberField 
                source="totalAmount" 
                label="Tổng tiền" 
                options={{ style: 'currency', currency: 'VND' }} 
            />
            
            <WrapperField label="Trạng thái">
                <ChipField 
                    source="orderStatus" 
                    sx={{ 
                        fontWeight: 'bold',
                        // Tùy chỉnh màu sắc dựa trên trạng thái (tùy chọn)
                        '& .MuiChip-label': { textTransform: 'uppercase' }
                    }}
                />
            </WrapperField>
            
            <TextField source="payment.paymentMethod" label="Thanh toán" />
        </Datagrid>
    </List>
);

// -----------------------------------------------------------
// 2. CHI TIẾT ĐƠN HÀNG (Order Show)
// -----------------------------------------------------------
export const OrderShow = () => (
    <Show title="Chi tiết đơn hàng">
        <SimpleShowLayout>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '20px', 
                background: '#f9f9f9', 
                padding: '15px', 
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid #e0e0e0'
            }}>
                <Labeled label="Mã đơn hàng"><TextField source="id" /></Labeled>
                <Labeled label="Ngày đặt hàng"><DateField source="orderDate" showTime /></Labeled>
                <Labeled label="Email khách hàng"><TextField source="email" /></Labeled>
                <Labeled label="Trạng thái đơn hàng"><ChipField source="orderStatus" /></Labeled>
                <Labeled label="Phương thức thanh toán"><TextField source="payment.paymentMethod" /></Labeled>
                {/* Fix source: Thường địa chỉ nằm trong address object hoặc là chuỗi đơn */}
                <Labeled label="Địa chỉ nhận hàng"><TextField source="address" defaultValue="N/A" /></Labeled>
            </div>

            <h3 style={{ margin: '20px 0 10px', color: '#1976d2' }}>Sản phẩm đã đặt</h3>
            
            <ArrayField source="orderItems" label={false}>
                <Datagrid bulkActionButtons={false}>
                    {/* Source "image" đã được mapRecord xử lý gắn IMAGE_BASE_URL */}
                    <ImageField 
                        source="image" 
                        label="Ảnh" 
                        sx={{ 
                            '& img': { 
                                maxWidth: 60, 
                                maxHeight: 60, 
                                objectFit: 'contain',
                                borderRadius: '4px',
                                background: '#fff'
                            } 
                        }} 
                    />
                    {/* Tên SP thường nằm trong nested object product */}
                    <TextField source="product.productName" label="Tên sản phẩm" />
                    <NumberField source="quantity" label="Số lượng" />
                    <NumberField 
                        source="orderedProductPrice" 
                        label="Đơn giá" 
                        options={{ style: 'currency', currency: 'VND' }} 
                    />
                    <NumberField 
                        source="totalPrice" 
                        label="Thành tiền" 
                        options={{ style: 'currency', currency: 'VND' }} 
                    />
                </Datagrid>
            </ArrayField>

            <div style={{ 
                marginTop: '20px', 
                padding: '20px', 
                textAlign: 'right', 
                borderTop: '2px solid #eee',
                background: '#fffbe6', // Làm nổi bật vùng tổng tiền
                borderRadius: '8px'
            }}>
                <span style={{ fontSize: '1.2rem', marginRight: '15px' }}>Tổng thanh toán:</span>
                <NumberField 
                    source="totalAmount" 
                    options={{ style: 'currency', currency: 'VND' }} 
                    sx={{ 
                        '& .RaNumberField-value': { 
                            fontWeight: 'bold', 
                            fontSize: '2rem', 
                            color: '#d32f2f' 
                        } 
                    }}
                />
            </div>
        </SimpleShowLayout>
    </Show>
);