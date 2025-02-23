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
    
    console.log("Current path:", currentPath);

    if (user) {
        if (currentPath.endsWith("index.html")) {
            window.location.href = "dashboard.html";
        }
    } else {
        const publicPaths = ["index.html", "index2.html", "/"];
        const isPublicPath = publicPaths.some(path => currentPath.endsWith(path));
        
        if (!isPublicPath) {
            window.location.href = "index.html";
        }
    }
};
