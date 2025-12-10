import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const deleteFile = (fileName) => {
  try {
    const filePath = path.join(__dirname, "..", fileName);
    if (fs.existsSync(filePath) && fileName !== "uploads/default-avatar.png") {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error("Xóa ảnh cũ thất bại:", err.message);
  }
};
