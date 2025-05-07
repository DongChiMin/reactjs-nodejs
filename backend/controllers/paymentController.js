const moment = require("moment");
const crypto = require("crypto");
let { vnp_TmnCode, vnp_HashSecret, vnp_Url, vnp_ReturnUrl } = require("../config/vnpConfig");
const { sortObject } = require("../utils/vnpay");

exports.createPayment = (req, res) => {
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    
    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    let orderId = moment(date).format('DDHHmmss');
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;
    
    let locale = req.body.language || 'vn';
    let currCode = 'VND';
    let vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: vnp_TmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: currCode,
        vnp_TxnRef: orderId,
        vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
        vnp_OrderType: 'other',
        vnp_Amount: amount * 100, // Số tiền phải nhân với 100
        vnp_ReturnUrl: vnp_ReturnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
    };

    if (bankCode) {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    // Sắp xếp các tham số theo thứ tự bảng chữ cái
    vnp_Params = sortObject(vnp_Params);

    // Tạo URLSearchParams từ vnp_Params
    const params = new URLSearchParams();
    Object.entries(vnp_Params).forEach(([key, value]) => {
        params.append(key, value.toString());
    });

    // Tạo chữ ký bảo mật (vnp_SecureHash)
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const signed = hmac.update(Buffer.from(params.toString(), "utf-8")).digest("hex");
    params.append('vnp_SecureHash', signed);

    // Tạo URL thanh toán
    const paymentUrl = `${vnp_Url}?${params.toString()}`;

    // Trả về URL thanh toán cho frontend
    res.status(200).json({ paymentUrl });
};

exports.vnpayIpn = (req, res, next) => {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    // Sắp xếp các tham số theo thứ tự bảng chữ cái
    vnp_Params = sortObject(vnp_Params);

    // Tạo URLSearchParams từ vnp_Params
    const params = new URLSearchParams();
    Object.entries(vnp_Params).forEach(([key, value]) => {
        params.append(key, value.toString());
    });

    // Tạo chữ ký bảo mật (vnp_SecureHash)
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const signed = hmac.update(Buffer.from(params.toString(), "utf-8")).digest("hex");

    if (secureHash === signed) {
        if (vnp_Params['vnp_ResponseCode'] === '00') {
            // Thanh toán thành công
            res.status(200).json({ RspCode: '00', Message: 'Success' });
        } else {
            // Thanh toán thất bại
            res.status(200).json({ RspCode: '01', Message: 'Payment failed' });
        }
    } else {
        // Chữ ký không hợp lệ
        res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
    }
};

exports.vnpayReturn = (req, res, next) => {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    // Sắp xếp các tham số theo thứ tự bảng chữ cái
    vnp_Params = sortObject(vnp_Params);

    // Tạo URLSearchParams từ vnp_Params
    const params = new URLSearchParams();
    Object.entries(vnp_Params).forEach(([key, value]) => {
        params.append(key, value.toString());
    });

    // Tạo chữ ký bảo mật (vnp_SecureHash)
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const signed = hmac.update(Buffer.from(params.toString(), "utf-8")).digest("hex");

    if (secureHash === signed) {
        if (vnp_Params['vnp_ResponseCode'] === '00') {
            res.render('success', { code: '00', message: 'Payment successful' });
        } else {
            res.render('success', { code: '01', message: 'Payment failed' });
        }
    } else {
        res.render('success', { code: '97', message: 'Checksum failed' });
    }
};
