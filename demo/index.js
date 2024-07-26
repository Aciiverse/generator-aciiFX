var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var baseURL = 'http://localhost:3000/api';
onInit();
function onInit() {
    // Check if token is valid
    var localTokenExp = window.localStorage.getItem('av-aciifx-tokenExp');
    if (localTokenExp) {
        var tokenExp = new Date(Number(localTokenExp)), today = new Date();
        if (tokenExp <= today) {
            // -> token not valid
            onLogout();
        }
    }
}
function onRegister() {
    return __awaiter(this, void 0, void 0, function () {
        var email, username, password, passRepeat, response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    email = document.getElementById('regEmail'), username = document.getElementById('regUsername'), password = document.getElementById('regPass'), passRepeat = document.getElementById('regPassRep');
                    if (email.value === "" || username.value === ""
                        || password.value === "" || passRepeat.value === "") {
                        // -> Fields not valid
                        alert("Required fields are'nt valid");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, fetch("".concat(baseURL, "/register"), {
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
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        alert('Register fetch failed');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    alert(data.message);
                    return [2 /*return*/];
            }
        });
    });
}
function onLogin() {
    return __awaiter(this, void 0, void 0, function () {
        var username, password, response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    username = document.getElementById('logInUsername'), password = document.getElementById('logInPass');
                    if (username.value === ""
                        || password.value === "") {
                        // -> Fields not valid
                        alert("Required fields are'nt valid");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, fetch("".concat(baseURL, "/login"), {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                username: username.value,
                                password: password.value,
                            })
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        alert('Login fetch failed');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    window.localStorage.setItem('av-aciifx-userset', JSON.stringify(data.user));
                    window.localStorage.setItem('av-aciifx-accessToken', JSON.stringify(data.token));
                    window.localStorage.setItem('av-aciifx-tokenExp', JSON.stringify(data.tokenExp));
                    alert(data.message);
                    return [2 /*return*/];
            }
        });
    });
}
function onLogout() {
    window.localStorage.removeItem('av-aciifx-userset');
    window.localStorage.removeItem('av-aciifx-accessToken');
    alert('Logout');
}
