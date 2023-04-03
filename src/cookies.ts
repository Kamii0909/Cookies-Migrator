document.getElementById('importButton')?.addEventListener('click', () => document.getElementById('chooseFile')?.click());
document.getElementById('chooseFile')?.addEventListener('change', readCookies)
document.getElementById('exportButton')?.addEventListener('click', saveAllCookies);

async function readCookies() {
    let fileList = (document.getElementById('chooseFile') as HTMLInputElement).files;

    if (fileList == null) {
        console.error("File is null");
        alert("File is null");
        return;
    }
    if (fileList.length > 1) {
        console.error("Too many files");
        alert("Too many files");
        return;
    }
    const file: File = fileList[0];
    file.text().then(JSON.parse).then(updateCookies);
}

async function updateCookies(cookies: chrome.cookies.Cookie[]) {
    cookies.forEach(cookie => updateSingleCookie(cookie));
}

function updateSingleCookie(cookie: chrome.cookies.Cookie) {
    chrome.cookies.set({
        url: getCookieURL(cookie),
        domain: cookie.domain,
        expirationDate: cookie.expirationDate,
        httpOnly: cookie.httpOnly,
        name: cookie.name,
        path: cookie.path,
        sameSite: cookie.sameSite,
        secure: cookie.secure,
        storeId: cookie.storeId,
        value: cookie.value
    })
}

function getCookieURL(cookie: chrome.cookies.Cookie): string {
    const domain: string = cookie.domain;
    const path: string = cookie.path;
    let url: string = "https://";
    if (domain.startsWith('www.')) {
        url += domain + path;
    }
    else if (domain.startsWith('.')) {
        url += 'www' + domain + path;
    }
    else {
        url += 'www.' + domain + path;
    }

    return url;

}

async function saveAllCookies() {
    chrome.cookies.getAll({})
        .then(JSON.stringify)
        .then(json => {
            const a: HTMLAnchorElement = document.getElementById('downloadFile') as HTMLAnchorElement;
            a.href = URL.createObjectURL(new Blob([json]));
            a.download = "cookie.json";
            a.click();
        })
}