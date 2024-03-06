const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { smtpTransport } = require("../config/email");

//회원가입
//이메일, 카카오, 구글은 type으로 구분
exports.signup = async (req, res) => {
    const { email, type, user_name, password: pw, profile_img, thumb_img, selected_question, answer } = req.body;

    try {
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
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
//이메일 인증
exports.emailAuth = async (req, res) => {
    const number = generateRandomNumber(111111, 999999);

    const { email } = req.body; //사용자가 입력한 이메일

    const mailOptions = {
        from: process.env.SMTP_ID, // 발신자 이메일 주소.
        to: email, //사용자가 입력한 이메일 -> 목적지 주소 이메일
        subject: " GAE-COLL 인증 관련 메일 입니다. ",
        html: `<h3 style="padding-top:10px;">GAE-COLL 이메일 인증</h3>
        <div>안녕하세요 GAE-COLL 회원가입을 위한 이메일 인증번호를 안내해드립니다.</div> 
        <div>아래 번호를 입력하여 인증 절차를 완료해 주세요.</div>
       <div style="margin:5px 5px 5px 0;"><span style="background-color:lightgray; padding:5px;">인증번호 : <span style="font-weight:bold;">${number}\n</span></span></div>
        <img src='https://kdt11-hk-test.s3.ap-northeast-2.amazonaws.com/logo.png' width="300px"/>`,
    };
    smtpTransport.sendMail(mailOptions, (err, response) => {
        console.log("response", response);
        //첫번째 인자는 위에서 설정한 mailOption을 넣어주고 두번째 인자로는 콜백함수.
        if (err) {
            res.json({ success: false, result: { message: " 메일 전송에 실패하였습니다. " } });
            smtpTransport.close(); //전송종료
            return;
        } else {
            res.json({ success: true, result: { message: " 메일 전송에 성공하였습니다. ", authNum: number } });
            smtpTransport.close(); //전송종료
            return;
        }
    });
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
            res.json({ success: false, message: error });
        }
    } catch (error) {
        res.json({ success: false, result: error });
    }
};

//유저이메일을 이용한 유저조회
exports.findUser = async (req, res) => {
    const { email, isSignup } = req.body;
    try {
        const findUserResult = await User.findOne({
            where: { email },
        });

        if (findUserResult) {
            if (isSignup) {
                const token = jwt.sign({ id: findUserResult.id }, process.env.DEVEL_SECRET, { expiresIn: "1h" });
                res.json({ success: true, token });
            } else {
                res.json({ success: true, findUserResult });
            }
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, result: error });
    }
};

//유저 프로필조회
exports.getUserInfo = async (req, res) => {
    const userId = req.userId;
    console.log("유저프로필 조회", userId);
    try {
        const getUserInfoRes = await User.findOne({ where: { id: Number(userId) } });
        res.json({ success: true, result: getUserInfoRes });
    } catch (error) {
        res.json({ success: false, result: error });
    }
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

const generateRandomNumber = function (min, max) {
    var randNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randNum;
};
