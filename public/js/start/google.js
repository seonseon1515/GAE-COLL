const GOOGLE_CLIENT_ID = '629071446303-beeb31pu6l2t8003h4lt42mcp01sc5au.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const GOOGLE_REDIRECT_URI = 'http://localhost:8000/start/google';

(async function () {
    const token = document.location.href.split('access_token=')[1].split('&token')[0];
    console.log(token);

    const res = await axios({
        method: 'get',
        url: 'www.googleapis.com',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    console.log(res);
})();
