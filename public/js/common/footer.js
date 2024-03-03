window.onload = function () {
    var footer = document.getElementById('footer');
    var bodyHeight = document.body.scrollHeight;
    var windowHeight = window.innerHeight;

    if (bodyHeight > windowHeight) {
        footer.style.position = 'relative';
    } else {
        footer.style.position = 'fixed';
        footer.style.bottom = '0';
    }
};
