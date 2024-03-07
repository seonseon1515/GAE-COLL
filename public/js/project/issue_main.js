//const token = localStorage.getItem('token');
const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzA5NzIzNzIzLCJleHAiOjE3MDk4MTAxMjN9.GXibOJ_S8qiNJ4L2jTlPZNWjyWU-9WBLGP7i4Fayk_g";
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
