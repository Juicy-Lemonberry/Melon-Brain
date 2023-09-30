import cookie from "cookiejs";

const COOKIE_NAME = 'singadrive-session-token';

export function setSessionToken(token: string) {
    cookie.set(COOKIE_NAME, token, { expires: 30 });
}

export function getSessionToken(): string | boolean {
    return cookie.get(COOKIE_NAME);
}

export function removeSessionToken() {
    cookie.remove(COOKIE_NAME);
}