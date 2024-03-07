// 프로젝트 생성
// axios
let imgChecked = false;
async function getProjectInfo () {
   try { const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzA5NjczMTY1LCJleHAiOjE3MDk2NzY3NjV9.8Bc12Q0Ou9sP1tgXh5CxhOgbCsehdknbiwcsIJRMH2o';
    // const token = localStorage.getItem("token");

    const getProjectInfo = await axios({
        method: 'post',
        url: '/api/project/create',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
    console.log(getProjectResult);
    const { result, success } = getProjectInfo.data;
    console.log(result);
    console.log(success);
    const formData = getProjectInfo.data.formData

    const profileImg = document.querySelector('.main_profileImg'); 
    const myProjectName = document.querySelector('.main_myproject_name');
    const myProjectStat = document.querySelector('.main_myproject_stat');
  
    
    if (!data.result.send_img) {
        alert("이미지 파일의 확장자가 .img 이어야 합니다.");
        imgChecked= true;
        return
    }
} catch (error) {}
};



