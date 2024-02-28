const { User } = require('../models');

//회원가입
//이메일, 카카오, 구글은 type으로 구분
exports.signup = async (req, res) => {
    const { email, type, user_name, password, profile_img, thumb_img } = req.body;

    if (type === 'email') {
        const result = await User.create({
            email,
            password: req.body.password,
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
    const { email, password } = req.body;

    try {
        const loginResult = await User.findOne({
            where: { email, password },
        });
        res.json(loginResult);
    } catch (error) {}
};

//유저이메일을 이용한 유저조회
exports.findUser = async (req, res) => {
    const { email } = req.body;
    try {
        const findUserResult = await User.findOne({
            where: { email },
        });
        res.json(findUserResult);
    } catch (error) {}
};
