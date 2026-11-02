export async function getSetting(key) {
    try {
        const res = await chrome.storage.local.get([key]);
        return res[key]
    } catch {
        return null
    }
}

export function setSetting(items) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set(items, () => {
        if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
        } else {
            resolve();
        }
        });
    });
}