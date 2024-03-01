const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header) {
        //header가 존재하지 않을 때(클라이언트 인증 오류)
        return res.status(401).json({ success: false });
    }

    const [_, token] = header.split(" ");

    //jwt인증
    jwt.verify(token, process.env.DEVEL_SECRET, (error, decode) => {
        if (error) {
            // 403 : 권한없음
            return res.status(403).json({ success: false });
        }
        req.userId = decode.id;
        next();
    });
};

// 토큰 만료 로직 추가해봤습니다. 참고 부탁드립니다.
// const jwt = require("jsonwebtoken");

// exports.auth = (req, res, next) => {
//     try {
//         const header = req.headers.authorization;

//         if (!header) {
//           //header가 존재하지 않을 때(클라이언트 인증 오류)
//            return res.status(401).json({ success: false, message: "헤더에 토큰이 없습니다." });
//         }

//         const [_, token] = header.split(" ");

//         //jwt인증
//         jwt.verify(token, process.env.DEVEL_SECRET, (error, decoded) => {
//             if (error) {
//                 if (error.name === "TokenExpiredError") {
//                     return res.status(419).json({ success: false, message: "토큰이 만료되었습니다." });
//                 } else {
//                     return res.status(403).json({ success: false, message: "유효하지 않은 토큰입니다." });
//                 }
//             } else {
//                 req.userId = decoded.id;
//                 next();
//             }
//         });
//     } catch (err) {
//         return res.status(500).json({ success: false, message: "인증 오류가 발생했습니다." });
//     }
// };
