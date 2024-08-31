const baseURL = "http://localhost:3000/api";

interface DefaultResult {
    message: string;
}

interface LoginResult extends DefaultResult {
    token: string;
    tokenExp: Date;
    user: {
        email: string;
        lastLogin?: Date;
        registered: Date;
        username: string;
        uuid: string;
        verified: number;
    };
}

onInit();

function onInit() {
    // Check if token is valid
    const localTokenExp = window.localStorage.getItem("av-aciifx-tokenExp");

    if (localTokenExp) {
        const tokenExp = new Date(Number(localTokenExp)),
            today = new Date();

        if (tokenExp <= today) {
            // -> token not valid
            onLogout();
        }
    }
}

async function onRegister() {
    const email = document.getElementById("regEmail") as HTMLInputElement,
        username = document.getElementById("regUsername") as HTMLInputElement,
        password = document.getElementById("regPass") as HTMLInputElement,
        passRepeat = document.getElementById("regPassRep") as HTMLInputElement;

    if (email.value === "" || username.value === "" || password.value === "" || passRepeat.value === "") {
        // -> Fields not valid
        alert("Required fields are'nt valid");
        return;
    }

    const response = await fetch(`${baseURL}/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email.value,
            username: username.value,
            password: password.value,
            passwordRepeat: passRepeat.value,
        }),
    });
    const data: DefaultResult = await response.json();

    if (!response.ok) {
        alert(data.message);
        return;
    }

    alert(data.message);
}

async function onLogin() {
    const username = document.getElementById("logInUsername") as HTMLInputElement,
        password = document.getElementById("logInPass") as HTMLInputElement;

    if (username.value === "" || password.value === "") {
        // -> Fields not valid
        alert("Required fields are'nt valid");
        return;
    }

    const response = await fetch(`${baseURL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username.value,
            password: password.value,
        }),
    });
    const data: LoginResult = await response.json();

    if (!response.ok) {
        alert(data.message);
        return;
    }

    window.localStorage.setItem("av-aciifx-userset", JSON.stringify(data.user));
    window.localStorage.setItem("av-aciifx-accessToken", JSON.stringify(data.token));
    window.localStorage.setItem("av-aciifx-tokenExp", JSON.stringify(data.tokenExp));
    alert(data.message);
}

function onLogout() {
    window.localStorage.removeItem("av-aciifx-tokenExp");
    window.localStorage.removeItem("av-aciifx-userset");
    window.localStorage.removeItem("av-aciifx-accessToken");
    alert("Logout");
}

function onNavToServiceStatus() {
    window.open(baseURL, "_blank");
}
