function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "1234") { 
        localStorage.setItem("user", username);
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid Credentials");
    }
}

function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

window.onload = function() {
    if (localStorage.getItem("user")) {
        if (window.location.pathname.includes("index.html")) {
            window.location.href = "dashboard.html";
        }
    } else {
        if (!window.location.pathname.includes("index.html") && 
            !window.location.pathname.includes("index2.html")) {
            window.location.href = "index.html";
        }
    }
};
