function showPopup() {
    document.getElementById('popup').style.display = 'flex';
}

function showPwdPopup() {
    document.getElementById('pwdPopup').style.display = 'block';
}

function showLogoutPopup() {
    document.getElementById('logoutPopup').style.display = 'block';
}

function showDeletePopup() {
    if (confirm('회원 탈퇴하시겠습니까?')) {
        document.getElementById('deletePopup').style.display = 'block';
    }
}

function closeAllPopups() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('pwdPopup').style.display = 'none';
    document.getElementById('logoutPopup').style.display = 'none';
    document.getElementById('deletePopup').style.display = 'none';
}
