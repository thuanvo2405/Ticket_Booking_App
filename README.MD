🎟️ HỆ THỐNG MUA VÉ SỰ KIỆN (EVENT TICKETING SYSTEM)
Hướng dẫn cài đặt và triển khai hệ thống mua vé sự kiện trực tuyến bao gồm Frontend (React/Vite) và Backend (Node.js/Express).

1. Giới thiệu
   Hệ thống cho phép người dùng xem danh sách sự kiện, chọn vé, tạo đơn hàng và cung cấp giao diện quản trị cho Admin.

Frontend: Thư mục app.

Backend: Thư mục server.

2. Cấu trúc thư mục dự án
   Plaintext
   project-root/
   │
   ├── app/ # Mã nguồn Frontend
   ├── server/ # Mã nguồn Backend
   └── README.md # Hướng dẫn cài đặt
3. Cài đặt Cơ sở dữ liệu
   Cài đặt PostgreSQL trên máy của bạn.

Tạo một Database mới (Ví dụ: event_ticket_db).

Thông tin cấu hình mẫu:

Host: localhost

Port: 5432

Database: event_ticket_db

Username: postgres

Password: **\*\*\*\***

4. Cài đặt Backend (Thư mục server)
Bước 1: Di chuyển vào thư mục backend:

Bash
cd server
Bước 2: Cài đặt các thư viện:

Bash
npm install
Bước 3: Cấu hình biến môi trường: Tạo file .env trong thư mục server và dán nội dung sau:

Đoạn mã

# Server

PORT=3000

# Database PostgreSQL

DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=event_ticket_app
DB_PASSWORD=**\*\*\*\***
DB_PORT=5432

# Database URL

DATABASE_URL=postgresql://postgres:**\*\*\*\***@localhost:5432/event_ticket_app

# JWT & Token

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
EMAIL_TOKEN_SECRET=your_email_token_secret

# Email Config

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
MAILTRAP_TOKEN=your_mailtrap_token

# Frontend & Backend URL

FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
Bước 4: Chạy backend:

Bash
npm run dev
Backend sẽ chạy tại: http://localhost:3000

5. Cài đặt Frontend (Thư mục app)
Bước 1: Mở terminal mới và di chuyển vào thư mục frontend:

Bash
cd app
Bước 2: Cài đặt thư viện:

Bash
npm install
Bước 3: Cấu hình API: Đảm bảo URL backend trong file cấu hình frontend trỏ về: http://localhost:3000.

Bước 4: Chạy frontend:

Bash
npm run dev
Truy cập hệ thống tại: http://localhost:5173
