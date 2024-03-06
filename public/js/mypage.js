//첫 팝업(비밀번호 변경, 로그아웃, 회원 탈퇴가 있는 팝업 띄우는 코드)
(async function () {
    //첫화면에 userInfo불러와서 띄워주기
    const token = localStorage.getItem("token");
    const getUserProfileResult = await axios({
        method: "post",
        url: "/api/user/info",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const { success, result } = getUserProfileResult.data;
    console.log(getUserProfileResult);

    if (success) {
        document.getElementById("useremail").textContent = result.email;
        result.user_name === ""
            ? (document.getElementById("username").placeholder = "이름을 입력해주세요")
            : (document.getElementById("username").value = result.user_name);
        console.log(`../../public/uploads/profile/${result.user_img}`);
        console.log(result.type);
        if (result.type === "email") {
            result.user_img === null
                ? (document.getElementById("profileImageDisplay").src = `../../public/img/user-solid.svg`)
                : (document.getElementById(
                      "profileImageDisplay"
                  ).src = `../../public/uploads/profile/${result.user_img}`);
        }
        if (result.type === "google" || result.type === "kakao") {
            document.getElementById("changePW").classList.add("hidden");
            result.user_img === null
                ? (document.getElementById("profileImageDisplay").src = `../../public/img/user-solid.svg`)
                : (document.getElementById("profileImageDisplay").src = `${result.user_img}`);
        }
    }
})();
function showPopup() {
    document.getElementById("popup").style.display = "flex";
}

function showPwdPopup() {
    document.getElementById("pwdPopup").style.display = "flex";
}

function showLogoutPopup() {
    document.getElementById("logoutPopup").style.display = "block";
}

function showDeletePopup() {
    document.getElementById("deletePopup").style.display = "block";
}
function closeAllPopups() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("pwdPopup").style.display = "none";
}
function closePwdPopup() {
    document.getElementById("pwdPopup").style.display = "none";
}
function closePopup() {
    document.getElementById("popup").style.display = "none";
}

async function deleteUser() {
    const token = localStorage.getItem("token");

    var writePwd = document.getElementById("writePwd").value;
    try {
        const checked = await axios({
            method: "POST",
            url: "/api/user/check/pw",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                password: writePwd,
            },
        });
        console.log(checked);
        if (!checked.data.success) {
            alert("비밀번호가 일치 하지 않습니다.");
            return;
        }

        var deleteConfirm = confirm("회원 탈퇴하시겠습니까?");
        if (!deleteConfirm) {
            return;
        }
        const deleted = await axios({
            method: "DELETE",
            url: "/api/user/drop",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(deleted);
        if (deleted.data.success) {
            localStorage.removeItem("token");
            window.location.href = "/start";
        }
    } catch (error) {
        console.error("회원 x", error);
    }
    alert("회원 탈퇴에 실패하였습니다");
}

//비밀번호 변경
async function updatePassword() {
    var currentPwd = document.getElementById("currentPwd").value;
    var newPwd = document.getElementById("newPwd").value;
    var confirmPwd = document.getElementById("confirmPwd").value;
    const token = localStorage.getItem("token");

    if (newPwd !== confirmPwd) {
        alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        return;
    }

    try {
        const response = await axios({
            method: "PATCH",
            url: "/api/user/update/pw",
            data: {
                password: newPwd,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response);
        const { success, result } = response.data;
        if (response.data.success) {
            alert("비밀번호가 성공적으로 변경되었습니다.");
        } else {
            alert("비밀번호 변경에 실패했습니다: " + result);
        }
    } catch (error) {
        console.error(error);
        alert("비밀번호 변경 중 오류가 발생했습니다.");
    }
}
//로그 아웃
function showLogoutPopup() {
    var logoutConfirm = confirm("로그아웃 하시겠습니까?");
    if (logoutConfirm) {
        // 로컬 스토리지에서 토큰 삭제
        localStorage.removeItem("token");
        localStorage.removeItem("save");
        // 현재 페이지를 새로고침 또는 로그인 페이지로 리다이렉트
        window.location.href = "/start";
    }
}

//이름, profile 수정
async function changeProfile(e) {
    e.preventDefault();
    const newName = document.getElementById("username").value;
    const file = document.querySelector("#user_img");
    const token = localStorage.getItem("token");

    let imgFormData = new FormData();
    for (let i = 0; i < file.files.length; i++) {
        imgFormData.append("user_img", file.files[i]);
    }

    try {
        const nameChangeResult = await axios({
            method: "PATCH",
            url: "/api/user/update/info",
            data: {
                user_name: newName,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const { success, result } = nameChangeResult.data;
        if (success) {
            alert("이름 변경이 완료되었습니다");
            console.log("이름 변경 성공");
        } else {
            alert("이름 변경에 실패했습니다: " + result);
            console.log("이름 변경 실패");
        }
        const imgChangeResult = await axios({
            method: "PATCH",
            url: "/api/user/update/profileimg",
            data: imgFormData,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });

        if (imgChangeResult.data.success) {
            alert("프로필 변경이 완료되었습니다");
            console.log("이미지 업로드 성공");
        } else {
            alert("프로필 변경이 실패했습니다");
            console.log("이미지 업로드 실패");
        }
    } catch (error) {
        console.error("수정 하는 중 오류 발생 : ", error);
    }
}
//profile 이미지 미리 보기
function preview(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("profileImageDisplay").src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}
