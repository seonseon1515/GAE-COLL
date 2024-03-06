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
function getProjectId() {
    const names = prompt("추가할 멤버의 사용자 아이디를 쉼표로 구분하여 입력하세요.");
    return names.split(",").map((name) => name.trim());
}

async function addMember() {
    const projectId = getProjectId();
    let token = localStorage.getItem("token");
    let memberIds = [];
    try {
        const response = await axios({
            method: "POST",
            url: "/api/project/add/member",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                project_id: projectId,
                member_id: memberIds,
            },
        });
        console.log(response);
        const { success, result } = response.data;
        if (success) {
            console.log("회원 추가 성공:", result);
        } else {
            console.log(response);
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

        let token = localStorage.getItem("token");
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
