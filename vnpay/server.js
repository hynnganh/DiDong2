const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const moment = require("moment");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const SERVER_IP = "172.20.10.3"; // IP máy tính của nàng

const vnp_TmnCode = "5KKPWZ0N"; 
const vnp_HashSecret = "QZF9BDG3EG6JO4ZKUWB2H2TBWXLL9K5H";
const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

// THAY ĐỔI: Trỏ về API của Server thay vì trỏ thẳng về App localhost:8081
const vnp_ReturnUrl = `http://${SERVER_IP}:${PORT}/vnpay_return`;

app.get("/payment", (req, res) => {
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    let ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    let amount = req.query.amount ? parseInt(req.query.amount.toString()) : 10000;

    let vnp_Params = {
        'vnp_Version': '2.1.0',
        'vnp_Command': 'pay',
        'vnp_TmnCode': vnp_TmnCode,
        'vnp_Locale': 'vn',
        'vnp_CurrCode': 'VND',
        'vnp_TxnRef': moment(date).format('HHmmss'),
        'vnp_OrderInfo': 'Thanh toan don hang:' + moment(date).format('HHmmss'),
        'vnp_OrderType': 'other',
        'vnp_Amount': amount * 100,
        'vnp_ReturnUrl': vnp_ReturnUrl,
        'vnp_IpAddr': ipAddr,
        'vnp_CreateDate': createDate
    };

    vnp_Params = Object.keys(vnp_Params).sort().reduce((obj, key) => {
        obj[key] = vnp_Params[key];
        return obj;
    }, {});

    let querystring = new URLSearchParams(vnp_Params).toString();
    let hmac = crypto.createHmac("sha512", vnp_HashSecret);
    let signed = hmac.update(Buffer.from(querystring, 'utf-8')).digest("hex"); 
    
    res.json({ url: vnp_Url + "?" + querystring + "&vnp_SecureHash=" + signed });
});

app.get("/vnpay_return", (req, res) => {
    const responseCode = req.query.vnp_ResponseCode;
    const isSuccess = responseCode === "00";

    // ĐIỀU HƯỚNG: Nếu lỗi/hủy -> về 'cart', nếu thành công -> về 'payment' để xác nhận
    const targetPath = isSuccess ? "payment" : "cart";
    const deepLink = `shopmyphamngocanh://${targetPath}?vnp_ResponseCode=${responseCode}`;

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; background-color: ${isSuccess ? '#FFF9F9' : '#FFF5F5'}; }
              .card { text-align: center; background: white; padding: 40px; border-radius: 30px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); width: 280px; }
              .icon { font-size: 60px; color: ${isSuccess ? '#EABFBB' : '#FF7675'}; margin-bottom: 20px; display: block; }
              h1 { color: #4A4A4A; font-size: 18px; margin-bottom: 10px; }
              p { color: #8E8E8E; font-size: 13px; line-height: 1.5; }
              .loader { border: 3px solid #f3f3f3; border-top: 3px solid #EABFBB; border-radius: 50%; width: 20px; height: 20px; animation: spin 1s linear infinite; margin-top: 20px; }
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
      </head>
      <body>
          <div class="card">
              <span class="icon">${isSuccess ? '♥' : '✕'}</span>
              <h1>${isSuccess ? 'Thanh toán thành công' : 'Thanh toán đã hủy'}</h1>
              <p>${isSuccess ? 'Đang quay lại App để tạo đơn hàng...' : 'Nàng đã hủy giao dịch. Đang quay lại túi xách...'}</p>
              <center><div class="loader"></div></center>
          </div>
          <script>
              setTimeout(() => { window.location.href = '${deepLink}'; }, 2500);
          </script>
      </body>
      </html>
    `);
});

app.listen(PORT, () => console.log(`🚀 Server running at http://${SERVER_IP}:${PORT}`));