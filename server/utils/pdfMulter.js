const multer = require("multer");
const path = require("path");

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // Set the maximum file size to 500 MB
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".pdf") {
      cb(new Error("Unsupported file type! Only PDF files are allowed."), false);
      return;
    }

    cb(null, true);
  },
});

module.exports = upload;
