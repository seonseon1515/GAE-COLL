const axios = require("axios");
const qs = require("qs");
const alertmove = require("../util/alert_move");

exports.main = (req, res) => {
    res.render("main");
};
exports.start = (req, res) => {
    res.render("start/index");
};
exports.login = (req, res) => {
    res.render("start/login");
};
exports.signup = (req, res) => {
    res.render("start/signup");
};
exports.idFind = (req, res) => {
    res.render("start/idFind");
};
exports.pwFind = (req, res) => {
    res.render("start/pwFind");
};
exports.google = (req, res) => {
    res.render("start/google");
};
exports.kakao = (req, res) => {
    res.render("start/kakao");
};
exports.kakaoLogin = (req, res) => {
    res.render("start/kakao_login");
};
exports.header = (req, res) => {
    res.render("common/header");
};
exports.projectheader = (req, res) => {
    res.render("project/header");
};
exports.project = (req, res) => {
    res.render("project/home");
};
exports.mypage = (req, res) => {
    res.render("mypage");
};
exports.board_write = (req, res) => {
    res.render("project/board_write");
};
exports.footer = (req, res) => {
    res.render("common/footer");
};
exports.board_main = (req, res) => {
    res.render("project/board_main");
};
exports.issue_write = (req, res) => {
    res.render("project/issue_write");
};
exports.issue = (req, res) => {
    res.render("project/issue_main");
};

exports.issue_content = (req, res) => {
    res.render("project/issue_content");
};

exports.issue_write = (req, res) => {
    res.render("project/issue_write");
};

exports.newProject = (req, res) => {
    res.render("project/newProject");
};
exports.calender = (req, res) => {
    res.render("project/calender");
};
exports.write = (req, res) => {
    res.render("project/issue_write");
};

const kakaoOpt = {
    clientId: process.env.KAKAO_CLIENT_ID,
    clientSecret: process.env.KAKAO_CLIENT_SECRET,
    redirectUri: process.env.KAKAO_REDIRECT_URI,
};
//카카오 로그인
exports.getKakaoAuth = async (req, res) => {
    const kakaoLoginURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoOpt.clientId}&redirect_uri=${kakaoOpt.redirectUri}&response_type=code`;
    res.redirect(kakaoLoginURL);
};

exports.getKakaoAuthCallback = async (req, res) => {
    console.log(req.query.code);
    let token;
    try {
        const url = "https://kauth.kakao.com/oauth/token";
        const body = qs.stringify({
            grant_type: "authorization_code",
            client_id: kakaoOpt.clientId,
            client_secret: kakaoOpt.clientSecret,
            redirectUri: kakaoOpt.redirectUri,
            code: req.query.code,
        });
        const header = { "content-type": "application/x-www-form-urlencoded" };
        const response = await axios.post(url, body, header);
        token = response.data.access_token;
        console.log("token", token);
        res.send(alertmove("/start/kakaoLogin", token));
    } catch (err) {
        console.log(err);
        console.log("에러1");
        res.send("에러1");
    }
};
