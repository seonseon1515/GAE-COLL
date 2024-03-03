<<<<<<< HEAD
window.onload = function () {
    var codeImg = document.getElementById('code-img');
    var codeCon = document.getElementById('code-con');

    // 페이지가 로드되면 visibility와 opacity 값을 명시적으로 설정해줍니다.
    codeCon.style.visibility = 'hidden';
    codeCon.style.opacity = '0';

    codeImg.addEventListener('click', function () {
        if (codeCon.style.visibility === 'hidden') {
            codeCon.style.visibility = 'visible';
            codeCon.style.opacity = '1';
        } else {
            codeCon.style.visibility = 'hidden';
            codeCon.style.opacity = '0';
        }
    });
};

// upload.js
document.addEventListener('DOMContentLoaded', function () {
    // 파일 업로드 버튼과 파일 이름 표시 영역에 대한 참조를 가져옵니다.
    var uploadBtns = document.querySelectorAll('.file-plus');
    var fileNameDisplays = [
        document.getElementById('plan-file-name'),
        document.getElementById('each-file-name'),
        // 필요한 만큼 id를 추가해주세요.
    ];

    uploadBtns.forEach(function (btn, index) {
        var fileInput = document.createElement('input');
        fileInput.type = 'file'; // input 요소를 파일 선택 요소로 만듭니다.

        // 파일 업로드 버튼을 클릭하면 파일 선택창이 뜨도록 설정합니다.
        btn.onclick = function () {
            fileInput.click(); // 실제 파일 선택 창을 열습니다.
        };

        // 파일을 선택하면 그 정보를 화면에 표시합니다.
        fileInput.onchange = function () {
            var file = this.files[0];

            // 파일의 이름을 해당하는 div에 추가합니다.
            var existingText = fileNameDisplays[index].textContent;
            fileNameDisplays[index].textContent = existingText + '\n선택된 파일: ' + file.name;
        };
    });
});
=======
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
>>>>>>> 2dc8371439c5f63c973f92999bd0f4f9284f156d
