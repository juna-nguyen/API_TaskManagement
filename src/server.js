require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());
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
