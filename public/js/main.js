(async function () {
    const token = localStorage.getItem("token");
    try {
        const getMyProjectResult = await axios({
            method: "post",
            url: "/api/project/mine",
            headers: { Authorization: `Bearer ${token}` },
        });

        const { success, result } = getMyProjectResult.data;
        console.log(result);

        if (success) {
            result.user_name === ""
                ? (document.getElementById("username").textContent = "")
                : (document.getElementById("username").textContent = `${result.user_name}님`);
            //깃헙링크 보여주기
            result.github === null || result.github === ""
                ? (document.getElementById("github").href = "/mypage")
                : (document.getElementById("github").href = result.github);
            // 블로그 링크 보여주기
            result.blog === null || result.blog === ""
                ? (document.getElementById("blog").placeholder = "/blog")
                : (document.getElementById("blog").href = result.blog);

            for (i = 0; i < result.projectResult.length; i++) {
                const html = document.createElement("div");
                html.innerHTML = `
                <div class="main_myproject_profile">
                    <button onclick="goProjectPage(${result.projectResult[i][0]})">
                    <div class="main_myproject_show"><img class=${result.projectResult[i][3]} /></div>
                    <div class="txt_place">
                        <div class="main_myproject_name">${result.projectResult[i][1]}</div>
                        <div class="main_myproject_stat">${result.projectResult[i][2]}</div>
                    </div>
                    </button>
                </div>
            `;
                document.querySelector(".profiles").appendChild(html);
            }
        }
    } catch (error) {
        console.log(error);
    }
})();

async function goProjectPage(projectId) {
    const token = localStorage.getItem("token");

    try {
        const updateTokenResult = await axios({
            method: "POST",
            url: "/api/project/update/token",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                projectId,
            },
        });
        const { success, token: newToken } = updateTokenResult.data;
        if (success) {
            localStorage.setItem("token", newToken);
            document.location.href = "/project/home";
        }
    } catch (error) {
        console.log(error);
    }
}
