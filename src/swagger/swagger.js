const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      version: "1.0.0",
      description:
        "Tài liệu API quản lý công việc (Task Management) theo chuẩn OpenAPI 3.0.\n\n" +
        "Bao gồm đầy đủ các endpoint CRUD, lọc, phân trang, sắp xếp và cập nhật trạng thái theo business rules.\n\n" +
        "Lưu ý xác thực: hiện tại tất cả endpoint đều public, không yêu cầu JWT, API Key hay Bearer token.",
      contact: {
        name: "Task Management Team",
      },
      license: {
        name: "ISC",
      },
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:3000",
        description: "Môi trường phát triển local",
      },
    ],
    tags: [
      {
        name: "Tasks",
        description: "Quản lý task: xem danh sách, chi tiết, tạo, cập nhật, chuyển trạng thái và xóa.",
      },
      {
        name: "System",
        description: "Các endpoint hệ thống như health check và tài liệu Swagger JSON.",
      },
    ],
    paths: {
      "/": {
        get: {
          tags: ["System"],
          summary: "Health check",
          description: "Trả về thông báo xác nhận server API đang hoạt động.",
          operationId: "healthCheck",
          responses: {
            "200": {
              description: "Server đang hoạt động.",
              content: {
                "text/html": {
                  schema: { type: "string" },
                  example: "API Task Management đang hoạt động...",
                },
              },
            },
          },
        },
      },
      "/swagger.json": {
        get: {
          tags: ["System"],
          summary: "Lấy tài liệu OpenAPI dạng JSON",
          description: "Trả về specification OpenAPI 3.0 của API dưới dạng JSON.",
          operationId: "getSwaggerJson",
          responses: {
            "200": {
              description: "Tài liệu OpenAPI 3.0.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    description: "Swagger/OpenAPI specification object.",
                  },
                },
              },
            },
          },
        },
      },
      "/api/tasks": {
        get: {
          tags: ["Tasks"],
          summary: "Lấy danh sách tasks",
          description:
            "Lấy danh sách tasks, hỗ trợ lọc theo tiêu đề/trạng thái/độ ưu tiên, phân trang và sắp xếp.",
          operationId: "getAllTasks",
          parameters: [
            {
              name: "title",
              in: "query",
              required: false,
              description: "Tìm theo tiêu đề task (so khớp một phần, không phân biệt hoa thường).",
              schema: { type: "string", example: "mua" },
            },
            {
              name: "status",
              in: "query",
              required: false,
              description: "Lọc theo trạng thái task.",
              schema: { $ref: "#/components/schemas/TaskStatus" },
            },
            {
              name: "priority",
              in: "query",
              required: false,
              description: "Lọc theo độ ưu tiên task.",
              schema: { $ref: "#/components/schemas/TaskPriority" },
            },
            {
              name: "page",
              in: "query",
              required: false,
              description: "Số trang, bắt đầu từ 1.",
              schema: { type: "integer", minimum: 1, default: 1, example: 1 },
            },
            {
              name: "limit",
              in: "query",
              required: false,
              description: "Số lượng task tối đa mỗi trang.",
              schema: { type: "integer", minimum: 1, default: 10, example: 10 },
            },
            {
              name: "sort",
              in: "query",
              required: false,
              description:
                "Sắp xếp theo field. Ví dụ: `-createdAt` (giảm dần) hoặc `priority` (tăng dần).",
              schema: { type: "string", default: "-createdAt", example: "-createdAt" },
            },
          ],
          responses: {
            "200": {
              description: "Danh sách tasks kèm metadata phân trang.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/TaskListResponse" },
                  examples: {
                    success: {
                      summary: "Danh sách mẫu",
                      value: {
                        total: 1,
                        page: 1,
                        limit: 10,
                        totalPages: 1,
                        data: [
                          {
                            _id: "64f2a6c8e3a5c9f0d1b23456",
                            title: "Mua đồ",
                            description: "Mua sữa và bánh",
                            status: "TODO",
                            priority: "HIGH",
                            dueDate: "2026-08-20T00:00:00.000Z",
                            createdAt: "2026-08-01T12:00:00.000Z",
                            updatedAt: "2026-08-01T12:00:00.000Z",
                          },
                        ],
                      },
                    },
                  },
                },
              },
            },
            "500": { $ref: "#/components/responses/InternalServerError" },
          },
        },
        post: {
          tags: ["Tasks"],
          summary: "Tạo task mới",
          description:
            "Tạo task mới. Trường `title` là bắt buộc; `status` mặc định là `TODO`, `priority` mặc định là `MEDIUM`, `description` mặc định là chuỗi rỗng.",
          operationId: "createTask",
          requestBody: {
            required: true,
            description: "Dữ liệu task cần tạo.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateTaskRequest" },
                examples: {
                  full: {
                    summary: "Tạo task đầy đủ thông tin",
                    value: {
                      title: "Mua đồ",
                      description: "Mua sữa và bánh",
                      status: "TODO",
                      priority: "HIGH",
                      dueDate: "2026-08-20T00:00:00.000Z",
                    },
                  },
                  minimal: {
                    summary: "Tạo task tối thiểu",
                    value: {
                      title: "Viết báo cáo",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Task đã được tạo thành công.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Task" },
                  examples: {
                    created: {
                      summary: "Task vừa tạo",
                      value: {
                        _id: "64f2a6c8e3a5c9f0d1b23456",
                        title: "Mua đồ",
                        description: "Mua sữa và bánh",
                        status: "TODO",
                        priority: "HIGH",
                        dueDate: "2026-08-20T00:00:00.000Z",
                        createdAt: "2026-08-16T09:00:00.000Z",
                        updatedAt: "2026-08-16T09:00:00.000Z",
                      },
                    },
                  },
                },
              },
            },
            "400": { $ref: "#/components/responses/BadRequest" },
          },
        },
      },
      "/api/tasks/{id}": {
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB ObjectId của task.",
            schema: {
              type: "string",
              pattern: "^[0-9a-fA-F]{24}$",
              example: "64f2a6c8e3a5c9f0d1b23456",
            },
          },
        ],
        get: {
          tags: ["Tasks"],
          summary: "Lấy chi tiết task theo id",
          description: "Trả về thông tin chi tiết của một task dựa trên MongoDB ObjectId.",
          operationId: "getTaskById",
          responses: {
            "200": {
              description: "Task tìm thấy.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Task" },
                  examples: {
                    found: {
                      summary: "Task mẫu",
                      value: {
                        _id: "64f2a6c8e3a5c9f0d1b23456",
                        title: "Mua đồ",
                        description: "Mua sữa và bánh",
                        status: "TODO",
                        priority: "HIGH",
                        dueDate: "2026-08-20T00:00:00.000Z",
                        createdAt: "2026-08-01T12:00:00.000Z",
                        updatedAt: "2026-08-01T12:00:00.000Z",
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Task ID không hợp lệ.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                  examples: {
                    invalidId: {
                      summary: "ID sai định dạng",
                      value: { message: "Invalid Task ID" },
                    },
                  },
                },
              },
            },
            "404": { $ref: "#/components/responses/NotFound" },
            "500": { $ref: "#/components/responses/InternalServerError" },
          },
        },
        put: {
          tags: ["Tasks"],
          summary: "Cập nhật toàn bộ hoặc một phần task",
          description:
            "Cập nhật các field được gửi lên. Nếu body chứa `createdAt`, field này sẽ bị bỏ qua.",
          operationId: "updateTask",
          requestBody: {
            required: true,
            description: "Các field cần cập nhật.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateTaskRequest" },
                examples: {
                  update: {
                    summary: "Cập nhật tiêu đề và trạng thái",
                    value: {
                      title: "Mua đồ Tết",
                      status: "IN_PROGRESS",
                      priority: "HIGH",
                      dueDate: "2026-08-25T00:00:00.000Z",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Task đã được cập nhật.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Task" },
                  examples: {
                    updated: {
                      summary: "Task sau khi cập nhật",
                      value: {
                        _id: "64f2a6c8e3a5c9f0d1b23456",
                        title: "Mua đồ Tết",
                        description: "Mua sữa và bánh",
                        status: "IN_PROGRESS",
                        priority: "HIGH",
                        dueDate: "2026-08-25T00:00:00.000Z",
                        createdAt: "2026-08-01T12:00:00.000Z",
                        updatedAt: "2026-08-16T09:10:00.000Z",
                      },
                    },
                  },
                },
              },
            },
            "400": { $ref: "#/components/responses/BadRequest" },
            "404": { $ref: "#/components/responses/NotFound" },
          },
        },
        delete: {
          tags: ["Tasks"],
          summary: "Xóa task theo id",
          description: "Xóa vĩnh viễn một task theo MongoDB ObjectId.",
          operationId: "deleteTask",
          responses: {
            "200": {
              description: "Task đã bị xóa.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/DeleteTaskResponse" },
                  examples: {
                    deleted: {
                      summary: "Xóa thành công",
                      value: { message: "Task deleted successfully" },
                    },
                  },
                },
              },
            },
            "404": { $ref: "#/components/responses/NotFound" },
            "500": { $ref: "#/components/responses/InternalServerError" },
          },
        },
      },
      "/api/tasks/{id}/status": {
        post: {
          tags: ["Tasks"],
          summary: "Cập nhật trạng thái task",
          description:
            "Cập nhật trạng thái task theo business rules:\n" +
            "- `TODO` có thể chuyển thành `IN_PROGRESS`.\n" +
            "- `IN_PROGRESS` có thể chuyển thành `DONE`.\n" +
            "- `DONE` không thể chuyển sang trạng thái khác.",
          operationId: "updateTaskStatus",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "MongoDB ObjectId của task.",
              schema: {
                type: "string",
                pattern: "^[0-9a-fA-F]{24}$",
                example: "64f2a6c8e3a5c9f0d1b23456",
              },
            },
          ],
          requestBody: {
            required: true,
            description: "Trạng thái mới cần chuyển đến.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateStatusRequest" },
                examples: {
                  inProgress: {
                    summary: "Chuyển sang IN_PROGRESS",
                    value: { status: "IN_PROGRESS" },
                  },
                  done: {
                    summary: "Chuyển sang DONE",
                    value: { status: "DONE" },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Task đã được chuyển trạng thái.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Task" },
                  examples: {
                    statusUpdated: {
                      summary: "Task sau khi chuyển trạng thái",
                      value: {
                        _id: "64f2a6c8e3a5c9f0d1b23456",
                        title: "Mua đồ",
                        description: "Mua sữa và bánh",
                        status: "IN_PROGRESS",
                        priority: "HIGH",
                        dueDate: "2026-08-20T00:00:00.000Z",
                        createdAt: "2026-08-01T12:00:00.000Z",
                        updatedAt: "2026-08-16T09:20:00.000Z",
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Dữ liệu không hợp lệ hoặc vi phạm business rules.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                  examples: {
                    missingStatus: {
                      summary: "Thiếu status",
                      value: { message: "Status is required" },
                    },
                    invalidTransition: {
                      summary: "Chuyển trạng thái không hợp lệ",
                      value: {
                        message: "Chuyển trạng thái không hợp lệ. Không thể chuyển từ DONE sang TODO",
                      },
                    },
                  },
                },
              },
            },
            "404": { $ref: "#/components/responses/NotFound" },
            "500": { $ref: "#/components/responses/InternalServerError" },
          },
        },
      },
    },
    components: {
      schemas: {
        TaskStatus: {
          type: "string",
          description: "Trạng thái task.",
          enum: ["TODO", "IN_PROGRESS", "DONE"],
          default: "TODO",
          example: "TODO",
        },
        TaskPriority: {
          type: "string",
          description: "Độ ưu tiên của task.",
          enum: ["LOW", "MEDIUM", "HIGH"],
          default: "MEDIUM",
          example: "MEDIUM",
        },
        Task: {
          type: "object",
          description: "Task trong hệ thống.",
          required: ["_id", "title", "status", "priority", "createdAt", "updatedAt"],
          properties: {
            _id: {
              type: "string",
              description: "MongoDB ObjectId.",
              example: "64f2a6c8e3a5c9f0d1b23456",
            },
            title: {
              type: "string",
              description: "Tiêu đề task.",
              example: "Mua đồ",
            },
            description: {
              type: "string",
              description: "Mô tả chi tiết task.",
              example: "Mua sữa và bánh",
            },
            status: { $ref: "#/components/schemas/TaskStatus" },
            priority: { $ref: "#/components/schemas/TaskPriority" },
            dueDate: {
              type: "string",
              format: "date-time",
              description: "Ngày hết hạn của task.",
              example: "2026-08-20T00:00:00.000Z",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Thời điểm tạo task.",
              example: "2026-08-01T12:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Thời điểm cập nhật task gần nhất.",
              example: "2026-08-01T12:00:00.000Z",
            },
          },
        },
        CreateTaskRequest: {
          type: "object",
          description: "Dữ liệu cần gửi khi tạo task.",
          required: ["title"],
          properties: {
            title: {
              type: "string",
              minLength: 1,
              description: "Tiêu đề task. Bắt buộc.",
              example: "Mua đồ",
            },
            description: {
              type: "string",
              description: "Mô tả chi tiết task.",
              example: "Mua sữa và bánh",
            },
            status: { $ref: "#/components/schemas/TaskStatus" },
            priority: { $ref: "#/components/schemas/TaskPriority" },
            dueDate: {
              type: "string",
              format: "date-time",
              description: "Ngày hết hạn của task.",
              example: "2026-08-20T00:00:00.000Z",
            },
          },
        },
        UpdateTaskRequest: {
          type: "object",
          description: "Các field có thể cập nhật. `createdAt` nếu gửi sẽ bị bỏ qua.",
          properties: {
            title: {
              type: "string",
              minLength: 1,
              description: "Tiêu đề task.",
              example: "Mua đồ Tết",
            },
            description: {
              type: "string",
              description: "Mô tả chi tiết task.",
              example: "Mua sữa, bánh và kẹo",
            },
            status: { $ref: "#/components/schemas/TaskStatus" },
            priority: { $ref: "#/components/schemas/TaskPriority" },
            dueDate: {
              type: "string",
              format: "date-time",
              description: "Ngày hết hạn của task.",
              example: "2026-08-25T00:00:00.000Z",
            },
          },
        },
        UpdateStatusRequest: {
          type: "object",
          required: ["status"],
          properties: {
            status: { $ref: "#/components/schemas/TaskStatus" },
          },
        },
        TaskListResponse: {
          type: "object",
          required: ["total", "page", "limit", "totalPages", "data"],
          properties: {
            total: {
              type: "integer",
              description: "Tổng số task khớp bộ lọc.",
              example: 123,
            },
            page: {
              type: "integer",
              description: "Trang hiện tại.",
              example: 1,
            },
            limit: {
              type: "integer",
              description: "Số task tối đa mỗi trang.",
              example: 10,
            },
            totalPages: {
              type: "integer",
              description: "Tổng số trang.",
              example: 13,
            },
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/Task" },
            },
          },
        },
        ErrorResponse: {
          type: "object",
          required: ["message"],
          properties: {
            message: {
              type: "string",
              description: "Thông báo lỗi.",
              example: "Task not found",
            },
          },
        },
        DeleteTaskResponse: {
          type: "object",
          required: ["message"],
          properties: {
            message: {
              type: "string",
              description: "Thông báo kết quả.",
              example: "Task deleted successfully",
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: "Dữ liệu đầu vào không hợp lệ hoặc vi phạm validation.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        NotFound: {
          description: "Task không tồn tại.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                notFound: {
                  summary: "Không tìm thấy task",
                  value: { message: "Task not found" },
                },
              },
            },
          },
        },
        InternalServerError: {
          description: "Lỗi máy chủ nội bộ.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                serverError: {
                  summary: "Lỗi server",
                  value: { message: "Internal server error" },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
