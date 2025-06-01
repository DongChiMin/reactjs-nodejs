# 🍽 MERN STACK Restaurant Website

> Một hệ thống quản lý nhà hàng đầy đủ chức năng được xây dựng với MERN Stack. Dự án thuộc đồ án học tập, hỗ trợ người dùng đặt món, đặt bàn và quản trị viên có thể quản lý toàn bộ hoạt động của nhà hàng thông qua trang quản trị.

---

## 📌 Tính năng

### ✨ Khách hàng (Người dùng)

- 🔍 Xem thực đơn theo từng loại: Khai vị, Món chính, Tráng miệng, v.v.
- 📋 Lọc và tìm kiếm món ăn, xem chi tiết từng món.
- 👨‍🍳 Xem danh sách đầu bếp của nhà hàng.
- 🛒 Đặt món ăn trực tuyến, thanh toán qua VNPay hoặc COD.
- 📦 Theo dõi tình trạng đơn hàng theo thời gian thực.
- 📅 Đặt bàn và xác nhận đặt chỗ trực tuyến.
- 🔐 Đăng ký và đăng nhập tài khoản.

### 🛠 Quản trị viên (Admin)

- 🍽 **Quản lý thực đơn**: Thêm, sửa, xóa món ăn.
- 👨‍🍳 **Quản lý đầu bếp**: Thêm, sửa, xóa thông tin đầu bếp.
- 📦 **Quản lý đơn hàng**: Xem chi tiết và cập nhật trạng thái (đang chuẩn bị, đã giao, đã hủy, v.v.).
- 🍽 **Quản lý bàn ăn**: Thêm, sửa, xóa, cập nhật trạng thái bàn (đã đặt, còn trống...).
- 📅 **Quản lý đơn đặt bàn**: Xác nhận và xếp bàn phù hợp.
- 👥 **Quản lý tài khoản người dùng**: Quản lý danh sách người dùng đã đăng ký.

---

## 🧑‍💻 Công nghệ sử dụng

- **Frontend**: ReactJS, MUI, TailwindCSS (nếu có), Axios
- **Backend**: NodeJS, ExpressJS
- **Database**: MongoDB + Mongoose
- **Authentication**: JSON Web Token (JWT)
- **Thanh toán**: VNPay API tích hợp
- **Upload ảnh**: Multer + Browser Image Compression
- **Captcha**: Google reCAPTCHA
- **Date handling**: MomentJS
- **Khác**: UUID, Validator, dotenv

---

## ⚙️ Cài đặt dự án

### Yêu cầu

- Node.js (v16+)
- MongoDB (cài đặt local hoặc MongoDB Atlas)
- Git

### Bước 1: Clone repository

```bash
git clone https://github.com/DongChiMin/reactjs-nodejs.git
cd reactjs-nodejs
```

### Bước 2: Cài đặt dependencies 
##### Cài đặt backend
```bash
cd backend
npm install
```

##### Cài đặt frontend
```bash
cd ../frontend
npm install
```

### Bước 3: Chạy dự án
##### Chạy backend
```bash
cd backend
npm start
```

##### Mở tab mới, chạy frontend
```bash
cd frontend
npm start
```

---

## 🚀 Ảnh chụp màn hình
![Trang chủ khách hàng](https://github.com/user-attachments/assets/592d4bf3-34cd-4592-9e6a-2aa2bf067666)  
*Hình 1: Giao diện trang chủ*

![Trang đầu bếp](https://github.com/user-attachments/assets/9c249d77-c627-47ca-8eee-7d0a3e05530f)  
*Hình 2: Giao diện danh sách các đầu bếp*

![Trang menu](https://github.com/user-attachments/assets/8b6f002a-5ca9-494d-9423-5baeec293c97)  
*Hình 3: Giao diện danh sách các món ăn*

![Trang chi tiết món ăn](https://github.com/user-attachments/assets/25253045-680c-4dca-9633-2bda15ae4164)  
*Hình 4: Giao diện chi tiết món ăn*

![Trang đặt bàn](https://github.com/user-attachments/assets/76a046b4-f272-4471-8f6b-32191a632678)  
*Hình 5: Giao diện đặt bàn*

![Đăng ký/Đăng nhập](https://github.com/user-attachments/assets/0e00e336-9ca5-4045-b5e4-1644e39a7834)  
*Hình 6: Giao diện đăng nhập*

![Giỏ hàng](https://github.com/user-attachments/assets/ae88660d-afb9-4b31-8b99-9b900d22ccc6)  
*Hình 7: Giao diện giỏ hàng*

![Trang thanh toán](https://github.com/user-attachments/assets/7d224840-899c-43bb-a47f-bf12b0f3a36a)  
*Hình 8: Giao diện thanh toán gồm COD và VNPay*

![Trang lịch sử mua hàng](https://github.com/user-attachments/assets/a309f70f-088e-408d-b07c-63eb5487c55f)  
*Hình 9: Giao diện lịch sử mua hàng của user*

![Trang Admin - Quản lý món ăn](https://github.com/user-attachments/assets/645507c6-843f-4fb4-95db-e0fd33c7259e)  
*Hình 10: Giao diện quản lý menu của nhà hàng (tương tự với trang quản lý chef và user)*

![Trang Admin - Quản lý đơn đặt hàng chờ duyệt](https://github.com/user-attachments/assets/4670cf07-9b85-4327-bf5a-c9a8c26fc826)  
*Hình 11: Danh sách các đơn đặt hàng chờ duyệt*

![Trang Admin - Quản lý đơn đặt hàng](https://github.com/user-attachments/assets/01db8de8-6197-4b60-9e22-0f706cb8b538)  
*Hình 12: Giao diện quản lý các đơn đặt hàng*

![Trang Admin - Quản lý đặt bàn (reservation)](https://github.com/user-attachments/assets/c011f7e9-6172-4282-84f2-dd3fe5cca3dd)  
*Hình 13: Giao diện quản lý đặt bàn*

![Thêm bàn mới](https://github.com/user-attachments/assets/b95d572c-3b4d-419a-b9f9-832edee599e7)  
*Hình 14: Form thêm bàn ăn mới vào hệ thống.*

![Danh sách đặt bàn](https://github.com/user-attachments/assets/74f33546-9cc2-4984-b1ab-cd74db354177)  
*Hình 15: Danh sách các đơn đặt bàn*

![Xác nhận đặt bàn](https://github.com/user-attachments/assets/6ef8b776-eb7e-43e5-ae5a-2ea2eb39b908)  
*Hình 16: Giao diện xác nhận đặt bàn (chọn bàn)*



## 🔮 Hướng phát triển

Để hệ thống quản lý nhà hàng trở nên hoàn thiện và sẵn sàng triển khai trong thực tế, nhóm định hướng phát triển thêm các tính năng nâng cao sau:

- 📧 **Gửi email/tin nhắn xác nhận:** Tự động gửi email hoặc thông báo SMS để xác nhận đơn hàng, đặt bàn hoặc nhắc lịch hẹn.
- 🔐 **Hỗ trợ đăng nhập bằng Google, Facebook:** Tích hợp OAuth để người dùng đăng nhập nhanh và tiện lợi hơn.
- 🤖 **Xây dựng chatbot hỗ trợ khách hàng:** Chatbot hướng dẫn khách truy cập tra cứu món ăn, đặt bàn, hoặc trả lời các câu hỏi thường gặp.
- 📊 **Thống kê nâng cao và biểu đồ phân tích:** Tạo các biểu đồ trực quan để phân tích doanh thu theo ngày/tuần/tháng, món ăn bán chạy, giờ cao điểm,...
- 👥 **Phát triển hệ thống nhân viên:** Quản lý ca làm, lịch làm việc, chấm công, hệ thống quản lý lương, phân công vai trò. Tích hợp tính tổng doanh thu theo nhân viên và tính lương.
- 🏢 **Tích hợp hệ thống nhà hàng đa chi nhánh:** Quản lý nhiều chi nhánh, triển khai các chương trình khuyến mại chung hoặc riêng cho từng chi nhánh.
- 🎓 **Triển khai trang tuyển dụng và lớp học nấu ăn:** Dành cho người dùng có nhu cầu tìm việc hoặc học nấu ăn chuyên nghiệp.
- 📱 **Tối ưu giao diện di động (Mobile-first):** Cải tiến trải nghiệm người dùng trên điện thoại và các thiết bị di động.
- 🗺️ **Tích hợp bản đồ giao hàng:** Sử dụng API bản đồ để hỗ trợ lên đơn, theo dõi đơn hàng, kết nối với các đơn vị vận chuyển hoặc shipper nội bộ.
- 🌐 **Ứng dụng đa ngôn ngữ:** Hỗ trợ nhiều ngôn ngữ (Anh – Việt – ...) nhằm phục vụ đa dạng đối tượng khách hàng.

---
