// import axios from "axios";
// import {
//     DataProvider,
//     GetOneResult,
//     GetListResult,
//     CreateParams,
//     CreateResult,
//     UpdateParams,
//     UpdateResult,
//     DeleteParams,
//     DeleteResult,
// } from "react-admin";

// /* 🌍 Cấu hình URL */
// const API_URL = "http://localhost:8080/api";
// const IMAGE_BASE_URL = "http://localhost:8080/api/public/products/image/";

// /* ===============================
//    HÀM BỔ TRỢ: Giải mã JWT lấy Email Admin
// ================================ */
// const getAdminEmailFromToken = () => {
//     const token = localStorage.getItem("jwt-token");
//     if (!token) return "";
//     try {
//         const base64Url = token.split('.')[1];
//         const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//         const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
//             '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
//         ).join(''));
//         const decoded = JSON.parse(jsonPayload);
//         return decoded.sub || decoded.email || "";
//     } catch (e) {
//         return "";
//     }
// };

// /* ===============================
//    1. HTTP CLIENT (Xử lý Token & Header Email)
// ================================ */
// const httpClient = async (method: string, url: string, data?: any, headers = {}) => {
//     const token = localStorage.getItem("jwt-token");
//     const adminEmail = getAdminEmailFromToken(); // Lấy email admin tự động

//     const config = {
//         headers: {
//             Authorization: token ? `Bearer ${token}` : "",
//             "Content-Type": "application/json",
//             "email": adminEmail, // Header bắt buộc theo Swagger cho quyền Admin
//             ...headers
//         },
//         withCredentials: true
//     };

//     try {
//         let response;
//         switch (method) {
//             case "GET": response = await axios.get(url, config); break;
//             case "POST": response = await axios.post(url, data, config); break;
//             case "PUT": response = await axios.put(url, data, config); break;
//             case "DELETE": response = await axios.delete(url, config); break;
//             default: throw new Error("Method không hợp lệ");
//         }
//         return response.data;
//     } catch (error: any) {
//         if (error.response?.status === 401) {
//             console.error("401 Unauthorized: Kiểm tra lại Token và Header Email Admin.");
//         }
//         throw error;
//     }
// };

// /* ===============================
//    2. MAPPING HELPER (Đã fix cho Carts/Orders)
// ================================ */
// const mapRecord = (resource: string, item: any) => {
//     if (!item) return item;

//     let idValue;
//     // FIX: Carts phải dùng userEmail làm ID để React Admin gọi API chi tiết
//     if (resource === "carts") {
//         idValue = item.userEmail;
//     } else {
//         const resourceIdMapping: Record<string, string> = {
//             orders: "orderId",
//             products: "productId",
//             categories: "categoryId",
//             banners: "bannerId"
//         };
//         let idValue = (resource === "carts") ? item.userEmail : (item.id || item.cartId);
//     }
    
//     const mapped = { ...item, id: idValue };

//     // Xử lý ảnh sản phẩm chính
//     if ((resource === "products" || resource === "categories") && mapped.image) {
//         mapped.image = mapped.image.startsWith('http') ? mapped.image : `${IMAGE_BASE_URL}${mapped.image}`;
//     }

//     // Xử lý mảng con (CartItems / OrderItems)
//     const subItems = mapped.cartItems || mapped.orderItems || mapped.products;
//     if (Array.isArray(subItems)) {
//         const fixedSub = subItems.map((p: any, index: number) => ({
//             ...p,
//             id: p.cartItemId || p.orderItemId || p.productId || `sub-${index}`,
//             image: (p.image || p.product?.image) && !(p.image || p.product?.image).startsWith('http') 
//                 ? `${IMAGE_BASE_URL}${p.image || p.product?.image}` 
//                 : (p.image || p.product?.image)
//         }));
//         // Trả lại đúng key mảng con
//         if (mapped.cartItems) mapped.cartItems = fixedSub;
//         else if (mapped.orderItems) mapped.orderItems = fixedSub;
//         else if (mapped.products) mapped.products = fixedSub;
//     }

//     return mapped;
// };

// /* ===============================
//    3. DATA PROVIDER CHÍNH
// ================================ */
// export const dataProvider: DataProvider = {
//     /* 📋 LẤY DANH SÁCH */
//     getList: async (resource, params): Promise<GetListResult> => {
//         let url = "";
//         let json: any;

//         if (resource === "carts" || resource === "orders") {
//             url = `${API_URL}/admin/${resource}`;
//             json = await httpClient("GET", url);
//             const items = Array.isArray(json) ? json : (json.content || []);
//             return {
//                 data: items.map((item: any) => mapRecord(resource, item)),
//                 total: items.length,
//             };
//         } 

//         if (resource === "products") {
//             const { page = 1, perPage = 10 } = params.pagination || {};
//             const { field = 'productId', order = 'ASC' } = params.sort || {};
//             const query = new URLSearchParams({
//                 pageNumber: (page - 1).toString(),
//                 pageSize: perPage.toString(),
//                 sortBy: field === "id" ? "productId" : field,
//                 sortOrder: order.toLowerCase(),
//                 ...(params.filter?.search && { keyword: params.filter.search })
//             });
//             url = `${API_URL}/public/products?${query.toString()}`;
//             json = await httpClient("GET", url);
//             return {
//                 data: (json.content || []).map((item: any) => mapRecord(resource, item)),
//                 total: json.totalElements || 0,
//             };
//         }

//         url = `${API_URL}/public/${resource}`;
//         json = await httpClient("GET", url);
//         const list = Array.isArray(json) ? json : (json.content || []);
//         return {
//             data: list.map((item: any) => mapRecord(resource, item)),
//             total: list.length,
//         };
//     },

//     /* 🔍 LẤY CHI TIẾT (Fix URL Carts) */
//     getOne: async (resource, params): Promise<GetOneResult> => {
//         let url = "";
//         if (resource === "carts") {
//             // params.id lúc này là email (do mapRecord gán id = userEmail)
//             url = `${API_URL}/admin/users/${params.id}/carts/active`;
//         } else {
//             const isAdmin = ["orders"].includes(resource);
//             url = isAdmin 
//                 ? `${API_URL}/admin/${resource}/${params.id}` 
//                 : `${API_URL}/public/${resource}/${params.id}`;
//         }

//         const json = await httpClient("GET", url);
//         // API Active Cart thường trả về object trực tiếp hoặc mảng 1 phần tử
//         const result = Array.isArray(json) ? json[0] : json;
//         return { data: mapRecord(resource, result) };
//     },

//     /* ➕ TẠO MỚI (Giữ nguyên logic upload file) */
//     create: async (resource, params: CreateParams): Promise<CreateResult> => {
//         if (["products", "categories", "banners"].includes(resource)) {
//             const formData = new FormData();
//             Object.keys(params.data).forEach(key => {
//                 const value = params.data[key];
//                 if (key === "file" && value?.rawFile) {
//                     formData.append("image", value.rawFile); 
//                 } else if (value !== undefined) {
//                     formData.append(key, value);
//                 }
//             });

//             const res = await axios.post(`${API_URL}/admin/${resource}`, formData, {
//                 headers: { 
//                     Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
//                     "email": getAdminEmailFromToken() 
//                 }
//             });
//             return { data: mapRecord(resource, res.data) };
//         }

//         const json = await httpClient("POST", `${API_URL}/admin/${resource}`, params.data);
//         return { data: mapRecord(resource, json) };
//     },

//     /* 📝 CẬP NHẬT (Giữ nguyên logic upload file) */
//     update: async (resource, params: UpdateParams): Promise<UpdateResult> => {
//         const url = `${API_URL}/admin/${resource}/${params.id}`;
        
//         if (params.data.file?.rawFile) {
//             const formData = new FormData();
//             Object.keys(params.data).forEach(key => {
//                 if (key === "file") formData.append("image", params.data[key].rawFile);
//                 else formData.append(key, params.data[key]);
//             });
//             const res = await axios.put(url, formData, {
//                 headers: { 
//                     Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
//                     "email": getAdminEmailFromToken()
//                 }
//             });
//             return { data: mapRecord(resource, res.data) };
//         }

//         const json = await httpClient("PUT", url, params.data);
//         return { data: mapRecord(resource, json) };
//     },

//     /* 🗑️ XÓA */
//     delete: async (resource, params: DeleteParams): Promise<DeleteResult> => {
//         await httpClient("DELETE", `${API_URL}/admin/${resource}/${params.id}`);
//         return { data: params.previousData as any };
//     },

//     getMany: async (resource, params) => {
//         const url = (resource === "carts" || resource === "orders") 
//             ? `${API_URL}/admin/${resource}` 
//             : `${API_URL}/public/${resource}`;
//         const json = await httpClient("GET", url);
//         const items = Array.isArray(json) ? json : (json.content || []);
//         const mapped = items.map((item: any) => mapRecord(resource, item));
//         return { data: mapped.filter((item: any) => params.ids.includes(item.id)) };
//     },
//     getManyReference: () => Promise.resolve({ data: [], total: 0 }),
//     updateMany: () => Promise.resolve({ data: [] }),
//     deleteMany: () => Promise.resolve({ data: [] }),
// };

// export default dataProvider;

import axios from "axios";
import { DataProvider, CreateParams, UpdateParams, GetListResult, GetOneResult } from "react-admin";

const API_URL = "http://localhost:8080/api";
const IMAGE_BASE_URL = "http://localhost:8080/api/public/products/image/";


/* ===============================
   1. HTTP CLIENT (Xử lý hiển thị lỗi)
================================ */
const httpClient = async (method: string, url: string, data?: any, headers = {}) => {
    const token = localStorage.getItem("jwt-token");

    const config = {
        headers: {
            "Authorization": token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
            ...headers
        },
        withCredentials: true
    };

    try {
        let response;
        switch (method) {
            case "GET": response = await axios.get(url, config); break;
            case "POST": response = await axios.post(url, data, config); break;
            case "PUT": response = await axios.put(url, data, config); break;
            case "DELETE": response = await axios.delete(url, config); break;
            default: throw new Error("Method không hợp lệ");
        }
        return response.data;
    } catch (error: any) {
        // Lấy thông tin lỗi chi tiết từ server trả về
        const status = error.response?.status;
        const errorMessage = error.response?.data?.message || error.message || "Lỗi hệ thống không xác định";
        
        // Thay vì redirect, chúng ta ném ra một Error với message tùy chỉnh
        // React Admin sẽ bắt lỗi này và hiển thị qua Notification (thanh màu đỏ phía dưới)
        if (status === 401) {
            throw new Error(`[Lỗi 401 - Unauthorized]: Phiên làm việc hết hạn hoặc bạn không có quyền truy cập. (${errorMessage})`);
        } else if (status === 403) {
            throw new Error(`[Lỗi 403 - Forbidden]: Bạn không có quyền thực hiện hành động này.`);
        } else if (status === 404) {
            throw new Error(`[Lỗi 404]: Không tìm thấy dữ liệu yêu cầu.`);
        }
        
        throw new Error(`[Lỗi ${status || 'Network'}]: ${errorMessage}`);
    }
};

/* ===============================
   2. MAPPING HELPER (Giữ nguyên logic cũ)
================================ */
const resourceIdMapping: Record<string, string> = {
    carts: "cartId",
    orders: "orderId",
    products: "productId",
    categories: "categoryId"
};

const mapRecord = (resource: string, item: any) => {
    if (!item) return item;
    const idField = resourceIdMapping[resource] || "id";
    const mapped = { ...item, id: item[idField] || item.id };
if ((resource === "products" || resource === "categories") && mapped.image) {
        mapped.image = mapped.image.startsWith('http') ? mapped.image : `${IMAGE_BASE_URL}${mapped.image}`;
    }
    const subKey = mapped.orderItems ? "orderItems" : (mapped.cartItems ? "cartItems" : (mapped.products ? "products" : null));
    if (subKey && Array.isArray(mapped[subKey])) {
        mapped[subKey] = mapped[subKey].map((p: any, index: number) => {
            const subId = p.orderItemId || p.cartItemId || p.productId || `sub-${index}`;
            let img = p.image || p.product?.image;
            return {
                ...p,
                id: subId,
                image: img && !img.startsWith('http') ? `${IMAGE_BASE_URL}${img}` : img
            };
        });
    }
    return mapped;
};

/* ===============================
   3. DATA PROVIDER CHÍNH
================================ */
export const dataProvider: DataProvider = {
    getList: async (resource, params): Promise<GetListResult> => {
        let url = (resource === "carts" || resource === "orders") 
            ? `${API_URL}/admin/${resource}` 
            : `${API_URL}/public/${resource}`;
            
        if (resource === "products") {
            const { page = 1, perPage = 10 } = params.pagination || {};
            const { field = 'productId', order = 'ASC' } = params.sort || {};
            const query = new URLSearchParams({
                pageNumber: (page - 1).toString(),
                pageSize: perPage.toString(),
                sortBy: field === "id" ? "productId" : field,
                sortOrder: order.toLowerCase(),
            });
            url = `${API_URL}/public/products?${query.toString()}`;
        }

        const json = await httpClient("GET", url);
        const items = Array.isArray(json) ? json : (json.content || []);
        return {
            data: items.map((item: any) => mapRecord(resource, item)),
            total: json.totalElements || items.length,
        };
    },

    getOne: async (resource, params): Promise<GetOneResult> => {
        const url = ["carts", "orders"].includes(resource) 
            ? `${API_URL}/admin/${resource}/${params.id}` 
            : `${API_URL}/public/${resource}/${params.id}`;
        const json = await httpClient("GET", url);
        return { data: mapRecord(resource, json) };
    },

    create: async (resource, params) => {
        const json = await httpClient("POST", `${API_URL}/admin/${resource}`, params.data);
        return { data: mapRecord(resource, json) };
    },

    update: async (resource, params) => {
        const json = await httpClient("PUT", `${API_URL}/admin/${resource}/${params.id}`, params.data);
        return { data: mapRecord(resource, json) };
    },

    delete: async (resource, params) => {
        await httpClient("DELETE", `${API_URL}/admin/${resource}/${params.id}`);
        return { data: params.previousData as any };
    },

    getMany: async (resource, params) => {
        const url = ["carts", "orders"].includes(resource) ? `${API_URL}/admin/${resource}` : `${API_URL}/public/${resource}`;
        const json = await httpClient("GET", url);
        const items = Array.isArray(json) ? json : (json.content || []);
        const mapped = items.map((item: any) => mapRecord(resource, item));
        return { data: mapped.filter((item: any) => params.ids.includes(item.id)) };
    },
    getManyReference: () => Promise.resolve({ data: [], total: 0 }),
    updateMany: () => Promise.resolve({ data: [] }),
    deleteMany: () => Promise.resolve({ data: [] }),
};

export default dataProvider;