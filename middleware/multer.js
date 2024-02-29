const multer = require('multer');
const path = require('path');

exports.uploadDetail = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, './public/uploads');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext).replace(' ', '') + Date.now() + ext);
        },
    }),
    //파일사이즈 5MB제한
    limits: { fileSize: 5 * 1024 * 1024 },
});
