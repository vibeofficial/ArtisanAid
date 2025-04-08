const fs = require('fs');
const path = require('path');
const multer = require('multer');

const pdfDir = path.join(__dirname, '../docs');
if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir, { recursive: true });
  console.log('Directory "docs" created.');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pdfDir);
  },
  filename: (req, file, cb) => {
    const randNum = Date.now().toString() + '_' + Math.round(Math.random() * 1E9);
    const ext = file.mimetype.split('/')[1];
    cb(null, `PDF_${randNum}.${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('application/pdf') && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format: Images and PDF Only'), false);
  }
};

const limits = {
  fileSize: 1024 * 1024 * 10
};

const uploads = multer({ storage, fileFilter, limits });

module.exports = uploads;