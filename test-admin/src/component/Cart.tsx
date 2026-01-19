import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    NumberField,
    EmailField,
    Show,
    SimpleShowLayout,
    ArrayField,
    ImageField,
    Labeled,
    useRecordContext, // Đảm bảo import đúng vị trí
    Identifier
} from 'react-admin';
import PDFButton from '../PDFButton';

// -----------------------------------------------------------
// 1. COMPONENT HỖ TRỢ: Nút PDF
// -----------------------------------------------------------
const CustomPDFButton = () => {
    const record = useRecordContext();
    // dataProvider đã map cartId -> id, sử dụng record.id để đồng bộ
    const cartId = record?.id; 

    if (!cartId) return null;

    return (
        <div style={{ marginBottom: '20px' }}>
            <PDFButton cartId={cartId} />
        </div>
    );
};

// -----------------------------------------------------------
// 2. DANH SÁCH GIỎ HÀNG (Cart List)
// -----------------------------------------------------------
export const CartList = () => {
    const handleRowClick = (id: Identifier) => {
        if (id) {
            localStorage.setItem("globalCartId", String(id));
        }
        return "show" as const;
    };

    return (
        /* Vì API /api/admin/carts không phân trang, 
           ta thêm pagination={false} để ẩn thanh điều hướng trang của React Admin
        */
        <List title="Quản lý giỏ hàng" pagination={false}>
            <Datagrid rowClick={handleRowClick} bulkActionButtons={false}>
                <TextField source="id" label="Mã giỏ hàng" />
                <EmailField source="userEmail" label="Khách hàng" />
                <NumberField 
                    source="totalPrice" 
                    label="Tổng giá trị" 
                    options={{ style: 'currency', currency: 'VND' }} 
                />
                <TextField source="totalItems" label="Số lượng SP" defaultValue="0" />
            </Datagrid>
        </List>
    );
};

// -----------------------------------------------------------
// 3. CHI TIẾT GIỎ HÀNG (Cart Show)
// -----------------------------------------------------------
export const CartShow = () => {
    return (
        <Show title="Chi tiết giỏ hàng">
            <SimpleShowLayout>
                {/* Header: Thông tin chung và nút xuất PDF */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    borderBottom: '1px solid #eee',
                    paddingBottom: '10px'
                }}>
                    <div style={{ flex: 1 }}>
                        <Labeled label="Mã giỏ hàng"><TextField source="id" /></Labeled>
                        <Labeled label="Chủ sở hữu"><TextField source="userEmail" /></Labeled>
                    </div>
                    <CustomPDFButton />
                </div>

                <h3 style={{ margin: '20px 0 10px', color: '#1976d2' }}>Sản phẩm trong giỏ</h3>
                
                {/* Danh sách sản phẩm con */}
                <ArrayField source="products">
                    <Datagrid bulkActionButtons={false}>
                        <ImageField 
                            source="image" 
                            label="Ảnh" 
                            sx={{ '& img': { maxWidth: 50, maxHeight: 50, objectFit: 'contain', borderRadius: '4px' } }} 
                        />
                        <TextField source="productName" label="Tên sản phẩm" />
                        <NumberField source="quantity" label="Số lượng" />
                        <NumberField 
                            source="specialPrice" 
                            label="Đơn giá" 
                            options={{ style: 'currency', currency: 'VND' }} 
                        />
                        {/* Tính thành tiền cho từng item nếu cần */}
                    </Datagrid>
                </ArrayField>

                {/* Tổng kết tiền */}
                <div style={{ 
                    marginTop: '20px', 
                    textAlign: 'right', 
                    padding: '20px', 
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0'
                }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: '500', marginRight: '15px' }}>Tổng thanh toán:</span>
                    <NumberField 
                        source="totalPrice" 
                        options={{ style: 'currency', currency: 'VND' }} 
                        sx={{ 
                            '& span': { 
                                fontSize: '1.8rem', 
                                color: '#d32f2f', 
                                fontWeight: 'bold' 
                            } 
                        }}
                    />
                </div>
            </SimpleShowLayout>
        </Show>
    );
};