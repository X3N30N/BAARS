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
        // Only redirect from index.html to dashboard
        if (currentPath.endsWith("index")) {
            window.location.href = "dashboard";
        }
    } 
    // If user is not logged in
    else {
        // Redirect to index.html only if trying to access dashboard or other protected pages
        if (!currentPath.endsWith("index") && 
            !currentPath.endsWith("index2") && 
            !currentPath.endsWith("/")) { 
            window.location.href = "index";
        }
    }
};