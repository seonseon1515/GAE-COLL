//project overview 수정
let token = localStorage.getItem("token");
let projectId = localStorage.getItem("project_id");
async function changeOverview(e) {
    const text = document.getElementById("overview-text");
    const input = document.getElementById("overview-input");
    input.style.display = "inline";
    input.value = text.textContent;
    text.style.display = "none";
    input.focus();
}

async function saveOverview(event) {
    if (event.key !== "Enter") return;
    const text = document.getElementById("overview-text");
    const input = document.getElementById("overview-input");
    text.textContent = input.value;
    text.style.display = "inline";
    input.style.display = "none";

    try {
        const response = await axios({
            method: "PATCH",
            url: "/api/project/update/overview",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                project_id: projectId,
                overview: input.value,
            },
        });
        console.log(response);
        const { success, result } = response.data;
        if (success) {
            console.log("Overview 업데이트에 성공하셨습니다. :", result);
        } else {
            console.error("overview 업데이트에 실패하셨습니다.");
        }
    } catch (error) {
        console.error("overview 업데이트 도중 오류가 발생하였습니다. :", error);
    }
}

//member 추가

function changeOverview() {
    const userId = prompt("추가할 멤버의 아이디를 입력하세요.");
    if (userId) {
        // 입력한 아이디를 localStorage에 저장
        localStorage.setItem("userId", userId);
    }
}

async function addMember() {
    let projectId = "REAL_PROJECT_ID"; // 실제 프로젝트 ID로 변경
    let token = localStorage.getItem("token");
    let memberIds = [];

    // localStorage에서 아이디를 가져옴
    const userId = localStorage.getItem("userId");
    if (userId) {
        // 사용자 아이디가 존재하는지 확인
        const user = await checkUserId(userId);
        if (user) {
            memberIds.push(user.id); // 데이터베이스에 존재하는 사용자의 아이디를 memberIds 배열에 추가

            // 사용자 이름을 화면에 추가
            const userNameDiv = document.getElementById("overview-main");
            userNameDiv.innerHTML = `
                <div id="pro-img-div">
                    <img src="../../public/img/mypage.png" id="pen-img" />
                </div>
                ${user.name} // user 객체에서 사용자 이름을 가져옴
            `;
        } else {
            console.log(`아이디 ${userId}은 존재하지 않습니다.`);
            return;
        }
    } else {
        console.log("유효한 아이디를 입력하세요");
        alert("유효한 아이디를 입력하세요");
        return;
    }

    try {
        const response = await axios({
            method: "POST",
            url: "/api/project/add/member",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                project_id: projectId,
                member_id: memberIds[0], // 첫 번째 멤버의 ID만 전송
            },
        });
        console.log(response);
        const { success, result } = response.data;
        if (success) {
            console.log("회원 추가 성공", result);
        } else {
            console.log(response);
            console.log("회원 추가 실패");
        }
    } catch (error) {
        console.error("회원 추가 중 에러 발생", error);
    }
}

//project 규칙 추가
function attachEventHandlers(li) {
    const textElement = li.querySelector(".text-element");
    const input = li.querySelector("input");

    input.onkeydown = function (event) {
        if (event.key !== "Enter") return;
        textElement.textContent = input.value;
        input.style.display = "none";
        textElement.style.display = "";
    };

    const editIcon = li.querySelector(".edit-icon");
    editIcon.onclick = function () {
        input.value = textElement.textContent;
        input.style.display = "";
        textElement.style.display = "none";
        input.focus();
    };

    const deleteIcon = li.querySelector(".delete-icon");
    deleteIcon.onclick = function () {
        li.parentNode.removeChild(li);
    };
}

window.onload = function () {
    const lis = document.querySelectorAll("#rule-list .li");
    lis.forEach((li) => {
        attachEventHandlers(li);
    });
};

async function projectRuleGeneration() {
    const list = document.getElementById("rule-list");
    const li = document.createElement("li");
    li.className = "li";

    const textElement = document.createElement("span");
    textElement.className = "text-element";
    textElement.style.display = "none";

    const input = document.createElement("input");
    input.type = "text";

    const ruleIcon = document.createElement("span");
    ruleIcon.className = "rule-icon";

    const editIcon = document.createElement("img");
    editIcon.src = "../../public/img/edit-right.jpg";
    editIcon.className = "rule-img edit-icon";

    const deleteIcon = document.createElement("img");
    deleteIcon.src = "../../public/img/trash.png";
    deleteIcon.className = "rule-img delete-icon";

    ruleIcon.appendChild(editIcon);
    ruleIcon.appendChild(deleteIcon);

    li.appendChild(input);
    li.appendChild(textElement);
    li.appendChild(ruleIcon);
    list.appendChild(li);

    attachEventHandlers(li);
    input.focus();

    // 이하에는 서버에 규칙을 추가하는 로직이 들어가야 합니다.
    input.onkeydown = async function (event) {
        if (event.key !== "Enter") return;

        const rule = input.value;

        let token = localStorage.getItem("token");
        let projectId = "project ID"; // 실제 프로젝트 ID로 변경해야 합니다.
        try {
            const response = await axios({
                method: "PATCH",
                url: "/api/project/update/rule",
                data: {
                    rule,
                    project_id: projectId,
                },
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response);
            const { success, result } = response.data;
            if (success) {
                console.log("규칙 추가 성공 : ", result);
            } else {
                console.log("규칙 추가 실패");
            }
        } catch (error) {
            console.log("규칙 추가 중 에러 발생 : ", error);
        }
    };
}

/*파일 업로드*/
// upload.js
window.onload = function () {
    document.getElementById("uploadBtn").addEventListener("click", function () {
        document.getElementById("fileInput").click();
    });
};
document.getElementById("fileInput").addEventListener("click", async function (e) {
    const file = e.target.files[0];
    const fileContainers = document.querySelectorAll(".api-file-contain");

    let targetDiv;
    for (let i = 0; i < fileContainers.length; i++) {
        if (!fileContainers[i].querySelector(".api-file-name").textContent) {
            targetDiv = fileContainers[i].querySelector(".api-file-name");
            break;
        }
    }

    if (targetDiv) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("project_id", "your_project_id");
        formData.append("type", "erd");
        formData.append("project_files", "your_project_files");

        let token = localStorage.getItem("token");

        try {
            const response = await axios({
                method: "PATCH",
                url: "/api/project/update/file",
                data: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response);
            const { success, result } = response.data;
            if (result) {
                console.log("File uploaded successfully");
                targetDiv.textContent = name;
            } else {
                console.log("Failed to upload file");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    } else {
        console.log("All divs are filled. Please add more divs.");
    }
});
