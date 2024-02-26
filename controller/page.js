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
exports.header = (req, res) => {
    res.render('common/header');
};
exports.projectheader = (req, res) => {
    res.render('project/header');
};
exports.project = (req, res) => {
    res.render('project/home');
};
