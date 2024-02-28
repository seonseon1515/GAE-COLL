window.addEventListener('scroll', function () {
    var footer = document.querySelector('footer');
    var footerTop = footer.getBoundingClientRect().top;
    var icon = document.getElementById('icon');
    var initialBottom = '15vw'; // icon의 초기 위치를 직접 지정합니다.

    if (footerTop <= window.innerHeight) {
        icon.style.bottom = window.innerHeight - footerTop + window.innerHeight * 0.01 + 'px'; // footer 위에서 1vw 멈추게 합니다.
    } else {
        icon.style.bottom = initialBottom; // 스크롤이 다시 올라갔을 때 icon의 위치를 초기 위치로 복원합니다.
    }
});
