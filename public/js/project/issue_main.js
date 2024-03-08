const token = localStorage.getItem("token");
const tbody = document.querySelector("tbody");

// (async function () {
//     //페지네이션 goToPage 함수 정의
//     async function goToPage(page) {
//         const res = await axios({
//             method: "get",
//             url: `/api/project/issue/list?page=${page}&pageSize=14`,
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });

//         tbody.innerHTML = ""; //페이지 번호에 해당하는 issue들 할당해주기 위한 초기 테이블값 초기화

//         //issue에 있는 userId로 작성자 이름 가져오기
//         for (let i = 0; i < res.data.result.length; i++) {
//             const userId = res.data.result[i].userId;

//             const res2 = await axios({
//                 method: "POST",
//                 url: "/api/user/info",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//                 data: {
//                     userId: userId,
//                 },
//             });

//             //issue[i] 작성자
//             const userName = res2.data.result.user_name;

//             //[i]번째 이슈글 출력
//             const html = `
//                 <tr>
//                     <td>${(page - 1) * 14 + i + 1}</td>
//                     <td><a href="/project/issue_content/${res.data.result[i].id}">${res.data.result[i].title}</a></td>
//                     <td>${userName}님</td>
//                     <td>${res.data.result[i].issue_date}</td>
//                 </tr>`;
//             tbody.insertAdjacentHTML("beforeend", html);
//         }
//     }
//     // 페이지 갯수만큼 페이지 숫자 버튼 생성
//     const res3 = await axios({
//         method: "get",
//         url: `/api/project/issue/list?page=1&pageSize=14`,
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     });
//     const totalPages = res3.data.pagination.totalPages; // 페이지 전체 개수
//     const pageNumberBox = document.getElementById("pageNumber");

//     for (let i = 1; i <= totalPages; i++) {
//         const pageNumber = document.createElement("span");
//         pageNumber.innerText = i;
//         pageNumber.addEventListener("click", () => {
//             goToPage(i);
//         });
//         pageNumberBox.appendChild(pageNumber);
//     }

//     // 새로고침하면 초기 페이지 로드
//     goToPage(1);
// })();

(async function () {
    // 페이지 번호와 버튼을 설정하는 함수
    async function setPaginationButtons(page) {
        const totalPagesRes = await axios({
            method: "get",
            url: `/api/project/issue/list?page=1&pageSize=14`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const totalPages = totalPagesRes.data.pagination.totalPages;

        const pageNumberBox = document.getElementById("pageNumber");
        pageNumberBox.innerHTML = "";

        const prevButt = document.getElementById("preButton");
        prevButt.style.display = currentPage > 1 ? "block" : "none";
        prevButt.addEventListener("click", () => {
            if (page >= 5) {
                goToPage(page - 5);
            }
        });
        pageNumberBox.appendChild(prevButt);

        for (let i = page; i <= page + 5; i++) {
            const pageNumber = document.createElement("span");
            pageNumber.classList.add("pageNumber");
            pageNumber.innerText = i;
            pageNumber.addEventListener("click", () => {
                goToPage(i);
            });
            pageNumberBox.appendChild(pageNumber);
        }

        const nextButt = document.getElementById("nextButton");
        nextButt.style.display = page + 5 <= totalPages ? "block" : "none";
        nextButt.addEventListener("click", () => {
            if (page < totalPages) {
                goToPage(page + 5);
            }
        });
        pageNumberBox.appendChild(nextButt);
    }

    // goToPage 함수 정의
    async function goToPage(page) {
        const res = await axios({
            method: "get",
            url: `/api/project/issue/list?page=${page}&pageSize=14`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        tbody.innerHTML = "";

        for (let i = 0; i < res.data.result.length; i++) {
            const userId = res.data.result[i].userId;

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

            const userName = res2.data.result.user_name;

            const html = `
                <tr>
                    <td>${(page - 1) * 14 + i + 1}</td>
                    <td><a href="/project/issue_content/${res.data.result[i].id}">${res.data.result[i].title}</a></td>
                    <td>${userName}님</td>
                    <td>${res.data.result[i].issue_date}</td>
                </tr>`;
            tbody.insertAdjacentHTML("beforeend", html);
        }

        await setPaginationButtons(page);
    }

    await setPaginationButtons(1);
})();

async function searchFunc() {
    const type = document.getElementById("type").value;
    const keyword = document.getElementById("keyword").value;

    console.log(type, keyword);
    //keyword를 서버에서는 req.query로 받는다고 했는데 어떻게 보내주지
    async function goToPage(page) {
        const res = await axios({
            method: "get",
            url: `/api/project/issue/search?page=${page}&pageSize=14&type=${type}&keyword=${keyword}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        tbody.innerHTML = "";

        for (let i = 0; i < res.data.result.length; i++) {
            const userId = res.data.result[i].userId;

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

            const userName = res2.data.result.user_name;

            const html = `
                    <tr>
                        <td>${(page - 1) * 14 + i + 1}</td>
                        <td><a href="/project/issue_content/${res.data.result[i].id}">${
                res.data.result[i].title
            }</a></td>
                        <td>${userName}님</td>
                        <td>${res.data.result[i].issue_date}</td>
                    </tr>`;
            tbody.insertAdjacentHTML("beforeend", html);
        }
    }

    const res3 = await axios({
        method: "get",
        url: `/api/project/issue/search?page=1&pageSize=14&type=${type}&keyword=${keyword}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const totalPages = res3.data.pagination.totalPages;
    const pageNumberBox = document.getElementById("pageNumber");
    pageNumberBox.innerHTML = ""; // 페이지 버튼 초기화

    for (let i = 1; i <= totalPages; i++) {
        const pageNumber = document.createElement("span");
        pageNumber.innerText = i;
        pageNumber.addEventListener("click", () => {
            goToPage(i);
        });
        pageNumberBox.appendChild(pageNumber);
    }

    goToPage(1); // 초기 페이지 로드
}
//반복문으로 배열 풀어내기
