async function codeBlockFunc() {
    const content = document.getElementById("content");
    const codeBlock = document.createElement("code");
    const newDiv = document.createElement("div");
    const newDiv2 = document.createElement("div");
    const br = document.createElement("br");
    const br2 = document.createElement("br");

    codeBlock.classList.add("myBlock");
    // const span = document.createElement("span");
    // const newSpan = document.querySelector("div > font > span");

    // contenteditable 속성을 추가합니다.
    // span.setAttribute("contenteditable", true);

    // content.insertBefore(newDiv, codeBlock);
    newDiv.append(br);
    newDiv2.append(br2);

    content.appendChild(newDiv);

    codeBlock.innerHTML = "이게 코드블록이다";
    codeBlock.style.marginLeft = "16px";
    content.appendChild(codeBlock);
    // content.insertBefore(newDiv, codeBlock);

    content.appendChild(newDiv2);

    // span.innerHTML = "&nbsp";

    // newSpan.style.backgroundColor = "none";
    // newSpan.style.fontSize = "20px";

    // content.appendChild(span); // 코드 블록 뒤에 줄 바꿈 추가
}

async function editIssueFunc() {
    try {
        const token =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzA5NjEyMjc2LCJleHAiOjE3MDk2MTU4NzZ9.Fy__V7Ng1DLHFXALQDL5NE_xQcy5FCNtALDMZa3Q028";
        const content = document.getElementById("content");
        const issue_date_text = document.querySelector(".date_box").textContent;
        const issue_date = new Date(issue_date_text);

        const title = document.querySelector(".title_box").textContent;
        const files = document.querySelectorAll(".file_box .file");

        const res = await axios({
            method: "post",
            url: "/api/project/issue",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                content: content.innerHTML,
                issue_date,
                title,
                files: files.textContent,
                projectId: "1", // 원래 params로
            },
            // params: {
            //     projectId: id
            // },
        });
        console.log(res);
    } catch (error) {
        console.error(error);
    }
}
