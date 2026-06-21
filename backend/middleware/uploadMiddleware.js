// ============================================
// ARAB UNITY SCHOOL
// Upload Middleware using Multer
// Supports PDF, DOCX, PPTX, JPG, PNG, WEBP
// ============================================

const multer = require("multer");
const path = require("path");

// Storage location and filename format
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// Allowed file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    // Documents
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",

    // Images
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only PDF, DOCX, PPTX, JPG, PNG, and WEBP files are allowed"),
      false
    );
  }
};

// Max file size: 20MB per file
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

module.exports = upload;