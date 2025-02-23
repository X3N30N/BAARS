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
        if (currentPath==='/index') {
            window.location.href = "dashboard.html";
        }
    } else {
        const publicPaths = ["/index", "/index2", "/"];
        const isPublicPath = publicPaths.includes(currentPath)
        
        if (!isPublicPath) {
            window.location.href = "/";
        }
    }
};
