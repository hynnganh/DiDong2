

import mysql.connector
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import re
import traceback

app = Flask(__name__)
CORS(app)

# Cấu hình Gemini
API_KEY = "AIzaSyCeRI-adJM7lKKHHFeeGWlouHME46aG5rw" 
genai.configure(api_key=API_KEY)
def find_working_model():
    try:
        available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        for m_name in available_models:
            if 'gemini-1.5-flash' in m_name:
                return m_name
        return available_models[0] if available_models else 'gemini-1.5-flash'
    except Exception as e:
        print(f"Lỗi liệt kê model: {e}")
        return 'gemini-1.5-flash'

SELECTED_MODEL = find_working_model()
model = genai.GenerativeModel(SELECTED_MODEL)
def get_db_connection():
    return mysql.connector.connect(
        host="localhost", user="root", password="", database="ngocanhdidong", autocommit=True
    )

def get_product_context():
    db = None
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT product_id, product_name, price, special_price, image FROM products LIMIT 20")
        products = cursor.fetchall()
        context = "DANH SÁCH SẢN PHẨM TRONG KHO:\n"
        for p in products:
            gia = p['special_price'] if p['special_price'] and p['special_price'] > 0 else p['price']
            context += f"- ID: {p['product_id']} | Tên: {p['product_name']} | Giá: {gia}\n"
        return context, products
    except: return "", []
    finally:
        if db: db.close()

def add_to_cart_sql(cart_id, product_id, price):
    db = None
    try:
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("SELECT cart_item_id, quantity FROM cart_items WHERE cart_id = %s AND product_id = %s", (cart_id, product_id))
        item = cursor.fetchone()
        if item:
            cursor.execute("UPDATE cart_items SET quantity = quantity + 1 WHERE cart_item_id = %s", (item[0],))
        else:
            cursor.execute("INSERT INTO cart_items (cart_id, product_id, product_price, quantity, discount) VALUES (%s, %s, %s, %s, %s)", (cart_id, product_id, price, 1, 0.0))
        return True
    except: return False
    finally:
        if db: db.close()

@app.route("/ask", methods=["POST"])
def ask_gemini():
    try:
        data = request.get_json()
        user_msg = data.get("message", "")
        cart_id = data.get("cartId")

        context_data, raw_products = get_product_context()

        prompt = f"""
        Bạn là Ngọc Anh Beauty AI. Xưng 'em', gọi khách là 'nàng'. Ngọt ngào, tận tâm.
        Dữ liệu sản phẩm: {context_data}

        QUY TẮC:
        1. Trả lời tư vấn NGẮN GỌN. KHÔNG dùng dấu gạch đầu dòng (*) để liệt kê sản phẩm.
        2. Nếu muốn gợi ý sản phẩm, bắt buộc ghi ở cuối câu: SUGGEST_IDS: [ID1, ID2, ID3]
        3. Nếu nàng muốn mua, ghi: ACTION: ADD_TO_CART | ID: [ID] | PRICE: [GIÁ]
        
        Câu hỏi: {user_msg}
        """

        response = model.generate_content(prompt)
        reply_text = response.text
        suggested_products = []
        added_id = None

        # 1. Xử lý Gợi ý (Chuyển ID thành List Product để hiện Card)
        suggest_match = re.search(r"SUGGEST_IDS:\s*\[(.*?)\]", reply_text)
        if suggest_match:
            ids = [i.strip() for i in suggest_match.group(1).split(',')]
            for p_id in ids:
                if p_id.isdigit():
                    p_info = next((p for p in raw_products if str(p['product_id']) == p_id), None)
                    if p_info:
                        suggested_products.append({
                            "productId": p_info['product_id'],
                            "productName": p_info['product_name'],
                            "price": p_info['special_price'] or p_info['price'],
                            "image": p_info['image']
                        })
            reply_text = re.sub(r"SUGGEST_IDS:.*", "", reply_text).strip()

        # 2. Xử lý Thêm giỏ hàng
        if "ACTION: ADD_TO_CART" in reply_text:
            match = re.search(r"ID:\s*(\d+).*?PRICE:\s*(\d+)", reply_text)
            if match:
                p_id, p_price = int(match.group(1)), float(match.group(2))
                if add_to_cart_sql(cart_id, p_id, p_price):
                    added_id = p_id
                    reply_text = re.sub(r"ACTION:.*", "", reply_text).strip()
                    reply_text += "\n\n✨ Em đã thêm vào giỏ hàng cho nàng rồi nhé! ❤️"

        return jsonify({
            "status": "success",
            "reply": reply_text,
            "suggested_products": suggested_products,
            "added_product_id": added_id
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)