const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzA5Njk4NTc2LCJleHAiOjE3MDk3MDIxNzZ9.zRBsM56r5ADc720ag_H4noQUH7j7Od0c6i2FbKZ1chg";
// const ids = document.location.href.split("project/issue/detail/");
// const id = ids[1];
const id = 8;

//코드 블록
async function codeBlockFunc() {
    const content = document.getElementById("content");
    const newCode = document.createElement("code");
    const span = document.createElement("span");

    span.innerHTML = "&nbsp&nbsp";
    newCode.textContent = "코드를 입력하세요.";
    content.appendChild(newCode);
    content.insertBefore(span, newCode);
    content.appendChild(span);
}

//생성 테스트는 성공
// async function writeIssueFunc() {
//     try {
//         const content = document.getElementById("content").innerHTML;
//         const issue_date_text = document.querySelector(".date_box").textContent;
//         const issue_date = new Date(issue_date_text);

//         const title = document.querySelector(".title_box").textContent;
//         const files = document.querySelectorAll(".file_box .file").textContent;

//         const temp = document.location.href.split("project/issue/detail/");
//         const res = await axios({
//             method: "POST",
//             url: `/api/porject/issue/datail/${temp[1]}`,
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//             data: {
//                 content,
//                 issue_date,
//                 title,
//                 files,
//                 projectId: "1", // 원래 params로
//             },
//             // params: {
//             //     projectId: temp[1]
//             // },
//         });
//         console.log(res);
//     } catch (error) {
//         console.error(error);
//     }
// }

async function saveFunc() {
    try {
        const contentEl = document.getElementById("content");
        const saveButt = document.getElementById("saveButt");
        contentEl.setAttribute("contenteditable", "false");
        saveButt.style.display = "none";
        const filesSelectButt = document.getElementById("filesButt");
        filesSelectButt.style.display = "block";
        const fileSubmit = document.getElementById("fileSubmit");
        fileSubmit.style.display = "block";

        const content = document.getElementById("content").innerHTML;
        const issue_date_text = document.querySelector(".date_box").textContent;
        const issue_date = new Date(issue_date_text);
        const title = document.querySelector(".title_box").textContent;

        //파일 불러오기
        const fileInput = document.getElementById("files");
        const formData = new FormData();

        for (let i = 0; i < fileInput.files.length; i++) {
            formData.append("issue_files", fileInput.files[i]);
        }
        console.log(fileInput.files[0]);

        const res = await axios({
            method: "patch",
            url: `/api/project/issue/detail/${id}`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
            data: {
                content,
                issue_date,
                title,
                projectId: "1",
                formData,
            },
        });
        console.log(res);

        if (!res.data.success) {
            alert("작성자만 수정할 수 있습니다.");
            return location.reload();
        }
    } catch (error) {
        console.log(error);
    }
}

//파일 업데이트 (추가)
/*
async function saveFunc() {
    try {
        const filesSelectButt = document.getElementById("filesButt");
        filesSelectButt.style.display = "block";
        const fileSubmit = document.getElementById("fileSubmit");
        fileSubmit.style.display = "block";

        const fileInput = document.getElementById("files");
        const files = fileInput.files;

        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append("issue_files", files[i]);
        }
        console(files[0]);

        const res = await axios({
            method: "patch",
            url: `/api/project/issue/detail/file/${id}`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        console.log(res);

        if (!res.data.success) {
            alert("작성자만 수정할 수 있습니다.");
            return location.reload();
        }
    } catch (error) {
        console.error(error);
    }
}
*/
window.onload = function () {
    target = document.getElementById("files"); // file 아이디 선언
    target.addEventListener("change", function () {
        // change 함수

        if (target.value.length) {
            // 파일 첨부인 상태일경우 파일명 출력
            let filenames = "";
            for (let i = 0; i < target.files.length; i++) {
                filenames += target.files[i].name + "&nbsp&nbsp&nbsp&nbsp";
            }
            $("#origin_name").html(filenames);
        } else {
            //버튼 클릭후 취소(파일 첨부 없을 경우)할때 파일명값 안보이게
            $("#origin_name").html("");
        }
    });
};
