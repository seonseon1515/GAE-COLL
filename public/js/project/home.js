// 프로젝트 규칙, 멤버 조회, project overview 조회
(async function loadProjectInfo() {
    const token = localStorage.getItem("token");

    try {
        const response = await axios({
            method: "POST",
            url: `/api/project/get/info`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response);
        const { success, result } = response.data;
        if (success) {
            document.getElementById("overview-text").textContent = result.overview;
            //document.getElementById("member-main").textContent =;
            const rule = JSON.parse(result.rule);
            console.log("프로젝트 규칙 : ", result.rule);

            for (let i = 0; i < rule.length; i++) {
                let html = document.createElement("html");
                html.innerHTML = `
                <li class="li" style = "background : white;">
                    <span class="text-element">${rule[i]}</span>
                    <span class="rule-icon">
                    <img src="../../public/img/trash.png" class="rule-img delete-icon" onclick="deleteProjectRule()"/>
                </span>
                </li>
                `;
                document.getElementById("rule-list").appendChild(html);
            }
        } else {
            console.error("API 요청 실패:", response.data);
        }
    } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
    }
})();

//파일 정보 조회
(async function () {
    const token = localStorage.getItem("token");
    const getProjectFile = await axios({
        method: "POST",
        url: "/api/project/get/file",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    console.log(getProjectFile);
    const { success, result } = getProjectFile.data;
    if (success) {
        document.getElementsByClassName("plan-file-contain").textContent = result.plan;
        document.getElementsByClassName("erd-file-contain").textContent = result.erd;
        document.getElementsByClassName("api-file-contain").textContent = result.api;
    }
})();

//이슈 노트
(async function () {
    const token = localStorage.getItem("token");
    try {
        const response = await axios({
            method: "GET",
            url: "/api/project/issue",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response);
        const { success, result } = response.data;
        if (success) {
            const issue = result;
            for (let i = 0; i < issue.title.length; i++) {
                const html = `
                    <div class="issue-text-day-contain">
                        <div class="issue-text">
                        </div>
                        <div class="issue-day"></div>
                    </div>
                `;
                const issueTextElements = document.getElementsByClassName("issue-text");
                if (issueTextElements.length > 0) {
                    issueTextElements[0].insertAdjacentHTML("afterend", html);
                }
            }
        } else {
            console.error("API 요청 실패:", response.data);
        }
    } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
    }
})();

// //프로젝트 규칙 생성

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

    const deleteIcon = document.createElement("img");
    deleteIcon.src = "../../public/img/trash.png";
    deleteIcon.className = "rule-img delete-icon";

    ruleIcon.appendChild(deleteIcon);

    li.appendChild(input);
    li.appendChild(textElement);
    li.appendChild(ruleIcon);
    list.appendChild(li);
    input.focus();

    input.onkeydown = async function (event) {
        if (event.key !== "Enter") return;

        const rule = input.value;
        console.log("rule", rule);
        const token = localStorage.getItem("token");

        try {
            const response = await axios({
                method: "PATCH",
                url: "/api/project/update/rule",
                data: {
                    rule,
                },
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response);
            const { success, result } = response.data;
            if (success) {
                console.log("규칙 추가 성공 : ", result);
                document.location.reload();
            } else {
                console.log("규칙 추가 실패");
            }
        } catch (error) {
            console.log("규칙 추가 중 에러 발생 : ", error);
        }
    };
}
async function deleteProjectRule() {
    const deleteIcon = document.createElement("img");
    deleteIcon.src = "../../public/img/trash.png";
    deleteIcon.className = "rule-img delete-icon";
}

//project overview 수정
let projectId = localStorage.getItem("project_id");
async function changeOverview(e) {
    const text = document.getElementById("overview-text");
    const input = document.getElementById("overview-input");
    input.style.display = "inline";
    input.value = text.textContent;
    text.style.display = "none";
    input.focus();
    const token = localStorage.getItem("token");
}

async function saveOverview(event) {
    if (event.key !== "Enter") return;
    const text = document.getElementById("overview-text");
    const input = document.getElementById("overview-input");
    text.textContent = input.value;
    text.style.display = "inline";
    input.style.display = "none";
    const token = localStorage.getItem("token");

    try {
        const response = await axios({
            method: "PATCH",
            url: "/api/project/update/overview",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
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
async function saveBlurOverview(event) {
    const text = document.getElementById("overview-text");
    const input = document.getElementById("overview-input");
    text.textContent = input.value;
    text.style.display = "inline";
    input.style.display = "none";

    const token = localStorage.getItem("token");

    const project_id = 10;

    try {
        const response = await axios({
            method: "PATCH",
            url: "/api/project/update/overview",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                project_id,
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
// //member 추가

// function addMember() {
//     const userId = prompt("추가할 멤버의 아이디를 입력하세요.");
//     if (userId) {
//         // 입력한 아이디를 localStorage에 저장
//         localStorage.setItem("userId", userId);
//     }
// }

// async function addMember() {
//     let projectId = "REAL_PROJECT_ID"; // 실제 프로젝트 ID로 변경
//     let token = localStorage.getItem("token");
//     let memberIds = [];

//     // localStorage에서 아이디를 가져옴
//     const userId = localStorage.getItem("userId");
//     if (userId) {
//         // 사용자 아이디가 존재하는지 확인
//         const user = await checkUserId(userId);
//         if (user) {
//             memberIds.push(user.id); // 데이터베이스에 존재하는 사용자의 아이디를 memberIds 배열에 추가

//             // 사용자 이름을 화면에 추가
//             const userNameDiv = document.getElementById("overview-main");
//             userNameDiv.innerHTML = `
//                 <div id="pro-img-div">
//                     <img src="../../public/img/mypage.png" id="pen-img" />
//                 </div>
//                 ${user.name} // user 객체에서 사용자 이름을 가져옴
//             `;
//         } else {
//             console.log(`아이디 ${userId}은 존재하지 않습니다.`);
//             return;
//         }
//     } else {
//         console.log("유효한 아이디를 입력하세요");
//         alert("유효한 아이디를 입력하세요");
//         return;
//     }

//     try {
//         const response = await axios({
//             method: "POST",
//             url: "/api/project/add/member",
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//             data: {
//                 project_id: projectId,
//                 member_id: memberIds[0], // 첫 번째 멤버의 ID만 전송
//             },
//         });
//         console.log(response);
//         const { success, result } = response.data;
//         if (success) {
//             console.log("회원 추가 성공", result);
//         } else {
//             console.log(response);
//             console.log("회원 추가 실패");
//         }
//     } catch (error) {
//         console.error("회원 추가 중 에러 발생", error);
//     }
// }

// /*파일 업로드*/
// // upload.js
// window.onload = function () {
//     document.getElementById("uploadBtn").addEventListener("click", function () {
//         document.getElementById("fileInput").click();
//     });
// };
// document.getElementById("fileInput").addEventListener("click", async function (e) {
//     const file = e.target.files[0];
//     const fileContainers = document.querySelectorAll(".api-file-contain");

//     let targetDiv;
//     for (let i = 0; i < fileContainers.length; i++) {
//         if (!fileContainers[i].querySelector(".api-file-name").textContent) {
//             targetDiv = fileContainers[i].querySelector(".api-file-name");
//             break;
//         }
//     }

//     if (targetDiv) {
//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append("project_id", "your_project_id");
//         formData.append("type", "erd");
//         formData.append("project_files", "your_project_files");

//         let token = localStorage.getItem("token");

//         try {
//             const response = await axios({
//                 method: "PATCH",
//                 url: "/api/project/update/file",
//                 data: formData,
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
//             console.log(response);
//             const { success, result } = response.data;
//             if (result) {
//                 console.log("File uploaded successfully");
//                 targetDiv.textContent = name;
//             } else {
//                 console.log("Failed to upload file");
//             }
//         } catch (error) {
//             console.error("Error uploading file:", error);
//         }
//     } else {
//         console.log("All divs are filled. Please add more divs.");
//     }
// });
