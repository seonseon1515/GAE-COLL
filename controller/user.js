const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//회원가입
//이메일, 카카오, 구글은 type으로 구분
exports.signup = async (req, res) => {
    const { email, type, user_name, password: pw, profile_img, thumb_img } = req.body;

    if (type === 'email') {
        //패스워드 암호화
        const password = await bcrypt.hash(String(pw), 11);

        const result = await User.create({
            email,
            password,
            type,
            user_name,
        });
        console.log(result);
        res.json(result);
    } else if (type === 'kakao' || type === 'google') {
        const result = await User.create({
            email,
            type,
            user_name,
            user_img: profile_img,
        });
        console.log(result);
        res.json(result);
    }
};

//이메일 로그인
exports.loginEmail = async (req, res) => {
    const { email, password: pw } = req.body;

    try {
        const loginResult = await User.findOne({
            where: { email },
        });
        const password = await bcrypt.compare(pw, loginResult.password);
        //비밀번호 일치시
        if (password) {
            //jwt토큰 발행
            const token = jwt.sign({ id: loginResult.id }, process.env.DEVEL_SECRET, { expiresIn: '1h' });
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: '비밀번호가 틀립니다' });
        }

        res.json(loginResult);
    } catch (error) {}
};

//유저이메일을 이용한 유저조회
exports.findUser = async (req, res) => {
    const { email, isSignup } = req.body;
    try {
        const findUserResult = await User.findOne({
            where: { email },
        });
        console.log(findUserResult);
        if (findUserResult) {
            if (isSignup) {
                const token = jwt.sign({ id: findUserResult.id }, process.env.DEVEL_SECRET, { expiresIn: '1h' });
                res.json({ success: true, token });
            } else {
                res.json({ success: true, findUserResult });
            }
        } else {
            res.json({ findUserResult });
        }
    } catch (error) {}
};
