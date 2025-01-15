# Sử dụng Node.js 18
FROM node:18

# Thiết lập thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Expose port 3000
EXPOSE 8080

# Chạy lệnh khởi động ứng dụng
CMD ["npm", "start"]
