document.addEventListener("DOMContentLoaded", () => {

    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    if (registerForm) {
        registerForm.addEventListener("submit", registerUser);
    }

    if (loginForm) {
        loginForm.addEventListener("submit", loginUser);
    }
});


async function registerUser(event) {

    event.preventDefault();

    const message = document.getElementById("message");

    const data = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        password: document.getElementById("password").value,

        preferredDestination:
            document.getElementById("preferredDestination").value.trim(),

        budget:
            Number(document.getElementById("budget").value) || 0,

        tripDuration:
            Number(document.getElementById("tripDuration").value) || 1,

        interests:
            document.getElementById("interests").value.trim()
    };

    if (!data.name || !data.email || !data.password) {
        message.textContent = "Please fill all required fields.";
        message.className = "error-message";
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/auth/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.detail || "Registration failed");
        }

        message.textContent =
            "Registration successful. Redirecting to login...";

        message.className = "success-message";

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);

    } catch (error) {

        message.textContent = error.message;
        message.className = "error-message";
    }
}


async function loginUser(event) {

    event.preventDefault();

    const message = document.getElementById("message");

    const data = {
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value
    };

    try {

        const response = await fetch(
            `${API_BASE_URL}/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.detail || "Login failed");
        }

        saveLogin(result);

        if (result.user.role === "ADMIN") {
            window.location.href = "admin.html";
        } else {
            window.location.href = "dashboard.html";
        }

    } catch (error) {

        message.textContent = error.message;
        message.className = "error-message";
    }
}