const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header) {
        //header가 존재하지 않을 때(클라이언트 인증 오류)
        return res.status(401).json({ success: false });
    }

    const [_, token] = header.split(' ');

    //jwt인증
    jwt.verify(token, process.env.DEVEL_SECRET, (error, decode) => {
        if (error) {
            // 403 : 권한없음
            return res.status(403).json({ success: false });
        }
        req.userId = decode;
        next();
    });
};
