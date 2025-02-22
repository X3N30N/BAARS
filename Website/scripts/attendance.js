document.addEventListener("DOMContentLoaded", function() {
    const username = localStorage.getItem("user");
    if (!username) {
        window.location.href = "index.html"; // Redirect if not logged in
    } else {
        document.getElementById("username").textContent = username; // Show username
        loadAttendance();
    }

    document.getElementById("logoutBtn").addEventListener("click", function() {
        localStorage.removeItem("user");
        window.location.href = "index.html";
    });
});

function loadAttendance() {
    // Simulating attendance percentage
    const attendance = Math.floor(Math.random() * 21) + 80; // Between 80% - 100%
    document.getElementById("attendance").textContent = `${attendance}%`;
}
