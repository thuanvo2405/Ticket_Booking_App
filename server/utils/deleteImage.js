import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const deleteFile = (fileName) => {
  try {
    const filePath = path.join(__dirname, "..", fileName);
    console.log(filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("Đã xóa ảnh cũ:", fileName);
    }
  } catch (err) {
    console.error("Xóa ảnh cũ thất bại:", err.message);
  }
};
