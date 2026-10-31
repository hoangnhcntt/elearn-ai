# ELearn AI

ELearn AI là nền tảng học tiếng Anh dành cho giáo viên và học sinh, tập trung vào trải nghiệm hiện đại, phản hồi AI, quản lý lớp học và theo dõi tiến độ. Giao diện chạy trên Cloudflare Pages; đăng nhập thật được kiểm tra bởi Cloudflare Worker.

## 1. Tính năng đã hoàn thành

- Giao diện landing + login đa vai trò
- Đăng nhập giáo viên/học sinh qua Cloudflare Worker, có lưu phiên tùy chọn
- Teacher Dashboard và Student Dashboard
- Quản lý lớp học và học sinh demo
- Bài tập / quiz editor / quiz taking mock
- Trang kết quả học tập
- AI Tutor mock chat
- Analytics & insights
- Cloudflare Worker skeleton cho `/api/ai/generate-quiz`
- Mật khẩu được chuyển thành PBKDF2 hash và đưa vào Cloudflare Worker secrets

## 2. Tính năng chưa hoàn thành / cần kích hoạt thật

- Phân quyền dữ liệu ứng dụng thật; nội dung lớp học/bài tập hiện vẫn là dữ liệu mock
- AI quiz generation và scoring thật qua Cloudflare AI
- Cron tự giao bài hằng ngày trên cloud
- Giao diện responsive mobile đã được xây dựng, nhưng cần xác thực với env thật

## 3. Chạy local trên Windows + VS Code

### Bước 1: Cài Node.js

- Tải Node.js 22.12.0 LTS hoặc mới hơn.
- Khuyến nghị: dùng phiên bản cài cục bộ trong thư mục dự án nếu hệ thống chưa có Node.js.

### Bước 2: Mở thư mục trong VS Code

```bash
cd elearn-ai
```

### Bước 3: Cài dependencies

```bash
npm install
```

### Bước 4: Chạy local dev server

```bash
npm run dev -- --host 0.0.0.0
```

### Bước 5: Truy cập app

Mở địa chỉ hiển thị trong terminal, ví dụ:

```text
http://localhost:5173/
```

## 4. Biến môi trường

Tạo file `.env` từ `.env.example`:

```bash
copy .env.example .env
```

File mẫu chứa:

```env
VITE_APP_NAME=ELearn AI
VITE_APP_MODE=live
VITE_AUTH_API_URL=https://<worker-url>
```

`VITE_AUTH_API_URL` là URL public của Worker, không phải secret; ứng dụng đã có giá trị mặc định. Chỉ cần đổi biến này nếu thay tên Worker.

### Tài khoản đăng nhập

Trang đăng nhập chấp nhận hai tài khoản demo:

| Vai trò | Tên đăng nhập | Mật khẩu |
|---|---|---|
| Giáo viên | `teacher.demo` | `TeacherDemo-5vR9!xP3` |
| Học sinh | `student.demo` | `StudentDemo-8hQ4!mK2` |

Tick **Ghi nhớ đăng nhập trên thiết bị này** để giữ phiên trong local storage; mật khẩu không được lưu. Bỏ tick thì phiên chỉ tồn tại đến khi tải lại trang hoặc đóng tab. Đăng xuất sẽ xóa phiên đã ghi nhớ.

Ở chế độ mock (`VITE_APP_MODE=mock`), ứng dụng chấp nhận tài khoản demo nêu trên. Production mặc định xác thực qua Worker; tài khoản có trong CSV không được đưa vào JavaScript frontend.

## Danh sách tài khoản mẫu

Thư mục `accounts/` có hai bảng CSV riêng:

- `accounts/students.csv`: danh sách học sinh
- `accounts/teachers.csv`: danh sách giáo viên

Mỗi dòng gồm `name,username,password`. Có thể mở bằng Excel hoặc trình soạn thảo văn bản. Hai file CSV dữ liệu thật đã được `.gitignore` loại khỏi Git; chỉ các file `.example` rỗng được đưa lên repository. **Không đưa CSV lên Git.**

Khi deploy Worker, script đọc các CSV cục bộ, tạo salt riêng và PBKDF2-SHA256 hash cho mỗi mật khẩu, rồi tải hash cùng khóa phiên lên Cloudflare Worker secrets. Mật khẩu dạng rõ không được gửi lên Cloudflare, ghi vào frontend hoặc commit lên Git. Đổi danh sách tài khoản trong CSV rồi deploy Worker lại để cập nhật.

## 5. Deploy online

### 5.1 Deploy backend đăng nhập

Chỉnh sửa `accounts/students.csv` và `accounts/teachers.csv`, sau đó chạy:

```bash
npm ci
npm run deploy:worker
```

Lệnh này deploy Worker và đồng bộ danh sách username, tên hiển thị, hash mật khẩu từ hai CSV vào secret được bảo vệ của Cloudflare. Không gửi hay commit file CSV.

### 5.2 Deploy frontend lên Cloudflare Pages

Kết nối GitHub để Cloudflare tự build và deploy mỗi khi có commit mới trên nhánh `main`:

1. Trong Cloudflare, mở **Workers & Pages** và chọn **Create application** → **Pages** → **Connect to Git**.
2. Kết nối GitHub, cấp quyền cho repository công khai `hoangnhcntt/elearn-ai`, rồi chọn repository đó.
3. Chọn nhánh production `main`, framework preset `Vite`, build command `npm run build` và output directory `dist`.
4. Tạo project Pages và chờ Cloudflare hoàn tất production deployment.

Sau khi deploy Worker, push thay đổi frontend lên nhánh `main`; Cloudflare Pages sẽ build và deploy tự động. Tài khoản `student.demo` và `teacher.demo` có thể đăng nhập bằng mật khẩu trong CSV local tương ứng.

### 5.3 Tạo GitHub repo

```bash
git init
git add .
git commit -m "Initial ELearn AI app"
git branch -M main
git remote add origin <repo-url>
git push -u origin main
```

## 6. Build và test thực tế

### Build

```bash
npm run build
```

Kết quả thực tế đã chạy thành công trên máy này:

- TypeScript build: thành công
- Vite production build: thành công
- Lint: thành công
- Dev server: chạy và trả về `HTTP 200 OK`

## 7. Bảng chi phí / giới hạn gói miễn phí

| Dịch vụ | Gói miễn phí | Giới hạn | Hành động khi vượt hạn | Cách tránh phát sinh phí |
|---|---|---:|---|---|
| Cloudflare Pages | Free | Quota deployment và bandwidth theo chính sách hiện hành | Tắt hoặc giới hạn traffic | Không cần domain riêng, chỉ dùng mặc định pages.dev |
| Cloudflare Workers | Free tier | Request + CPU + AI quotas | Worker trả lỗi 429/5xx | Giới hạn AI calls, cache template, tránh AI cho từng học sinh nếu không cần |
| Cloudflare Workers AI | Free tier / quota theo policy | Model quota theo account | Từ chối request AI | Dùng template đề chung theo level/topic |

## 8. Bảo mật / quyền người dùng

- Không đưa API key vào frontend
- Chỉ lưu password dạng hash trong Cloudflare Worker secret
- Không commit CSV có mật khẩu
- Phiên đăng nhập được ký HMAC và có thời hạn
- Không cho học sinh tự nâng quyền thành teacher
- Nội dung lớp học và bài tập hiện là dữ liệu mock, chưa dùng cho dữ liệu học sinh thật

## 9. Cấu trúc thư mục

```text
 elearn-ai/
 ├── src/
 │   ├── components/
 │   ├── data/
 │   ├── lib/
 │   ├── pages/
 │   └── types.ts
 ├── worker/
 │   └── index.ts
 ├── scripts/
 │   └── deploy-worker.mjs
 ├── .env.example
 ├── index.html
 ├── package.json
 ├── README.md
 ├── tailwind.config.js
 ├── postcss.config.js
 ├── vite.config.ts
 ├── wrangler.toml
 └── elearn-ai-source.zip
```

## 10. Tài khoản / API cần có

- Cloudflare account
- Cloudflare AI binding / model
- GitHub repository

## 11. Kết luận ngắn gọn

Dự án có giao diện ELearn AI, đăng nhập Cloudflare Worker với danh sách tài khoản local, và các workflow demo cho lớp học, bài tập và AI Tutor.
