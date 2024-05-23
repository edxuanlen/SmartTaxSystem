// 将 token 存储在 cookie 中
export function setTokenCookie(token: string) {
    document.cookie = `token=${token}; path=/`;
}

export function setCookie(key: string, value: string) {
    document.cookie = `${key}=${value}; path=/`;
}

export function getCookies() {
    const cookieString = document.cookie;
    if (cookieString === '') return undefined;
    const cookies = cookieString.split('; ').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=') as [string, string];
        acc[name] = value;
        return acc;
    }, {} as Record<string, string>);
    return cookies;
}

// 从 cookie 中获取 token
export function getTokenFromCookie() {
    const cookieString = document.cookie;
    if (cookieString === '') return undefined;
    const cookies = cookieString.split('; ').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=') as [string, string];
        acc[name] = value;
        return acc;
    }, {} as Record<string, string>);
    return cookies.token;
}
export function getCookieByKey(key: string) {
    const cookieString = document.cookie;
    if (cookieString === '') return undefined;
    const cookies = cookieString.split('; ').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=') as [string, string];
        acc[name] = value;
        return acc;
    }, {} as Record<string, string>);
    return cookies.key;
}


