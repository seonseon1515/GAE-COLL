(async function () {
    try {
        const token = localStorage.getItem("token");
        localStorage.clear();
        const url = "https://kapi.kakao.com/v2/user/me";
        const Header = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(url, Header);

        const { email, name: user_name, profile } = response.data.kakao_account;
        console.log(email, user_name, profile);

        //회원가입 여부확인
        const findUser = await axios({
            method: "POST",
            url: "/api/user/find",
            data: {
                email,
                isSignup: true,
            },
        });

        //해당하는 email이 없으면 회원가입
        if (!findUser.data.success) {
            const signupKakaoResult = await axios({
                method: "POST",
                url: "/api/user/signup",
                data: {
                    email,
                    user_name,
                    type: "kakao",
                    profile_img: profile.profile_image_url,
                },
            });
            console.log(signupKakaoResult);
        }
        //회원가입 또는 로그인 완료시 메인페이지로 이동
        document.location.href = "/";
        //res.send(alertmove("/start/kakaoLogin", email, name, profile));
        //res.send(alertmove("/", `${user_name}님 로그인 되었습니다^^`));
    } catch (err) {
        console.log(err);
    }
})();
