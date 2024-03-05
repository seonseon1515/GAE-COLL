async function kakaoLogin() {
    document.location.href = "/auth/kakao";
}
function googleLogin() {
    document.location.href = `https://accounts.google.com/o/oauth2/v2/auth?scope=email profile&response_type=token&state=state_parameter_passthrough_value&redirect_uri=<%= process.env.GOOGLE_REDIRECT_URI%>&client_id=<%= process.env.GOOGLE_CLIENT_ID%>`;
}
