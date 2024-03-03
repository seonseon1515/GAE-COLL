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
