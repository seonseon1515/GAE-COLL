const toggleDiv = document.querySelectorAll(".toggle_open");
let changedBoardId = 0;
let boardData = [];

for (let i = 0; i < toggleDiv.length; i++) {
    toggleDiv[i].addEventListener("click", clickToggle);
}
function clickToggle(e) {
    const tbody = this.parentNode.parentNode.nextSibling.nextSibling;
    console.log(tbody);
    tbody.classList.toggle("hidden");
    console.log(this);
    this.classList.toggle("closeToggle");
}

(async function () {
    const token = localStorage.getItem("token");
    const getBoardResult = await axios({
        method: "get",
        url: "/api/project/board/get",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const { result, success } = getBoardResult.data;
    if (success) {
        //계획에 해당하는 부분 테이블에 구현
        //deadline 오름차순변경
        boardData = result.sort((a, b) => {
            if (a.deadline > b.deadline) return -1;
            if (a.deadline < b.deadline) return 1;
            return 0;
        });
        drawTable(boardData);
    }
})();
function drawTable(data) {
    const planningTbody = document.getElementById("planning-tbody");
    const progessTbody = document.getElementById("progress-tbody");
    const suspendTbody = document.getElementById("suspend-tbody");
    const finishTbody = document.getElementById("finish-tbody");
    const needFeedbackTbody = document.getElementById("needFeedback-tbody");
    const finishFeedbackTbody = document.getElementById("finishFeedback-tbody");

    for (let i = 0; i < data.length; i++) {
        const manufactureData = switchStatus(data[i].status);
        const tr = document.createElement("tr");
        tr.id = `tr${data[i].id}`;
        tr.innerHTML = `
        <td class="td1">
            <button class="work_name" type="button" onclick="goBoardDetail(${data[i].id})">${data[i].title}</button>
        </td>
        <td id="td2" class="td2"> 
          <div class="button-wrap">
            <button type="button" id="bg_${manufactureData.color}" class="placement_status_inner" onclick="showModal(event,${data[i].id})">
                <div id="${manufactureData.color}" class="circle1"></div>
                <div class="status_txt1">${manufactureData.status}</div>
            </button>
            </div>
        </td>
        <td class="td3"><input type="text" id="datepicker${data[i].id}" class="${data[i].id} datepicker" value="${data[i].deadline}"></td>
        <td class="td4"><button class="work_managers" type="button" onclick="">${data[i].user_name}</button></td>

        `;

        if (data[i].status === "planning") {
            planningTbody.appendChild(tr);
        } else if (data[i].status === "progress") {
            progessTbody.appendChild(tr);
        } else if (data[i].status === "suspend") {
            suspendTbody.appendChild(tr);
        } else if (data[i].status === "finish") {
            finishTbody.appendChild(tr);
        } else if (data[i].status === "needFeedback") {
            needFeedbackTbody.appendChild(tr);
        } else if (data[i].status === "finishFeedback") {
            finishFeedbackTbody.appendChild(tr);
        }
        //deadline을 setDate로 하는거 구현해야함
        $(`#datepicker${data[i].id}`).datepicker({
            dateFormat: "yy-mm-dd", //Input Display Format 변경
            showOtherMonths: true, //빈 공간에 현재월의 앞뒤월의 날짜를 표시
            showMonthAfterYear: true, //년도 먼저 나오고, 뒤에 월 표시
            changeYear: true, //콤보박스에서 년 선택 가능
            changeMonth: true, //콤보박스에서 월 선택 가능
            buttonText: "선택", //버튼에 마우스 갖다 댔을 때 표시되는 텍스트
            yearSuffix: "년", //달력의 년도 부분 뒤에 붙는 텍스트
            monthNamesShort: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], //달력의 월 부분 텍스트
            monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"], //달력의 월 부분 Tooltip 텍스트
            dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"], //달력의 요일 부분 텍스트
            dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"], //달력의 요일 부분 Tooltip 텍스트
            minDate: "-1M", //최소 선택일자(-1D:하루전, -1M:한달전, -1Y:일년전)
            maxDate: "+1M", //최대 선택일자(+1D:하루후, -1M:한달후, -1Y:일년후)
            onSelect: function (dateString) {
                //날짜 선택되었을때 업데이트되게 하기!
                const boardId = this.id.replace("datepicker", "");
                boardDeadlineUpdate(boardId, dateString);
            },
        });
        //$(`#datepicker${data[i].id}`).datepicker("setDate", "2024-02-03");
    }
}
//작업추가
const addJobTbody = document.getElementById("addJobTbody");
function addJob() {
    const today = new Date();
    const year = today.getFullYear();
    const month = ("0" + (today.getMonth() + 1)).slice(-2);
    const day = ("0" + today.getDate()).slice(-2);
    const dateString = year + "-" + month + "-" + day;

    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td class="td1">
            <input type="text" placeholder="작업을 입력해주세요" id="writeBoardTitle"/>
        </td>
        <td id="td2" class="td2"> 
        <div class="button-wrap">
          <button type="button" id="bg_blue" class="placement_status_inner" onclick="showModal(event,0)">
              <div id="blue" class="circle1"></div>
              <div class="status_txt1">계획중</div>
          </button>
          </div>
      </td>
      <td class="td3"><input type="text" id="datepicker" placeholder="마감일"></td>

      
      <td class="td4"><button class="work_managers" type="button" onclick="">작업자선택</button></td>

    `;

    addJobTbody.appendChild(tr);
    $("#datepicker").datepicker();
    // document.getElementById("ui-datepicker-div").style.zIndex = 999;
}
$(function () {
    //input을 datepicker로 선언
    $("#datepicker").datepicker({
        dateFormat: "yy-mm-dd", //Input Display Format 변경
        showOtherMonths: true, //빈 공간에 현재월의 앞뒤월의 날짜를 표시
        showMonthAfterYear: true, //년도 먼저 나오고, 뒤에 월 표시
        changeYear: true, //콤보박스에서 년 선택 가능
        changeMonth: true, //콤보박스에서 월 선택 가능
        showOn: "both", //button:버튼을 표시하고,버튼을 눌러야만 달력 표시 ^ both:버튼을 표시하고,버튼을 누르거나 input을 클릭하면 달력 표시
        buttonText: "선택", //버튼에 마우스 갖다 댔을 때 표시되는 텍스트
        yearSuffix: "년", //달력의 년도 부분 뒤에 붙는 텍스트
        monthNamesShort: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], //달력의 월 부분 텍스트
        monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"], //달력의 월 부분 Tooltip 텍스트
        dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"], //달력의 요일 부분 텍스트
        dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"], //달력의 요일 부분 Tooltip 텍스트
        minDate: "-1M", //최소 선택일자(-1D:하루전, -1M:한달전, -1Y:일년전)
        maxDate: "+1M", //최대 선택일자(+1D:하루후, -1M:한달후, -1Y:일년후)
    });

    //초기값을 오늘 날짜로 설정
    $("#datepicker").datepicker("setDate", "today"); //(-1D:하루전, -1M:한달전, -1Y:일년전), (+1D:하루후, -1M:한달후, -1Y:일년후)
});

const modal = document.querySelector("#dialog");
function showModal(event, boardId) {
    changedBoardId = boardId;
    modal.showModal();
}
//소켓
modal.addEventListener("close", (event) => {
    // event.returnValue는 close이벤트에 대한 리턴 값으로 true를 반환한다.
    if (modal.returnValue === "planning") {
        boardStatusUpdate("planning");
    } else if (modal.returnValue === "progress") {
        boardStatusUpdate("progress");
    } else if (modal.returnValue === "needFeedback") {
        boardStatusUpdate("needFeedback");
    } else if (modal.returnValue === "finishFeedback") {
        boardStatusUpdate("finishFeedback");
    } else if (modal.returnValue === "suspend") {
        boardStatusUpdate("suspend");
    } else if (modal.returnValue === "finish") {
        boardStatusUpdate("finish");
    }
});
// backdrop 클릭시 닫히는 이벤트 함수
modal.addEventListener("click", function (event) {
    /**
     * target === this 조건으로 close를 한다면 dialog 상자 안에 빈 곳을 클릭해도 닫힌다.(this 바인딩에 주의)
     * 정확하게 dialog 바깥인 backdrop 클릭시에만 이벤트를 호출하려면 클릭 포인트가
     * 상자 내부에 있는지를 체크하기 위해 left right top bottom을 확인해야한다.
     */
    const target = event.target;
    const rect = target.getBoundingClientRect();
    if (
        rect.left > event.clientX ||
        rect.right < event.clientX ||
        rect.top > event.clientY ||
        rect.bottom < event.clientY
    ) {
        modal.close();
    }
});
//보드 마감일 업데이트
async function boardDeadlineUpdate(board_id, deadline) {
    try {
        if (deadline === 0) {
        } else {
            const board = boardData.filter((data) => data.id == board_id);

            const data = {
                board_id,
                title: board[0].title,
                description: board[0].description,
                status: board[0].status,
                deadline,
            };
            console.log("data", data);
            const token = localStorage.getItem("token");
            const boardStatusUpdateResult = await axios({
                method: "patch",
                url: "/api/project/board/update",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data,
            });
            console.log(boardStatusUpdateResult.data);
            if (boardStatusUpdateResult.data.success) {
                document.location.reload();
            } else {
                alert("마감일변경에 실패하였습니다.");
            }
        }
    } catch (error) {}
}
//보드 상태 업데이트
async function boardStatusUpdate(status) {
    try {
        if (changedBoardId === 0) {
        } else {
            console.log("changedBoardId", changedBoardId);
            console.log("boardData", boardData);
            const board = boardData.filter((data) => data.id == changedBoardId);

            const data = {
                board_id: changedBoardId,
                title: board[0].title,
                description: board[0].description,
                status,
                deadline: board[0].deadline,
            };
            console.log("data", data);
            const token = localStorage.getItem("token");
            const boardStatusUpdateResult = await axios({
                method: "patch",
                url: "/api/project/board/update",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data,
            });
            if (boardStatusUpdateResult.data.success) {
                document.location.reload();
            } else {
                alert("상태변경에 실패하였습니다.");
            }
        }
    } catch (error) {}
}
//보드 상세조회로 이동
function goBoardDetail(boardId) {
    document.location.href = `/project/board_content/${boardId}`;
}
//보드 상태에 따른 값 저장
function switchStatus(status) {
    let data = { color: "", status: "" };

    switch (status) {
        case "planning":
            data.color = "blue";
            data.status = "계획중";
            break;
        case "progress":
            data.color = "yellow";
            data.status = "진행중";
            break;
        case "suspend":
            data.color = "purple";
            data.status = "중단됨";
            break;
        case "finish":
            data.color = "green";
            data.status = "완료";
            break;
        case "needFeedback":
            data.color = "red";
            data.status = "피드백 요청";
            break;
        case "finishFeedback":
            data.color = "black";
            data.status = "피드백 완료";
            break;
    }
    return data;
}
