const API_BASE_URL = "http://127.0.0.1:8000/api";

function getToken() {
    return localStorage.getItem("travelx_token");
}

function getUser() {
    const user = localStorage.getItem("travelx_user");

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch {
        return null;
    }
}

function saveLogin(data) {
    localStorage.setItem("travelx_token", data.token);
    localStorage.setItem(
        "travelx_user",
        JSON.stringify(data.user)
    );
}

function logout() {
    localStorage.removeItem("travelx_token");
    localStorage.removeItem("travelx_user");

    window.location.href = "login.html";
}

function requireLogin() {
    if (!getToken()) {
        window.location.href = "login.html";
    }
}

function requireAdmin() {
    const user = getUser();

    if (!getToken() || !user || user.role !== "ADMIN") {
        window.location.href = "login.html";
    }
}

function authHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    };
}