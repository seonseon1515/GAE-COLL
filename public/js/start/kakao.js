const code = document.location.href.split('code=')[1];
console.log(code);
(async function () {
    try {
        const getTokenRes = await axios({
            method: 'POST',
            url: 'https://kauth.kakao.com/oauth/token',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
            },
            data: {
                grant_type: 'authorization_code',
                client_id: process.env.KAKAO_CLIENT_ID,
                redirect_uri: process.env.KAKAO_REDIRECT_URI,
                code,
            },
        });

        const getUserInfoRes = await axios({
            method: 'GET',
            url: 'https://kapi.kakao.com/v2/user/me',
            headers: {
                Authorization: `Bearer ${getTokenRes.data['access_token']}`,
                'Content-type': 'application/x-www-form-urlencoded',
            },
        });

        const { email, name: user_name, profile } = getUserInfoRes.data.kakao_account;

        //회원가입 여부 확인
        const findUser = await axios({
            method: 'POST',
            url: '/api/user/find',
            data: {
                email,
                isSignup: true,
            },
        });

        //해당하는 email이 없으면 회원가입
        if (findUser.data === null) {
            const signupKakaoResult = await axios({
                method: 'POST',
                url: '/api/user/signup',
                data: {
                    email,
                    user_name,
                    type: 'kakao',
                    profile_img: profile.profile_image_url,
                    thumb_img: profile.thumbnail_image_url,
                },
            });
            console.log(signupKakaoResult);
        }
        //회원가입 또는 로그인 완료시 메인페이지로 이동
        document.location.href = '/';
    } catch (error) {}
})();
