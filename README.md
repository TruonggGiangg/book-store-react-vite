Bookstore - React + TypeScript + Vite
Chào mừng bạn đến với dự án Bookstore!
Dự án sử dụng React, TypeScript và Vite để xây dựng giao diện người dùng hiện đại với tốc độ tải nhanh và hỗ trợ Hot Module Replacement (HMR).

Các plugin chính sử dụng:
@vitejs/plugin-react — sử dụng Babel để hỗ trợ Fast Refresh.

@vitejs/plugin-react-swc — sử dụng SWC cho hiệu suất biên dịch cao hơn.

Cấu hình ESLint mở rộng
Để đảm bảo chất lượng mã nguồn và hỗ trợ kiểm tra kiểu (type-aware linting), chúng tôi khuyến khích cập nhật cấu hình ESLint như sau:

Cập nhật parserOptions ở cấp cao nhất:

js
Sao chép
Chỉnh sửa
export default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
Thay tseslint.configs.recommended bằng tseslint.configs.recommendedTypeChecked hoặc tseslint.configs.strictTypeChecked.

Có thể bổ sung thêm ...tseslint.configs.stylisticTypeChecked để cải thiện style code.

Bổ sung plugin React cho ESLint
Cài đặt eslint-plugin-react và thêm vào cấu hình:

js
Sao chép
Chỉnh sửa
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  settings: { react: { version: '18.3' } },
  plugins: {
    react,
  },
  rules: {
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
Các tính năng chính đang triển khai:
Trang chủ giới thiệu sách nổi bật

Trang chi tiết sản phẩm

Giỏ hàng và đặt hàng

Quản lý đơn hàng, khách hàng (dành cho admin)

Giao diện tối ưu trải nghiệm người dùng với Dark Mode

Hướng dẫn khởi động dự án
bash
Sao chép
Chỉnh sửa
# Cài đặt các gói phụ thuộc
npm install

# Chạy ứng dụng ở môi trường phát triển
npm run dev
Bạn có muốn mình thêm luôn mục Cấu trúc thư mục dự án (project structure) và Tiêu chuẩn code nữa không? 🚀
Mình có thể viết thêm cho bạn nếu muốn!
