const token = localStorage.getItem("token");
// const projectId = localStorage.getItem('porjectId')
const projectId = 1;
const tbody = document.querySelector("tbody");
(function () {
    axios({
        method: "get",
        url: `/api/project/issue/${projectId}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).then(async (res) => {
        console.log(res); // 여기
        for (let i = 0; i < res.data.result.length; i++) {
            // 사용자 ID 가져오기
            const userId = res.data.result[i].userId;

            // 사용자 이름 가져오기
            const res2 = await axios({
                method: "POST",
                url: "/api/user/info",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    userId: userId,
                },
            });

            const userName = res2.data.result.user_name; // 이 부분은 실제 사용자 이름이 있는 속성에 맞게 수정해야 합니다.

            // 테이블에 표시할 HTML 생성
            const html = `
                <tr>
                    <td>${res.data.result[i].id}</td>
                    <td><a href="/project/issue_content/${res.data.result[i].id}">${res.data.result[i].title}</a></td>
                    <td>${userName}님</td> <!-- 사용자 이름 추가 -->
                    <td>${res.data.result[i].issue_date}</td>
                </tr>`;
            tbody.insertAdjacentHTML("beforeend", html);
        }
    });
})();

async function searchFunc() {
    const type = document.getElementById("type").value;
    const keyword = document.getElementById("keyword").value;

    console.log(type, keyword);
    console.log("플젝ID", projectId);
    //keyword를 서버에서는 req.query로 받는다고 했는데 어떻게 보내주지
    const res = await axios({
        method: "get",
        url: `/api/project/issue/${projectId}/search?type=${type}&keyword=${keyword}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    console.log("응답값", res.data.result);
    //반복문으로 배열 풀어내기
}
