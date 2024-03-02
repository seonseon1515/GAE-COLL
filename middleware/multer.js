const multer = require("multer");
const path = require("path");

exports.upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            if (file.filename === "user_img") {
                done(null, "./public/uploads/profile");
            } else if (file.filename === "project_img") {
                done(null, "./public/uploads/project");
            } else if (file.filename === "project_files") {
                done(null, "./public/uploads/project_file");
            } else if (file.filename === "issue_files") {
                done(null, "./public/uploads/issue");
            }
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext).replace(" ", "") + Date.now() + ext);
        },
    }),
    //파일사이즈 5MB제한
    limits: { fileSize: 5 * 1024 * 1024 },
});
