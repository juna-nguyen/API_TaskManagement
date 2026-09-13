require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://fe-task-management-ba3s.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Cho phép request không có origin (Postman, mobile app, curl, v.v.)
      if (!origin) return callback(null, true);

      // Cho phép danh sách origin cố định hoặc preview branch Vercel (nếu cần)
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/fe-task-management.*\.vercel\.app$/.test(origin);

      if (isAllowed) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(express.json());
app.get("/", (req, res) => {
  res.send("API Task Management đang hoạt động...");
});
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true }),
);
app.get("/swagger.json", (req, res) => {
  res.json(swaggerSpec);
});

const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server đang chạy tại cổng ${PORT}`);
});
