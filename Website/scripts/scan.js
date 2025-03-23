document.getElementById("submitChallenge").addEventListener("click", async () => {
    const esp32Address = document.getElementById("esp32Address").value.trim();
    const challengeInput = document.getElementById("challengeInput");
    const challengeCode = challengeInput.value.trim();
    const statusMessage = document.getElementById("statusMessage");

    // Validate ESP32 address
    if (!esp32Address) {
        statusMessage.innerText = "⚠️ Please enter the ESP32 address.";
        statusMessage.classList.remove("success", "error", "loading");
        statusMessage.classList.add("warning");
        return;
    }

    // Validate challenge code
    if (!challengeCode) {
        statusMessage.innerText = "⚠️ Please enter a challenge code.";
        statusMessage.classList.remove("success", "error", "loading");
        statusMessage.classList.add("warning");
        return;
    }

    // Show loading state
    statusMessage.innerText = "⏳ Verifying...";
    statusMessage.classList.remove("success", "error", "warning");
    statusMessage.classList.add("loading");

    try {
        // Get student ID from localStorage (set by auth.js during login) or prompt for manual input
        const studentID = localStorage.getItem("studentID") || prompt("Please enter your Student ID:");
        if (!studentID) {
            statusMessage.innerText = "⚠️ Student ID is required.";
            statusMessage.classList.remove("loading");
            statusMessage.classList.add("warning");
            return;
        }

        // Add timeout to the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout

        // Send the challenge code to the ESP32 for verification
        const response = await fetch(`http://${esp32Address}/verify-challenge`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                studentID: studentID,
                challengeCode: challengeCode
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        const result = await response.json();

        if (result.success) {
            statusMessage.innerText = "✅ Attendance Marked Successfully!";
            statusMessage.classList.remove("loading");
            statusMessage.classList.add("success");
            challengeInput.value = ""; // Clear input
        } else {
            statusMessage.innerText = `❌ ${result.message || "Invalid challenge code."}`;
            statusMessage.classList.remove("loading");
            statusMessage.classList.add("error");
        }
    } catch (error) {
        statusMessage.innerText = "⚠️ Error connecting to ESP32. Check the address and network.";
        statusMessage.classList.remove("loading");
        statusMessage.classList.add("warning");
        console.error("Error:", error);
    }
});