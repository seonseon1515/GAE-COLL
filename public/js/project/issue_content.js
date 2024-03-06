const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzA5NzEyMjkzLCJleHAiOjE3MDk3OTg2OTN9.IzygjqdTQHczw0_rtIuJqheL1mXfo2RrwYnC7A5TSi8";
// const ids = document.location.href.split("project/issue/detail/");
// const id = ids[1];
const id = 11; //이슈 아이디
(async function () {
    const res1 = await axios({
        method: "get",
        url: `/api/project/issue/detail/${id}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    console.log(res1.data.result);
    const { title, content, issue_date, files, createdAt, updatedAt, userId } = res1.data.result;
    document.getElementById("content").innerHTML = content;
    document.querySelector(".date_box").textContent = issue_date;
    document.querySelector(".title_box").textContent = title;
    document.querySelector(".userId").value = userId;

    // null 일때 forEach문 에러 발생 방지
    // 기존 p문 초기화 => 파일 갯수만큼 p문 생성으로 변경하기
    // 배열로 가져오다보니.. 똑같은 파일이 있으면 귀찮,,
    const fileBox = document.querySelector(".file_box");
    fileBox.innerHTML = "";

    const myfile = files.split(",");
    if (myfile && myfile.length > 0) {
        myfile.forEach((file) => {
            const p = document.createElement("p");
            p.textContent = file;
            const newFileBox = document.createElement("div");
            newFileBox.classList.add("file");
            newFileBox.appendChild(p);
            fileBox.appendChild(newFileBox);
        });
    }

    const user_Id = document.querySelector(".userId").value;
    const res2 = await axios({
        method: "POST",
        url: "/api/user/info",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: {
            userId: user_Id,
        },
    });
    document.querySelector(".writer_box").innerHTML = res2.data.result.user_name;
})();

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

// Patch
function editIssueFunc() {
    const content = document.getElementById("content");
    content.setAttribute("contenteditable", "true");
    content.style.backgroundColor = "#f0f0f0";

    const titleBg = document.getElementById("title_box");
    titleBg.setAttribute("contenteditable", "true");
    titleBg.style.backgroundColor = "#f0f0f0";

    const saveButt = document.getElementById("saveButt");
    saveButt.style.display = "block";
    const codeBlock = document.getElementById("codingIcon");
    codeBlock.style.display = "block";

    const uploadBox = document.querySelector(".uploadBox");
    uploadBox.style.display = "block";
}

async function saveFunc() {
    try {
        const contentEl = document.getElementById("content");
        const saveButt = document.getElementById("saveButt");
        contentEl.setAttribute("contenteditable", "false");
        saveButt.style.display = "none";

        const content = document.getElementById("content").innerHTML;
        const issue_date_text = document.querySelector(".date_box").textContent;
        const issue_date = new Date(issue_date_text);
        const title = document.querySelector(".title_box").textContent;
        const userId = document.querySelector(".userId").value;
        //파일 불러오기
        const fileInput = document.getElementById("files");
        const formData = new FormData();

        formData.append("content", content);
        formData.append("issue_date", issue_date);
        formData.append("title", title);
        formData.append("projectId", "1");
        formData.append("userId", userId);

        if (fileInput.files.length > 0) {
            for (let i = 0; i < fileInput.files.length; i++) {
                formData.append("issue_files", fileInput.files[i]);
            }
        }
        console.log(fileInput.files[0]);

        const res = await axios({
            method: "patch",
            url: `/api/project/issue/detail/${id}`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
            data: formData,
        });
        console.log(res);

        if (!res.data.success) {
            alert("작성자만 수정할 수 있습니다.");
        }
        return location.reload();
    } catch (error) {
        console.log(error);
    }
}

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
