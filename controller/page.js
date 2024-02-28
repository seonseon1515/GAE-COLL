exports.main = (req, res) => {
    res.render('main');
};
exports.start = (req, res) => {
    res.render('start/index');
};
exports.login = (req, res) => {
    res.render('start/login');
};
exports.signup = (req, res) => {
    res.render('start/signup');
};
exports.idFind = (req, res) => {
    res.render('start/idFind');
};
exports.pwFind = (req, res) => {
    res.render('start/pwFind');
};
exports.google = (req, res) => {
    res.render('start/google');
};
exports.kakao = (req, res) => {
    res.render('start/kakao');
};
exports.header = (req, res) => {
    res.render('common/header');
};
exports.projectheader = (req, res) => {
    res.render('project/header');
};
exports.project = (req, res) => {
    res.render('project/home');
};
exports.mypage = (req, res) => {
    res.render('mypage');
};
exports.board_write = (req, res) => {
    res.render('project/board_write');
};
exports.footer = (req, res) => {
    res.render('common/footer');
};
