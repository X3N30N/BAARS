function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (username === "admin" && password === "12345") { 
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
    const user = localStorage.getItem("user");
    const currentPath = window.location.pathname;
    
    // If user is logged in
    if (user) {
        // Only redirect from index.html to dashboard
        if (currentPath.endsWith("index.html")) {
            window.location.href = "dashboard.html";
        }
    } 
    // If user is not logged in
    else {
        // Redirect to index.html only if trying to access dashboard or other protected pages
        if (!currentPath.endsWith("index.html") && 
            !currentPath.endsWith("index2.html") && 
            !currentPath.endsWith("/")) { 
            window.location.href = "index.html";
        }
    }
};