// Firebase configuration (replace with your Firebase project config when ready)
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};

// Initialize Firebase (uncomment when Firebase is set up)
/*
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
*/

document.getElementById("submitChallenge").addEventListener("click", async () => {
    const challengeInput = document.getElementById("challengeInput");
    const challengeCode = challengeInput.value.trim();
    const statusMessage = document.getElementById("statusMessage");

    // Show loading state
    statusMessage.innerText = "⏳ Verifying...";
    statusMessage.classList.remove("success", "error", "warning");
    statusMessage.classList.add("loading");

    try {
        // Fetch the challenge and student ID from ESP32
        const challengeResponse = await fetch("http://192.168.4.1/challenge");
        const challengeData = await challengeResponse.json();

        if (!challengeData.challenge || !challengeData.studentID) {
            statusMessage.innerText = "⚠️ No challenge available. Please scan an ID first.";
            statusMessage.classList.remove("loading");
            statusMessage.classList.add("warning");
            return;
        }

        const studentID = challengeData.studentID;
        const expectedChallenge = challengeData.challenge;

        // Validate challenge code
        if (!challengeCode) {
            statusMessage.innerText = "⚠️ Please enter a challenge code.";
            statusMessage.classList.remove("loading");
            statusMessage.classList.add("warning");
            return;
        }

        // Add timeout to the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout

        // Send the challenge input to ESP32 for verification
        const response = await fetch(`http://192.168.4.1/verify?id=${studentID}&challenge=${challengeCode}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const result = await response.json();

        if (result.status === "success") {
            statusMessage.innerText = "✅ Attendance Marked Successfully!";
            statusMessage.classList.remove("loading");
            statusMessage.classList.add("success");
            challengeInput.value = ""; // Clear input

            // Store attendance data in localStorage
            const timestamp = new Date().toISOString();
            const attendanceRecord = {
                studentID: studentID,
                timestamp: timestamp,
                verificationStatus: "confirmed"
            };

            // Get existing queued records or initialize an empty array
            const queuedRecords = JSON.parse(localStorage.getItem("queuedAttendance")) || [];
            queuedRecords.push(attendanceRecord);
            localStorage.setItem("queuedAttendance", JSON.stringify(queuedRecords));

            // Alert the user to disconnect from the hotspot
            setTimeout(() => {
                alert(
                    "Attendance recorded locally. Please disconnect from 'BAARS-Hotspot' and connect to a network with internet access to sync your attendance data to the cloud."
                );
            }, 1000); // Show alert after 1 second to ensure the success message is visible
        } else {
            statusMessage.innerText = `❌ ${result.message}`;
            statusMessage.classList.remove("loading");
            statusMessage.classList.add("error");
        }
    } catch (error) {
        statusMessage.innerText = "⚠️ Error connecting to ESP32. Check your network.";
        statusMessage.classList.remove("loading");
        statusMessage.classList.add("warning");
        console.error("Error:", error);
    }
});

// Function to sync queued data to Firebase when internet is available
async function syncQueuedData() {
    const queuedRecords = JSON.parse(localStorage.getItem("queuedAttendance")) || [];
    if (queuedRecords.length === 0) return;

    try {
        // Check if internet is available
        await fetch("https://www.google.com", { mode: "no-cors" }); // Simple internet check

        // Initialize Firebase (uncomment when Firebase is set up)
        /*
        const firebaseConfig = {
            apiKey: "your-api-key",
            authDomain: "your-project-id.firebaseapp.com",
            projectId: "your-project-id",
            storageBucket: "your-project-id.appspot.com",
            messagingSenderId: "your-sender-id",
            appId: "your-app-id"
        };
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();
        */

        // Sync each queued record to Firebase
        for (const record of queuedRecords) {
            await db.collection("attendance").add(record);
            console.log(`Synced attendance for ${record.studentID} at ${record.timestamp}`);
        }

        // Clear queued records after successful sync
        localStorage.removeItem("queuedAttendance");
        alert("Attendance data successfully synced to the cloud!");
    } catch (error) {
        console.error("Failed to sync data:", error);
        // If sync fails, the data remains in localStorage for the next attempt
    }
}

// Check for internet and sync data when the network changes or page loads
window.addEventListener("online", syncQueuedData);
window.addEventListener("load", syncQueuedData);