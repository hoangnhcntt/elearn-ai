# ELearn AI

ELearn AI là nền tảng học tiếng Anh dành cho giáo viên và học sinh, tập trung vào trải nghiệm hiện đại, phản hồi AI, quản lý lớp học và theo dõi tiến độ. Dự án hiện có phiên bản frontend chạy local hoàn chỉnh ở chế độ mock và có nền tảng backend/DB schema sẵn sàng nối tiếp với Supabase + Cloudflare khi bạn có tài khoản thật.

## 1. Tính năng đã hoàn thành

- Giao diện landing + login đa vai trò
- Teacher Dashboard và Student Dashboard
- Quản lý lớp học và học sinh demo
- Bài tập / quiz editor / quiz taking mock
- Trang kết quả học tập
- AI Tutor mock chat
- Analytics & insights
- Cloudflare Worker skeleton cho `/api/ai/generate-quiz`
- SQL migration cho schema PostgreSQL với RLS-ready policies
- `.env.example` và cấu trúc deployment-ready

## 2. Tính năng chưa hoàn thành / cần kích hoạt thật

- Kết nối Supabase Auth thực tế
- Tạo và quản lý teacher/student qua backend thật
- RLS hoạt động với dữ liệu thật ở Supabase
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
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_MODE=mock
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=
WORKER_AI_MODEL=@cf/meta/llama-3.1-8b-instruct
```

Lưu ý: ở chế độ mock, app vẫn chạy mà không cần key thật.

## 5. Deploy online

### 5.1 Tạo Supabase project

1. Vào https://supabase.com/
2. Tạo project mới
3. Lấy URL và anon key
4. Chạy SQL migration trong `supabase/migrations/001_init.sql`
5. Cấu hình Auth và đăng nhập
6. Bật Row Level Security, kiểm tra các policy đã tạo

### 5.2 Deploy API Worker

Worker dùng binding Workers AI `AI`, đã được khai báo trong `wrangler.toml`. Từ thư mục dự án, cài dependencies rồi deploy:

```bash
npm ci
npm run deploy:worker
```

Sau khi deploy, kiểm tra endpoint health tại `https://elearn-ai-worker.<subdomain>.workers.dev/api/health`.

### 5.3 Deploy frontend lên Cloudflare Pages

Kết nối GitHub để Cloudflare tự build và deploy mỗi khi có commit mới trên nhánh `main`:

1. Trong Cloudflare, mở **Workers & Pages** và chọn **Create application** → **Pages** → **Connect to Git**.
2. Kết nối GitHub, cấp quyền cho repository công khai `hoangnhcntt/elearn-ai`, rồi chọn repository đó.
3. Chọn nhánh production `main`, framework preset `Vite`, build command `npm run build` và output directory `dist`.
4. Tạo project Pages và chờ Cloudflare hoàn tất production deployment.

Ứng dụng frontend hiện ở chế độ mock; Supabase Auth và API Worker chưa được nối vào frontend.

### 5.4 Tạo Supabase project

1. Vào https://supabase.com/
2. Tạo project mới
3. Lấy URL và anon key
4. Chạy SQL migration trong `supabase/migrations/001_init.sql`
5. Cấu hình Auth và đăng nhập
6. Bật Row Level Security, kiểm tra các policy đã tạo

### 5.5 Tạo GitHub repo

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
| Supabase | Free | DB + storage + auth theo quota | Giới hạn truy cập hoặc cần nâng gói | Giữ dữ liệu tối giản, tập trung quyền RLS |
| Cloudflare Pages | Free | Quota deployment và bandwidth theo chính sách hiện hành | Tắt hoặc giới hạn traffic | Không cần domain riêng, chỉ dùng mặc định pages.dev |
| Cloudflare Workers | Free tier | Request + CPU + AI quotas | Worker trả lỗi 429/5xx | Giới hạn AI calls, cache template, tránh AI cho từng học sinh nếu không cần |
| Cloudflare Workers AI | Free tier / quota theo policy | Model quota theo account | Từ chối request AI | Dùng template đề chung theo level/topic |

## 8. Bảo mật / quyền người dùng

- Không đưa API key vào frontend
- Không dùng service-role key ở browser
- Chỉ lưu password dạng hash ở backend
- RLS phải được bật trên bảng nhạy cảm
- Không cho học sinh tự nâng quyền thành teacher
- Kiểm tra quyền ở backend và ở database policy

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
 ├── supabase/
 │   └── migrations/
 │       └── 001_init.sql
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

## 10. Tài khoản / API key cần tự tạo

- Supabase project URL
- Supabase anon key
- Supabase service role key (chỉ backend, không dùng frontend)
- Cloudflare account
- Cloudflare API token
- Cloudflare AI binding / model
- GitHub repository

## 11. Kết luận ngắn gọn

Dự án hiện đã tạo được một app ELearn AI chạy được lokal và sẵn sàng triển khai khi bạn kết nối với Supabase và Cloudflare thật. Đây là phiên bản thực tế với giao diện hoàn chỉnh, backend schema, worker skeleton và mock mode; các tính năng AI/cloud thật cần có tài khoản thật mới có thể kích hoạt hoàn toàn.
