# Hướng Dẫn Cấu Hình Nginx Proxy Cho NestJS

## 1. Giới Thiệu

Hướng dẫn này giúp bạn thiết lập **Nginx làm reverse proxy** cho một ứng dụng NestJS đang chạy trong Docker.

Có hai trường hợp:

- **Nginx chạy trong Docker** → Có thể nhận diện service NestJS qua tên service trong `docker-compose.yml`.
- **Nginx chạy ngoài Docker** → Phải sử dụng `localhost` hoặc IP của container để kết nối.

---

Nest Server đang listen PORT 3333

## 2. Cấu Hình Khi Nginx Chạy Trong Docker

### **2.1. Cấu Hình `docker-compose.yml`**

```yaml
version: '3.8'
services:
  nest:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: nest
    env_file:
      - .env.dev
    ports:
      - '3000:3333' # Expose cổng 3333 ra 3000 trên host

  nginx:
    image: nginx:latest
    container_name: nginx
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    ports:
      - '80:80'
    depends_on:
      - nest
```

### **2.2. Cấu Hình `nginx.conf`**

```nginx
server {
    listen 80;
    server_name _;
    root /app/public;
    client_max_body_size ${NGINX_MAX_BODY};

    location / {
        proxy_pass http://nest:3333;  # Gọi trực tiếp container "nest"
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

Hoặc

```nginx
server {
    listen 80;
    server_name _;
    root /app/public;
    client_max_body_size ${NGINX_MAX_BODY};

    location / {
        proxy_pass http://localhost:3333;  # Gọi gián tiếp với localhost:PORT (PORT mà Dockerfile đã Expose, trong ví dụ này là PORT==3000)
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

### **2.3. Giải Thích**

- **`proxy_pass http://nest:3333;`** → Trỏ trực tiếp đến container `nest`, vì Nginx và NestJS chạy trong cùng network của Docker.
- **Không cần `localhost` hay IP**, chỉ cần dùng tên service (`nest`).
- **`depends_on: - nest`** đảm bảo Nginx chỉ chạy sau khi NestJS khởi động.

---

## 3. Cấu Hình Khi Nginx Chạy Ngoài Docker

Nếu Nginx chạy trực tiếp trên host (không nằm trong Docker), bạn **không thể dùng `proxy_pass http://nest:3333;`** vì Nginx không thể nhận diện service `nest`. Thay vào đó, có hai cách:

### **3.1. Cách 1: Dùng `localhost` Nếu Đã Expose Port**

Nếu bạn đã cấu hình **`ports: - '3000:3333'`**, thì Nginx có thể trỏ đến `localhost:3000`:

```nginx
server {
    listen 80;
    server_name _;
    root /app/public;
    client_max_body_size ${NGINX_MAX_BODY};

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

✅ **Cách này dễ nhất nếu bạn đã expose port trong Docker.**

### **3.2. Cách 2: Trỏ Đến IP Của Container**

Nếu NestJS **không expose port**, bạn phải lấy IP của container bằng lệnh:

```sh
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' nest
```

Ví dụ, nếu kết quả là `172.18.0.2`, bạn sửa Nginx:

```nginx
proxy_pass http://172.18.0.2:3333;
```

⚠ **Lưu ý:** IP của container có thể thay đổi sau khi restart.

### **3.3. Cách 3: Dùng `host.docker.internal` (Chỉ Windows/macOS)**

Trên **Windows/macOS**, bạn có thể trỏ đến `host.docker.internal`:

```nginx
proxy_pass http://host.docker.internal:3000;
```

⚠ **Không hoạt động trên Linux trừ khi bật thủ công.**

---

## 4. Kết Luận

| Trường hợp                                                  | `proxy_pass` Nginx                     |
| ----------------------------------------------------------- | -------------------------------------- |
| **Nginx trong Docker, NestJS trong Docker**                 | `http://nest:3333;` ✅                 |
| **Nginx ngoài Docker, NestJS có expose port (`3000:3333`)** | `http://localhost:3000;` ✅            |
| **Nginx ngoài Docker, NestJS không expose port**            | `http://<IP của container>:3333;` ⚠   |
| **Dùng `host.docker.internal` (chỉ Windows/macOS)**         | `http://host.docker.internal:3000;` ✅ |

➡ **Cách tốt nhất:** Expose port (`3000:3333`) và trỏ đến `http://localhost:3000`. 🚀
