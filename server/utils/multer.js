const multer = require("multer");
const path = require("path");

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // Set the maximum file size to 500 MB
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("Unsupported file type!"), false);
      return;
    }

    cb(null, true);
  },
});

module.exports = upload;
