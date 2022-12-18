const identityProviderUri = "http://localhost:8080/realms/isz-realm/protocol/openid-connect";
const authUri = `${identityProviderUri}/auth`;
const userUri = `${identityProviderUri}/userinfo`;
const tokenUri = `${identityProviderUri}/token`;
const logoutUri = `${identityProviderUri}/logout`;
const clientId = "isz-app";
const redirectUri = `${location.origin}/auth`;
const logoutRedirectUrl = `${location.origin}/`;

let currentPromise = Promise.resolve();

interface TokenData {
    id_token: string;
    id_token_expires_in: number;
    access_token: string;
    expires_in: number;
    refresh_token: string;
    refresh_expires_in: number;
    token_type: string;
    session_state: string;
    scope: string;
}

export interface User {
    sub: string;
    preferred_username: string;
    DOB: string;
    organization: string;
}

function dec2hex(dec: number) {
    return ("0" + dec.toString(16)).substr(-2);
}

function sha256(plain: string) {
    // returns promise ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
}

function base64urlencode(a: ArrayBuffer) {
    let str = "";
    const bytes = new Uint8Array(a);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
        str += String.fromCharCode(bytes[i]);
    }

    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function generateCodeVerifier() {
    const array = new Uint32Array(56 / 2);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec2hex).join("");
}

export function generateCodeChallengeFromVerifier(v: string) {
    return sha256(v).then(base64urlencode);
}

function buildQueryString(params: Record<string, string>) {
    return Object.entries(params)
        .map(([name, value]) => `${name}=${value}`)
        .join("&");
}

function now(timestamp: number) {
    return `${timestamp * 1000 + Date.now()}`;
}

function setTokenData(c: TokenData) {
    if (
        typeof c.access_token !== "string" ||
        typeof c.refresh_token !== "string" ||
        typeof c.expires_in !== "number" ||
        typeof c.refresh_expires_in !== "number"
    ) {
        throw new Error("Invalid token data received.");
    }
    sessionStorage.setItem("access_token", c.access_token);
    sessionStorage.setItem("refresh_token", c.refresh_token);
    sessionStorage.setItem("expires_in", now(c.expires_in));
    sessionStorage.setItem(
        "refresh_token_expires_in",
        now(c.refresh_expires_in)
    );
}

function resetTokenData() {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    sessionStorage.removeItem("expires_in");
    sessionStorage.removeItem("refresh_token_expires_in");
    sessionStorage.removeItem("verifier");
}

function updateToken() {
    const data = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: buildQueryString({
            grant_type: "refresh_token",
            client_id: clientId,
            refresh_token: sessionStorage.getItem("refresh_token"),
        }),
    };

    currentPromise = fetch(tokenUri, data)
        .then((res) => {
            if (res.status === 200) {
                return res.json().then(setTokenData);
            }
            return Promise.reject(res.json());
        })
        .catch((err) => {
            console.error("Error during token update", err);
            resetTokenData();
        });
}

export function getUserInfo(): Promise<User> {
    return getToken()
        .then((token) => {
            return fetch(userUri, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
        }
        )
        .then((res) => {
            return res.json();
        })
};


export function login() {
    const verifier = generateCodeVerifier();
    sessionStorage.setItem("verifier", verifier);

    currentPromise = generateCodeChallengeFromVerifier(verifier)
        .then((challenge) =>
            buildQueryString({
                client_id: clientId,
                redirect_uri: redirectUri,
                response_type: "code",
                code_challenge: challenge,
                code_challenge_method: "S256",
            })
        )
        .then((query) => {
            location.href = `${authUri}?${query}`;
        });
}

export function getToken(): Promise<string> {
    return currentPromise.then(() => {
        const token = sessionStorage.getItem("access_token");
        if (token !== null) {
            const expires = + sessionStorage.getItem("expires_in");
            if (Date.now() > expires) {
                updateToken();
                return getToken();
            }
        }

        return token;
    });
}

export function isLoggedIn() {
    return getToken().then(
        (token) => token !== null,
        () => false
    );
}

export function logout() {
    const url = encodeURIComponent(logoutRedirectUrl);
    resetTokenData();
    location.href = `${logoutUri}?redirect_uri=${url}`;
}

if (location.pathname === "/auth") {
    const verifier = sessionStorage.getItem("verifier");
    const queryParams = Object.fromEntries(
        location.search
            .substring(1)
            .split("&")
            .map((s) => s.split("="))
    );

    if (verifier && queryParams.code) {
        const data = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: buildQueryString({
                grant_type: "authorization_code",
                client_id: clientId,
                code: queryParams.code,
                redirect_uri: redirectUri,
                code_verifier: verifier,
            }),
        };

        currentPromise = fetch(tokenUri, data)
            .then((res) => {
                if (res.status === 200) {
                    return res.json().then(setTokenData);
                }

                return Promise.reject(res.json());
            })
            .catch((err) => {
                console.error("Error during token retrieval", err);
                resetTokenData();
            });
    }
}