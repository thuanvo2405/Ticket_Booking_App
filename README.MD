🎟️ HỆ THỐNG MUA VÉ SỰ KIỆN – HƯỚNG DẪN CÀI ĐẶT

1. Giới thiệu

Dự án là hệ thống mua vé sự kiện trực tuyến, bao gồm:

Frontend: giao diện người dùng (thư mục app)

Backend: server xử lý nghiệp vụ và cung cấp API (thư mục server)

Hệ thống cho phép người dùng xem sự kiện, chọn vé, tạo đơn hàng và quản trị viên quản lý vé, đơn hàng. 2. Cấu trúc thư mục dự án
project-root/
│
├── app/ # Mã nguồn frontend
├── server/ # Mã nguồn backend
└── README.md # Hướng dẫn cài đặt hệ thống

3. Cài đặt cơ sở dữ liệu

Cài đặt PostgreSQL

Tạo database (ví dụ: event_ticket_db)

Thông tin cấu hình ví dụ:

Host: localhost
Port: 5432
Database: event_ticket_db
Username: postgres
Password: \*\*\*\*

4. Cài đặt Backend (thư mục server)
   Bước 1: Di chuyển vào thư mục backend
   cd server

Bước 2: Cài đặt các thư viện
npm install

Bước 3: Cấu hình biến môi trường

Tạo file .env trong thư mục server:

# Server

PORT=3000

# Database PostgreSQL

DB_USER=\***\*
DB_HOST=localhost
DB_DATABASE=event_ticket_app
DB_PASSWORD=\*\***
DB_PORT=5432

# JWT & Token

ACCESS_TOKEN_SECRET=\***\*
REFRESH_TOKEN_SECRET=\*\***
EMAIL_TOKEN_SECRET=\*\*\*\*

# Email

EMAIL_USER=\***\*
EMAIL_PASS=\*\***
MAILTRAP_TOKEN=\*\*\*\*

# Frontend & Backend URL

FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000

# Database URL

DATABASE_URL=postgresql://\***\*:\*\***@localhost:5432/event_ticket_app

Bước 4: Chạy backend
npm run dev

Backend sẽ chạy tại:

http://localhost:3000

5. Cài đặt Frontend (thư mục app)
   Bước 1: Mở terminal mới và di chuyển vào thư mục frontend
   cd app

Bước 2: Cài đặt thư viện
npm install

Bước 3: Cấu hình API backend

Đảm bảo URL backend trong file cấu hình frontend là:

http://localhost:3000

Bước 4: Chạy frontend
npm run dev

Truy cập hệ thống tại:

http://localhost:5173
