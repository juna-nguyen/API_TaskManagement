# Prompt thiết kế giao diện Task Management

> Copy toàn bộ nội dung dưới đây vào công cụ AI để yêu cầu thiết kế giao diện frontend cho dự án API Task Management.

## Vai trò của AI

Bạn là senior product designer và senior frontend engineer. Hãy thiết kế giao diện web quản lý công việc (Task Management) hiện đại, trực quan, responsive, sử dụng dữ liệu từ API được cung cấp bên dưới.

## Yêu cầu công nghệ

- Frontend: React + Vite + TypeScript
- Styling: Tailwind CSS
- Icon: `lucide-react`
- Gọi API: Axios hoặc Fetch API
- API base URL: `http://localhost:3000/api/tasks`

## API contract

### Lấy danh sách task

`GET /api/tasks`

Query parameters:

| Param | Kiểu | Mặc định | Mô tả |
| --- | --- | --- | --- |
| `title` | string | - | Tìm kiếm theo tiêu đề, khớp một phần, không phân biệt hoa thường |
| `status` | enum | - | `TODO`, `IN_PROGRESS`, `DONE` |
| `priority` | enum | - | `LOW`, `MEDIUM`, `HIGH` |
| `page` | number | `1` | Trang hiện tại |
| `limit` | number | `10` | Số task mỗi trang |
| `sort` | string | `-createdAt` | Sắp xếp, ví dụ `-createdAt` hoặc `priority` |

Response `200`:

```json
{
  "total": 123,
  "page": 1,
  "limit": 10,
  "totalPages": 13,
  "data": [
    {
      "_id": "64f2a6c8e3a5c9f0d1b23456",
      "title": "Ví dụ task",
      "description": "Mô tả",
      "status": "TODO",
      "priority": "MEDIUM",
      "dueDate": "2026-09-01T00:00:00.000Z",
      "createdAt": "2026-08-01T12:00:00.000Z",
      "updatedAt": "2026-08-01T12:00:00.000Z"
    }
  ]
}
```

### Lấy chi tiết task

`GET /api/tasks/:id`

Response:

- `200`: object task
- `400`: `{ "message": "Invalid Task ID" }`
- `404`: `{ "message": "Task not found" }`
- `500`: server error

### Tạo task

`POST /api/tasks`

Body JSON:

```json
{
  "title": "Mua đồ",
  "description": "Mua sữa và bánh",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-08-20T00:00:00.000Z"
}
```

Chỉ `title` là bắt buộc. `description` mặc định `""`, `status` mặc định `TODO`, `priority` mặc định `MEDIUM`.

Response:

- `201`: task vừa tạo
- `400`: `{ "message": "..." }`

### Cập nhật task

`PUT /api/tasks/:id`

Body JSON gồm các field giống POST. `createdAt` nếu gửi sẽ bị bỏ qua.

Response:

- `200`: task đã cập nhật
- `400`: validation error
- `404`: `{ "message": "Task not found" }`

### Cập nhật trạng thái task

`POST /api/tasks/:id/status`

Body JSON:

```json
{ "status": "IN_PROGRESS" }
```

Response:

- `200`: task đã cập nhật
- `400`: `{ "message": "Status is required" }` hoặc lỗi chuyển trạng thái không hợp lệ
- `404`: `{ "message": "Task not found" }`

### Xóa task

`DELETE /api/tasks/:id`

Response:

- `200`: `{ "message": "Task deleted successfully" }`
- `404`: `{ "message": "Task not found" }`
- `500`: server error

## Business rules bắt buộc

- Trạng thái hợp lệ: `TODO`, `IN_PROGRESS`, `DONE`
- Độ ưu tiên hợp lệ: `LOW`, `MEDIUM`, `HIGH`
- Chuyển trạng thái hợp lệ:
  - `TODO` → `IN_PROGRESS`
  - `IN_PROGRESS` → `DONE`
  - `DONE` → không thể chuyển tiếp
- Giao diện phải chặn hoặc ẩn các nút chuyển trạng thái không hợp lệ.

## Yêu cầu giao diện

### Màn hình / khu vực chính

1. **Trang danh sách task**
   - Header: tên ứng dụng, tổng số task, nút “Tạo task mới”
   - Thanh công cụ: tìm kiếm theo tiêu đề, filter theo `status` và `priority`, sort
   - Danh sách task dạng card hoặc bảng
   - Hiển thị mỗi task: tiêu đề, mô tả rút gọn, status badge, priority badge, due date, ngày tạo
   - Phân trang hoặc infinite scroll
   - View toggle giữa **List view** và **Board view** nếu hợp lý:
     - List view: bảng dữ liệu
     - Board view: 3 cột `TODO`, `IN_PROGRESS`, `DONE`
   - Empty state khi không có task
   - Loading skeleton khi đang fetch

2. **Form tạo/chỉnh sửa task**
   - Modal hoặc slide-over
   - Field:
     - `title`: required
     - `description`: textarea
     - `status`: select
     - `priority`: select hoặc segmented control
     - `dueDate`: date picker
   - Validate client trước khi gửi API
   - Sau khi lưu thành công: hiển thị toast, đóng modal, refetch danh sách

3. **Chi tiết task**
   - Drawer hoặc modal hiển thị đầy đủ thông tin
   - Nút chỉnh sửa
   - Nút chuyển trạng thái theo business rules
   - Nút xóa kèm confirm dialog

4. **Thông báo và xử lý lỗi**
   - Toast/notification cho thành công và lỗi
   - Hiển thị message lỗi từ API như `Task not found`, validation error
   - Error boundary / fallback UI khi server lỗi

## Design system

- Phong cách: clean, modern, professional SaaS
- Layout: responsive, desktop ưu tiên, mobile dùng 1 cột
- Màu sắc:
  - Primary: xanh indigo hoặc blue
  - Status:
    - `TODO`: neutral/gray
    - `IN_PROGRESS`: blue
    - `DONE`: green
  - Priority:
    - `LOW`: gray/blue
    - `MEDIUM`: amber
    - `HIGH`: red
- Typography: dễ đọc, tiêu đề rõ ràng
- Spacing và hierarchy nhất quán
- Dark mode tùy chọn, nhưng nếu thêm phải hoàn chỉnh
- Không dùng ảnh bitmap không cần thiết; ưu tiên icon vector

## UX requirements

- Thao tác chính phải rõ ràng: tạo task, sửa task, chuyển trạng thái, xóa task
- Khi chuyển trạng thái phải gọi `POST /api/tasks/:id/status`, không dùng `PUT`
- Tránh render dữ liệu trước khi API trả về
- Giữ trạng thái filter/search khi reload nếu có thể
- Accessibility: label cho input, focus state, keyboard accessible, contrast đủ
- Empty/loading/error state đầy đủ

## Yêu cầu output

Hãy tạo đầy đủ source code frontend, bao gồm:

- Cấu trúc thư mục rõ ràng
- Component tái sử dụng
- Hook/API layer tách riêng
- TypeScript type/interface cho Task, filters, API response
- Responsive UI
- Hướng dẫn chạy dự án

Trước khi code, hãy tóm tắt kiến trúc UI và danh sách component bạn sẽ tạo. Sau đó triển khai từng phần và kiểm tra toàn bộ flow.

## Tiêu chí chấm nhận

- UI hoạt động đúng với toàn bộ endpoint ở trên
- Tôn trọng business rules chuyển trạng thái
- Có loading, empty, error state
- Responsive trên desktop và mobile
- Code TypeScript sạch, dễ bảo trì
- Không giả lập API nếu chưa được yêu cầu; phải gọi API thật
