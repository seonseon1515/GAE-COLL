window.onload = function () {
    var editIcons = document.querySelectorAll('.edit-icon');
    var deleteIcons = document.querySelectorAll('.delete-icon');

    for (var i = 0; i < editIcons.length; i++) {
        editIcons[i].addEventListener('click', function () {
            var parentLi = this.closest('li');
            var textElement = parentLi.querySelector('.text-element');

            var newText = prompt('새로운 텍스트를 입력하세요', textElement.textContent);
            if (newText != null && newText != '') {
                textElement.textContent = newText;
            }
        });

        deleteIcons[i].addEventListener('click', function () {
            var parentLi = this.closest('li');
            parentLi.remove();
        });
    }
};

/*파일 업로드*/
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
