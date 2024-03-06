let authNum; //서버로부터 받은 이메일인증번호 저장하는 변수
let isChecked = false; // 이메일 인증했는지 확인하는 변수

window.identifyEmail = async function () {
    try {
        const email = document.getElementById('email').value;
        const identifyResult = await axios({
            method: 'POST',
            url: '/api/user/emailAuth',
            data: {
                email,
            },
        });
        console.log(identifyResult);
        const { success, result } = identifyResult.data;

        if (!success) {
            alert('이메일전송에 실패하였습니다.');
            return;
        }
    } catch (error) {
        console.error(error); // 에러 출력
    }
};

//이메일 인증번호 확인
function checkEmailNum() {
    //emailNumber : 사용자가 입력한 인증번호 가져오기
    const emailNumber = document.querySelector('#email-number').value;
    //==는 데이터 타입상관없이 data내용만 같은지 비교
    if (emailNumber == authNum) {
        alert('이메일 인증에 성공하였습니다.');
        isChecked = true;
    } else {
        alert('인증번호를 확인해주세요');
    }
}

//회원가입버튼눌렀을떄
/*

if(!isChecked){
    prompt("이메일 인증이 필요합니다.");
    return;
}
if(pw !== pwCheck){
    prompt("입력하신 비밀번호와 비밀번호확인이 일치하지 않습니다.");
    return;
}
 */
