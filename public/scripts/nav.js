document.onload = function () {
    document.querySelector('.nav-btn').addEventListener('click' , () => {
        document.querySelectorAll('.nav-link').forEach(navlink => navlink.classList.toggle("show"));
    })
}