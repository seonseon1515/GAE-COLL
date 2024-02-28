const { User } = require('../models');

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
    } else if (type === 'kakao' || type === 'google') {
        const result = await User.create({
            email,
            type,
            user_name,
            user_img: profile_img,
        });
        console.log(result);
    }
    res.json({});
};
