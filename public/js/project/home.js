//project overview 수정
let token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzA5NzE4OTE2LCJleHAiOjE3MDk4MDUzMTZ9.LYcuStdk6-yhIGhkji6LgcAMkg_Xgdu924M7ZvvuTtE";
let projectId = "project ID";

async function changeOverview() {
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
            console.log("Overview updated:", result);
        } else {
            console.error("Failed to update overview");
        }
    } catch (error) {
        console.error("Error while updating overview:", error);
    }
}

//member 추가
function getMemberIds() {
    const ids = prompt("추가할 멤버 ID를 쉼표로 구분하여 입력하세요.");
    return ids.split(",").map((id) => id.trim());
}

async function addMember() {
    const memberId = getMemberIds();
    const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzA5NzE4OTE2LCJleHAiOjE3MDk4MDUzMTZ9.LYcuStdk6-yhIGhkji6LgcAMkg_Xgdu924M7ZvvuTtE";
    try {
        const response = await axios({
            method: "POST",
            url: "/api/project/add/member",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                project_id: projectId,
                member_id: memberId,
            },
        });
        console.log(response);
        const { success, result } = response.data;
        if (success) {
            console.log("회원 추가 성공:", result);
        } else {
            console.log("회원 추가 실패");
        }
    } catch (error) {
        console.error("회원 추가 중 에러 발생:", error);
    }
}
//project 규칙 추가
window.onload = function () {
    const lis = document.querySelectorAll("#rule-list .li");
    lis.forEach((li) => {
        const textElement = li.querySelector(".text-element");
        const input = document.createElement("input");
        input.type = "text";
        input.style.display = "none";
        input.onkeydown = function (event) {
            if (event.key !== "Enter") return;
            textElement.textContent = input.value;
            input.style.display = "none";
            textElement.style.display = "";
        };
        li.insertBefore(input, textElement);

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
    input.onkeydown = async function (event) {
        if (event.key !== "Enter") return;
        textElement.textContent = input.value;
        textElement.style.display = "";
        input.style.display = "none";
        const rule = input.value;

        const token =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzA5NzE4OTE2LCJleHAiOjE3MDk4MDUzMTZ9.LYcuStdk6-yhIGhkji6LgcAMkg_Xgdu924M7ZvvuTtE";
        let projectId = "project ID";
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

    const ruleIcon = document.createElement("span");
    ruleIcon.className = "rule-icon";

    const editIcon = document.createElement("img");
    editIcon.src = "../../public/img/edit-right.jpg";
    editIcon.className = "rule-img edit-icon";
    editIcon.onclick = function () {
        input.value = textElement.textContent;
        input.style.display = "";
        textElement.style.display = "none";
        input.focus();
    };

    const deleteIcon = document.createElement("img");
    deleteIcon.src = "../../public/img/trash.png";
    deleteIcon.className = "rule-img delete-icon";
    deleteIcon.onclick = function () {
        li.parentNode.removeChild(li);
    };

    ruleIcon.appendChild(editIcon);
    ruleIcon.appendChild(deleteIcon);

    li.appendChild(input);
    li.appendChild(textElement);
    li.appendChild(ruleIcon);
    list.appendChild(li);
    input.focus();
}

/*파일 업로드*/
// upload.js
document.addEventListener("DOMContentLoaded", function () {
    // 파일 업로드 버튼과 파일 이름 표시 영역에 대한 참조를 가져옵니다.
    var uploadBtns = document.querySelectorAll(".file-plus");
    var fileNameDisplays = [
        document.getElementById("plan-file-name"),
        document.getElementById("each-file-name"),
        // 필요한 만큼 id를 추가해주세요.
    ];

    uploadBtns.forEach(function (btn, index) {
        var fileInput = document.createElement("input");
        fileInput.type = "file"; // input 요소를 파일 선택 요소로 만듭니다.

        // 파일 업로드 버튼을 클릭하면 파일 선택창이 뜨도록 설정합니다.
        btn.onclick = function () {
            fileInput.click(); // 실제 파일 선택 창을 열습니다.
        };

        // 파일을 선택하면 그 정보를 화면에 표시합니다.
        fileInput.onchange = function () {
            var file = this.files[0];

            // 파일의 이름을 해당하는 div에 추가합니다.
            var existingText = fileNameDisplays[index].textContent;
            fileNameDisplays[index].textContent = existingText + "\n선택된 파일: " + file.name;
        };
    });
});
