const multer = require('multer');
const path = require('path');


const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'video/mp4': 'mp4',
  'video/avi': 'avi',
  'video/mov': 'mov',
  'video/mkv': 'mkv',
  'video/wmv': 'wmv',
  'video/flv': 'flv',
  'video/webm': 'webm',
  'video/ogg': 'ogg',
  'video/3gp': '3gp',
  'video/3g2': '3g2',
  'video/mpeg': 'mpeg',
  'video/quicktime': 'quicktime',
  'video/x-msvideo': 'x-msvideo',
  'video/x-ms-wmv': 'x-ms-wmv',
  'video/x-flv': 'x-flv',
  'video/x-matroska': 'x-matroska',
  'video/x-m4v': 'x-m4v',
  'video/x-mng': 'x-mng',
  'video/x-ms-asf': 'x-ms-asf',
  'video/x-ms-wmx': 'x-ms-wmx',
  'video/x-ms-wvx': 'x-ms-wvx',
  'video/x-sgi-movie': 'x-sgi-movie',
  'application/pdf': 'pdf',
  'application/msword': 'msword',
};

const storage = multer.diskStorage({
  
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '../media'));
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({ storage: storage }).fields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 5 },
  { name: 'pdfs', maxCount: 5 },
  { name: 'others', maxCount: 5 },
]);