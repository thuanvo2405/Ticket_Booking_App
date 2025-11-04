import path from "path";
import fs from "fs";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads";

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    );
  },
});

const fileFilter = function (req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg" || ext === ".png" || ext === ".mp4") {
    cb(null, true);
  } else {
    cb(new Error("Your files is invalid"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
