const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//회원가입
//이메일, 카카오, 구글은 type으로 구분
exports.signup = async (req, res) => {
    const { email, type, user_name, password: pw, profile_img, thumb_img, selected_question, answer } = req.body;

    // 중복 검증 로직 추가하기

    try {
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
            const token = jwt.sign({ id: result.id }, process.env.DEVEL_SECRET, { expiresIn: '1h' });
            res.json({ success: true, result, token });
        }
    } catch (error) {
        res.json(console.log(error));
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
            res.json({ success: false, message: error });
        }
    } catch (error) {
        res.json(error);
    }
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
    } catch (error) {
        res.json(error);
    }
};

//유저 프로필조회
exports.getUserInfo = async (req, res) => {
    const userId = req.userId;
    console.log('유저프로필 조회', userId);
    try {
        const getUserInfoRes = await User.findOne({ where: { id: Number(userId) } });
        res.json({ getUserInfoRes });
    } catch (error) {
        res.json(error);
    }
};

//유저 프로필 수정
exports.updateUser = async (req, res) => {
    const userId = req.userId;
    // console.log("여러개", userId);
    const { user_name } = req.body;
    console.log('유저네임 객체 ', user_name);
    try {
        const updatedResult = await User.update({ user_name }, { where: { id: userId } });
        console.log(updatedResult);
        if (updatedResult[0] === 1) {
            // update()메소드 : 성공하면 1 반환
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        res.json({ success: false, result: error });
    }
};

// 유저 비밀번호 수정
exports.updatePassword = async (req, res) => {
    const userId = req.userId;
    const { password } = req.body;

    try {
        // 새로운 비밀번호 해싱
        const hashedNewPassword = await bcrypt.hash(password, 11);
        await User.update({ password: hashedNewPassword }, { where: { id: userId } });
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};

// 유저 이미지 파일 이름만 수정
exports.updateUserImage = async (req, res) => {
    const userId = req.userId;
    const { user_img } = req.body;

    try {
        const updatedResult = await User.update({ user_img: user_img }, { where: { id: userId } });
        if (updatedResult[0] === 1) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
