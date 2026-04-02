const form = document.querySelector('#sign-up-form');

form.addEventListener('submit', async(e) =>{
    e.preventDefault()
    const user = document.querySelector('#username');
    const email = document.querySelector('#email');
    const password = document.querySelector('#password');
    const password2 = document.querySelector('#password2');

    if (password.value != password2.value){
        return {error : 'password do not match'};
    }

    try{
        const res = await fetch('http://127.0.0.1:8000/signup',{
            method : 'POST',
            headers : {
                "Content-Type": "application/json"
            },
            credentials : "include",
            body : JSON.stringify({
                username : user.value,
                email : email.value,
                password : password.value
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.detail || "Signup failed");
            return;
        }

        window.location.href = '../login.html';
    
    } catch (err) {
        console.error(err);
        alert("Something went wrong");
    }
    
});