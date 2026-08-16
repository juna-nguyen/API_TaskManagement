# API Routes - Task Management

Generated from the OpenAPI specification. This document lists all routes, payloads, and responses for Frontend integration.

## General

- API title: `Task Management API`
- Version: `1.0.0`
- Server: `http://localhost:3000`
- Authentication: public API, no token required
- Swagger UI: `/api-docs`
- OpenAPI JSON: `/swagger.json`

## Endpoint Overview

| Method | Endpoint | Summary |
| --- | --- | --- |
| GET | `/` | Health check |
| GET | `/swagger.json` | Lấy tài liệu OpenAPI dạng JSON |
| GET | `/api/tasks` | Lấy danh sách tasks |
| POST | `/api/tasks` | Tạo task mới |
| GET | `/api/tasks/{id}` | Lấy chi tiết task theo id |
| PUT | `/api/tasks/{id}` | Cập nhật toàn bộ hoặc một phần task |
| DELETE | `/api/tasks/{id}` | Xóa task theo id |
| POST | `/api/tasks/{id}/status` | Cập nhật trạng thái task |

## GET /

**Summary:** Health check

Trả về thông báo xác nhận server API đang hoạt động.

### Responses

#### 200 - Server đang hoạt động.
Content-Type: `text/html`

Example:

```json
"API Task Management đang hoạt động..."
```

## GET /swagger.json

**Summary:** Lấy tài liệu OpenAPI dạng JSON

Trả về specification OpenAPI 3.0 của API dưới dạng JSON.

### Responses

#### 200 - Tài liệu OpenAPI 3.0.
Content-Type: `application/json`

## GET /api/tasks

**Summary:** Lấy danh sách tasks

Lấy danh sách tasks, hỗ trợ lọc theo tiêu đề/trạng thái/độ ưu tiên, phân trang và sắp xếp.

### Parameters

| Name | In | Required | Type | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `title` | query | no | string | Tìm theo tiêu đề task (so khớp một phần, không phân biệt hoa thường). | "mua" |
| `status` | query | no | TaskStatus | Lọc theo trạng thái task. |  |
| `priority` | query | no | TaskPriority | Lọc theo độ ưu tiên task. |  |
| `page` | query | no | integer | Số trang, bắt đầu từ 1. | 1 |
| `limit` | query | no | integer | Số lượng task tối đa mỗi trang. | 10 |
| `sort` | query | no | string | Sắp xếp theo field. Ví dụ: `-createdAt` (giảm dần) hoặc `priority` (tăng dần). | "-createdAt" |

### Responses

#### 200 - Danh sách tasks kèm metadata phân trang.
Content-Type: `application/json`
Schema: `TaskListResponse`

Example `success` - Danh sách mẫu:

```json
{
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1,
  "data": [
    {
      "_id": "64f2a6c8e3a5c9f0d1b23456",
      "title": "Mua đồ",
      "description": "Mua sữa và bánh",
      "status": "TODO",
      "priority": "HIGH",
      "dueDate": "2026-08-20T00:00:00.000Z",
      "createdAt": "2026-08-01T12:00:00.000Z",
      "updatedAt": "2026-08-01T12:00:00.000Z"
    }
  ]
}
```

#### 500 - Lỗi máy chủ nội bộ.
Content-Type: `application/json`
Schema: `ErrorResponse`

Example `serverError` - Lỗi server:

```json
{
  "message": "Internal server error"
}
```

## POST /api/tasks

**Summary:** Tạo task mới

Tạo task mới. Trường `title` là bắt buộc; `status` mặc định là `TODO`, `priority` mặc định là `MEDIUM`, `description` mặc định là chuỗi rỗng.

### Request Body

Required: yes
Content-Type: `application/json`

| Field | Type | Required | Description | Example |
| --- | --- | --- | --- | --- |
| `title` | string | yes | Tiêu đề task. Bắt buộc. | "Mua đồ" |
| `description` | string | no | Mô tả chi tiết task. | "Mua sữa và bánh" |
| `status` | TaskStatus | no |  |  |
| `priority` | TaskPriority | no |  |  |
| `dueDate` | string | no | Ngày hết hạn của task. | "2026-08-20T00:00:00.000Z" |

Example `full` - Tạo task đầy đủ thông tin:

```json
{
  "title": "Mua đồ",
  "description": "Mua sữa và bánh",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-08-20T00:00:00.000Z"
}
```

Example `minimal` - Tạo task tối thiểu:

```json
{
  "title": "Viết báo cáo"
}
```

### Responses

#### 201 - Task đã được tạo thành công.
Content-Type: `application/json`
Schema: `Task`

Example `created` - Task vừa tạo:

```json
{
  "_id": "64f2a6c8e3a5c9f0d1b23456",
  "title": "Mua đồ",
  "description": "Mua sữa và bánh",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-08-20T00:00:00.000Z",
  "createdAt": "2026-08-16T09:00:00.000Z",
  "updatedAt": "2026-08-16T09:00:00.000Z"
}
```

#### 400 - Dữ liệu đầu vào không hợp lệ hoặc vi phạm validation.
Content-Type: `application/json`
Schema: `ErrorResponse`

## GET /api/tasks/{id}

**Summary:** Lấy chi tiết task theo id

Trả về thông tin chi tiết của một task dựa trên MongoDB ObjectId.

### Parameters

| Name | In | Required | Type | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `id` | path | yes | string | MongoDB ObjectId của task. | "64f2a6c8e3a5c9f0d1b23456" |

### Responses

#### 200 - Task tìm thấy.
Content-Type: `application/json`
Schema: `Task`

Example `found` - Task mẫu:

```json
{
  "_id": "64f2a6c8e3a5c9f0d1b23456",
  "title": "Mua đồ",
  "description": "Mua sữa và bánh",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-08-20T00:00:00.000Z",
  "createdAt": "2026-08-01T12:00:00.000Z",
  "updatedAt": "2026-08-01T12:00:00.000Z"
}
```

#### 400 - Task ID không hợp lệ.
Content-Type: `application/json`
Schema: `ErrorResponse`

Example `invalidId` - ID sai định dạng:

```json
{
  "message": "Invalid Task ID"
}
```

#### 404 - Task không tồn tại.
Content-Type: `application/json`
Schema: `ErrorResponse`

Example `notFound` - Không tìm thấy task:

```json
{
  "message": "Task not found"
}
```

#### 500 - Lỗi máy chủ nội bộ.
Content-Type: `application/json`
Schema: `ErrorResponse`

Example `serverError` - Lỗi server:

```json
{
  "message": "Internal server error"
}
```

## PUT /api/tasks/{id}

**Summary:** Cập nhật toàn bộ hoặc một phần task

Cập nhật các field được gửi lên. Nếu body chứa `createdAt`, field này sẽ bị bỏ qua.

### Parameters

| Name | In | Required | Type | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `id` | path | yes | string | MongoDB ObjectId của task. | "64f2a6c8e3a5c9f0d1b23456" |

### Request Body

Required: yes
Content-Type: `application/json`

| Field | Type | Required | Description | Example |
| --- | --- | --- | --- | --- |
| `title` | string | no | Tiêu đề task. | "Mua đồ Tết" |
| `description` | string | no | Mô tả chi tiết task. | "Mua sữa, bánh và kẹo" |
| `status` | TaskStatus | no |  |  |
| `priority` | TaskPriority | no |  |  |
| `dueDate` | string | no | Ngày hết hạn của task. | "2026-08-25T00:00:00.000Z" |

Example `update` - Cập nhật tiêu đề và trạng thái:

```json
{
  "title": "Mua đồ Tết",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2026-08-25T00:00:00.000Z"
}
```

### Responses

#### 200 - Task đã được cập nhật.
Content-Type: `application/json`
Schema: `Task`

Example `updated` - Task sau khi cập nhật:

```json
{
  "_id": "64f2a6c8e3a5c9f0d1b23456",
  "title": "Mua đồ Tết",
  "description": "Mua sữa và bánh",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2026-08-25T00:00:00.000Z",
  "createdAt": "2026-08-01T12:00:00.000Z",
  "updatedAt": "2026-08-16T09:10:00.000Z"
}
```

#### 400 - Dữ liệu đầu vào không hợp lệ hoặc vi phạm validation.
Content-Type: `application/json`
Schema: `ErrorResponse`

#### 404 - Task không tồn tại.
Content-Type: `application/json`
Schema: `ErrorResponse`

Example `notFound` - Không tìm thấy task:

```json
{
  "message": "Task not found"
}
```

## DELETE /api/tasks/{id}

**Summary:** Xóa task theo id

Xóa vĩnh viễn một task theo MongoDB ObjectId.

### Parameters

| Name | In | Required | Type | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `id` | path | yes | string | MongoDB ObjectId của task. | "64f2a6c8e3a5c9f0d1b23456" |

### Responses

#### 200 - Task đã bị xóa.
Content-Type: `application/json`
Schema: `DeleteTaskResponse`

Example `deleted` - Xóa thành công:

```json
{
  "message": "Task deleted successfully"
}
```

#### 404 - Task không tồn tại.
Content-Type: `application/json`
Schema: `ErrorResponse`

Example `notFound` - Không tìm thấy task:

```json
{
  "message": "Task not found"
}
```

#### 500 - Lỗi máy chủ nội bộ.
Content-Type: `application/json`
Schema: `ErrorResponse`

Example `serverError` - Lỗi server:

```json
{
  "message": "Internal server error"
}
```

## POST /api/tasks/{id}/status

**Summary:** Cập nhật trạng thái task

Cập nhật trạng thái task theo business rules: - `TODO` có thể chuyển thành `IN_PROGRESS`. - `IN_PROGRESS` có thể chuyển thành `DONE`. - `DONE` không thể chuyển sang trạng thái khác.

### Parameters

| Name | In | Required | Type | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `id` | path | yes | string | MongoDB ObjectId của task. | "64f2a6c8e3a5c9f0d1b23456" |

### Request Body

Required: yes
Content-Type: `application/json`

| Field | Type | Required | Description | Example |
| --- | --- | --- | --- | --- |
| `status` | TaskStatus | yes |  |  |

Example `inProgress` - Chuyển sang IN_PROGRESS:

```json
{
  "status": "IN_PROGRESS"
}
```

Example `done` - Chuyển sang DONE:

```json
{
  "status": "DONE"
}
```

### Responses

#### 200 - Task đã được chuyển trạng thái.
Content-Type: `application/json`
Schema: `Task`

Example `statusUpdated` - Task sau khi chuyển trạng thái:

```json
{
  "_id": "64f2a6c8e3a5c9f0d1b23456",
  "title": "Mua đồ",
  "description": "Mua sữa và bánh",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2026-08-20T00:00:00.000Z",
  "createdAt": "2026-08-01T12:00:00.000Z",
  "updatedAt": "2026-08-16T09:20:00.000Z"
}
```

#### 400 - Dữ liệu không hợp lệ hoặc vi phạm business rules.
Content-Type: `application/json`
Schema: `ErrorResponse`

Example `missingStatus` - Thiếu status:

```json
{
  "message": "Status is required"
}
```

Example `invalidTransition` - Chuyển trạng thái không hợp lệ:

```json
{
  "message": "Chuyển trạng thái không hợp lệ. Không thể chuyển từ DONE sang TODO"
}
```

#### 404 - Task không tồn tại.
Content-Type: `application/json`
Schema: `ErrorResponse`

Example `notFound` - Không tìm thấy task:

```json
{
  "message": "Task not found"
}
```

#### 500 - Lỗi máy chủ nội bộ.
Content-Type: `application/json`
Schema: `ErrorResponse`

Example `serverError` - Lỗi server:

```json
{
  "message": "Internal server error"
}
```

## Data Models

### Task Status

- `TODO`
- `IN_PROGRESS`
- `DONE`

### Task Priority

- `LOW`
- `MEDIUM`
- `HIGH`

### Task Object

| Field | Type | Required | Description | Example |
| --- | --- | --- | --- | --- |
| `_id` | string | yes | MongoDB ObjectId. | "64f2a6c8e3a5c9f0d1b23456" |
| `title` | string | yes | Tiêu đề task. | "Mua đồ" |
| `description` | string | no | Mô tả chi tiết task. | "Mua sữa và bánh" |
| `status` | TaskStatus | yes |  |  |
| `priority` | TaskPriority | yes |  |  |
| `dueDate` | string | no | Ngày hết hạn của task. | "2026-08-20T00:00:00.000Z" |
| `createdAt` | string | yes | Thời điểm tạo task. | "2026-08-01T12:00:00.000Z" |
| `updatedAt` | string | yes | Thời điểm cập nhật task gần nhất. | "2026-08-01T12:00:00.000Z" |

### Error Response

| Field | Type | Required | Description | Example |
| --- | --- | --- | --- | --- |
| `message` | string | yes | Thông báo lỗi. | "Task not found" |

### Delete Task Response

| Field | Type | Required | Description | Example |
| --- | --- | --- | --- | --- |
| `message` | string | yes | Thông báo kết quả. | "Task deleted successfully" |
