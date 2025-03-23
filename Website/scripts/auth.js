function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (username === "admin" && password === "1234") { 
        localStorage.setItem("user", username);
        window.location.href = "dashboard";
    } else {
        alert("Invalid Credentials");
    }
}

function logout() {
    localStorage.removeItem("user");
    window.location.href = "index";
}

window.onload = function() {
    const user = localStorage.getItem("user");
    const currentPath = window.location.pathname;
    
    // If user is logged in
    if (user) {
        if (currentPath.endsWith("index")) {
            window.location.href = "dashboard";
        }
    } 
    // If user is not logged in
    else {
        // Only redirect to index if trying to access dashboard
        if (currentPath.endsWith("dashboard")) {
            window.location.href = "index";
        }
    }
};