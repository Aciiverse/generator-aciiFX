"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const baseURL = 'http://localhost:3000/api';
onInit();
function onInit() {
    // Check if token is valid
    const localTokenExp = window.localStorage.getItem('av-aciifx-tokenExp');
    if (localTokenExp) {
        const tokenExp = new Date(Number(localTokenExp)), today = new Date();
        if (tokenExp <= today) {
            // -> token not valid
            onLogout();
        }
    }
}
function onRegister() {
    return __awaiter(this, void 0, void 0, function* () {
        const email = document.getElementById('regEmail'), username = document.getElementById('regUsername'), password = document.getElementById('regPass'), passRepeat = document.getElementById('regPassRep');
        if (email.value === "" || username.value === ""
            || password.value === "" || passRepeat.value === "") {
            // -> Fields not valid
            alert("Required fields are'nt valid");
            return;
        }
        const response = yield fetch(`${baseURL}/register`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email.value,
                username: username.value,
                password: password.value,
                passwordRepeat: passRepeat.value
            })
        });
        const data = yield response.json();
        if (!response.ok) {
            alert(data.message);
            return;
        }
        alert(data.message);
    });
}
function onLogin() {
    return __awaiter(this, void 0, void 0, function* () {
        const username = document.getElementById('logInUsername'), password = document.getElementById('logInPass');
        if (username.value === ""
            || password.value === "") {
            // -> Fields not valid
            alert("Required fields are'nt valid");
            return;
        }
        const response = yield fetch(`${baseURL}/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username.value,
                password: password.value,
            })
        });
        const data = yield response.json();
        if (!response.ok) {
            alert(data.message);
            return;
        }
        window.localStorage.setItem('av-aciifx-userset', JSON.stringify(data.user));
        window.localStorage.setItem('av-aciifx-accessToken', JSON.stringify(data.token));
        window.localStorage.setItem('av-aciifx-tokenExp', JSON.stringify(data.tokenExp));
        alert(data.message);
    });
}
function onLogout() {
    window.localStorage.removeItem('av-aciifx-userset');
    window.localStorage.removeItem('av-aciifx-accessToken');
    alert('Logout');
}
//# sourceMappingURL=index.js.map