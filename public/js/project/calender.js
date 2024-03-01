const now = new Date();

const make_calender = (now) => {
    // date 객체에서 다양한 월을 가져올 수 있으면 해당하는 월에 대한 일, 요일 정보 가져올 수 있을듯?
    // 현재 월에 있는 일을 모두 가져올 수 있다면?
    const this_year = now.getFullYear();
    const this_month = now.getMonth() + 1;
    const this_date = now.getDate(); // 일?
    const this_day = now.getDay(); // 요일 (월 -> 1) -> 열

    // 해당 월의 일만큼의 div 만들기 + 빈칸 포함(디폴트 값?)
    const current_last_date = new Date(this_year, this_month, 0).getDate(); // 요번 달 일 수

    const first_day = now.getDay(1); // 요번 달 1일 되기 전 칸 수
    // 요번 달 마지막 날이 끝나고 칸 수가 남아 다음 달로 넘어가기 전 표시할 칸 수
    const current_last_day = current_last_date + first_day;
    const current_next_day = Math.ceil(current_last_day / 7) * 7 + 7;

    // 일과 요일이 어떻게 매칭이 되는지?
    // 첫 줄 첫 칸과 가장 마지막 줄 마지막 칸을 어떻게 정할 것인가?
    // 뒤로가기 혹은 앞으로 가기 버든을 눌렀을 때, 즉 이전 달 혹은 다음 달의 요일, 일을 보여주는 방법?

    const prev_month = now.getMonth();
    const prev_last_date = new Date(this_year, prev_month, 0).getDate();
    let next_first_date = new Date(this_year, this_month, 1).getDate();
    let container = ``;

    for (let i = 0; i < first_day; i++) {
        container += `<div class='no_color'>${prev_last_date - (first_day - 1 - i)}</div>`;
    }

    for (let i = 1; i <= current_last_date; i++) {
        container += `<div class='day_number'>${i}</div>`;
    }

    for (let i = current_last_day; i < current_next_day; i++) {
        container += `<div class='no_color'>${(next_first_date += 1)}</div>`;
    }

    document.querySelector(`.date_board`).innerHTML = container;
    document.querySelector(`.calender_title`).innerText = `${this_year}년 ${this_month}월`;
};

make_calender(now);

// 이전 달

document.querySelector('.prev').onclick = () => {
    make_calender(new Date(now.setMonth(now.getMonth() - 1)));
};

// 다음 달

document.querySelector('.next').onclick = () => {
    make_calender(new Date(now.setMonth(now.getMonth() + 1)));
};

function pop_calender(){
    
}

