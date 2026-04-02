const form = document.querySelector('.login-form');

form.addEventListener('submit' , async(e) =>{
    e.preventDefault();
    const username = document.querySelector('#username');
    const password = document.querySelector("#password");
    try{
        const res = await fetch('http://127.0.0.1:8000/login',{
            method : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials : "include",
            body : JSON.stringify({
                username : username.value,
                password : password.value
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.detail || "Login failed");
            return;
        }

        //localStorage.setItem("token", data.access_token);
        window.location.href = "http://127.0.0.1:5502/index.html";

    }catch (err) {
        console.error(err);
        alert("Something went wrong");
    }
});

function logoutUser() {
    alert("Your session has expired. Please log in again.");
    window.location.href = "login/login.html"; 
}

function setupTokenTimer() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const payloadBase64 = token.split('.')[1];
        
        const payload = JSON.parse(atob(payloadBase64));

        const expiresAt = payload.exp * 1000;
        const timeRemaining = expiresAt - Date.now();

        if (timeRemaining <= 0) {
            console.log("Token already expired!");
            logoutUser();
        } else {
            console.log(`Token expires in ${Math.round(timeRemaining / 60000)} minutes.`);
            
            setTimeout(logoutUser, timeRemaining);
        }
    } catch (error) {
        console.error("Invalid token format detected.");
        logoutUser();
    }
}

// 3. Run this the exact millisecond your dashboard loads
setupTokenTimer();