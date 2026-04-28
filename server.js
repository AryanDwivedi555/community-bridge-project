import express from 'express';
import cors from 'cors';

const app = express();
const port = 4000;

app.use(cors()); // Allows your frontend to talk to this server
app.use(express.json());

// --- YOUR ROUTES GO HERE ---
app.get("/api/test", (req, res) => {
  res.json({ message: "Grid Uplink Established" });
});

// --- TACTICAL BACKEND: GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error("NATIONAL GRID CRITICAL FAILURE:");
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: err.message || "Unexpected tactical condition.",
    stack: process.env.NODE_ENV === 'development' ? err.stack : 'REDACTED'
  });
});

app.listen(port, () => {
  console.log(`Tactical Backend running at http://localhost:${port}`);
});
