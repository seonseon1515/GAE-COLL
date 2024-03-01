const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//회원가입
//이메일, 카카오, 구글은 type으로 구분
exports.signup = async (req, res) => {
    const { email, type, user_name, password: pw, profile_img, thumb_img, selected_question, answer } = req.body;

    // 중복 검증 로직 추가하기

    if (type === "email") {
        //패스워드 암호화
        const password = await bcrypt.hash(String(pw), 11);

        const result = await User.create({
            email,
            password,
            type,
            user_name,
            selected_question,
            answer,
        });
        console.log(result);
        res.json(result);
    } else if (type === "kakao" || type === "google") {
        const result = await User.create({
            email,
            type,
            user_name,
            user_img: profile_img,
        });
        const token = jwt.sign({ id: result.id }, process.env.DEVEL_SECRET, { expiresIn: "1h" });
        res.json({ success: true, result, token });
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
            const token = jwt.sign({ id: loginResult.id }, process.env.DEVEL_SECRET, { expiresIn: "1h" });
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "비밀번호가 틀립니다" });
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
                const token = jwt.sign({ id: findUserResult.id }, process.env.DEVEL_SECRET, { expiresIn: "1h" });
                res.json({ success: true, token });
            } else {
                res.json({ success: true, findUserResult });
            }
        } else {
            res.json({ findUserResult });
        }
    } catch (error) {}
};

//유저 프로필 수정
exports.updateUser = async (req, res) => {
    const userId = req.userId;
    // console.log("여러개", userId);
    const { user_name } = req.body;
    console.log("유저네임 객체 ", user_name);
    try {
        const updatedResult = await User.update({ user_name }, { where: { id: userId } });
        console.log(updatedResult);
        if (updatedResult[0] === 1) {
            // update()메소드 : 성공하면 1 반환
            res.json({ success: true, message: "프로필 업데이트에 성공했습니다." });
        } else {
            res.json({ success: false, message: "일치하는 회원 정보가 없어 프로필 업데이트에 실패했습니다" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "서버 오류로 프로필 업데이트에 실패했습니다." });
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

        res.json({ success: true, message: "비밀번호가 성공적으로 업데이트되었습니다." });
    } catch (error) {
        res.status(500).json({ success: false, message: "서버 오류로 비밀번호 업데이트에 실패했습니다." });
    }
};

// 유저 이미지 파일 이름만 수정
exports.updateUserImage = async (req, res) => {
    const userId = req.userId;
    const { user_img } = req.body;

    try {
        const updatedResult = await User.update({ user_img: user_img }, { where: { id: userId } });
        if (updatedResult[0] === 1) {
            res.json({ success: true, message: "이미지 업데이트에 성공했습니다." });
        } else {
            res.json({ success: false, message: "일치하는 회원 정보가 없어 이미지 업데이트에 실패했습니다" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "서버 오류로 이미지 업데이트에 실패했습니다." });
    }
};
