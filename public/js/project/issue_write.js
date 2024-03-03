let box = document.querySelector('.code_box').style;

function open_box() {
    if (box.display == 'none') {
        box.display = 'block';
    } else {
        box.display = 'none';
        $('textarea').val('');
    }
}

$('.content_write').attr('span', '텍스트입력');

function resize(obj) {
    obj.style.height = '1px';
    obj.style.height = 1 + obj.scrollHeight + 'px';
}

window.onload = function () {
    target = document.getElementById('file_upload'); // file 아이디 선언
    target.addEventListener('change', function () {
        // change 함수

        if (target.value.length) {
            // 파일 첨부인 상태일경우 파일명 출력
            $('#origin_name').html(target.files[0].name);
        } else {
            //버튼 클릭후 취소(파일 첨부 없을 경우)할때 파일명값 안보이게
            $('#origin_name').html('');
        }
    });
};
