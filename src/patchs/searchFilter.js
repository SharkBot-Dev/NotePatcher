import { getSetting } from "../lib/settings.js";
import labelsJp from "./../consts/jp_labels.js";
import { addBlackButton } from "./searchFilter/blackButton.js";
import { openBlackSetting } from "./searchFilter/blackSetting.js";

let pageObserver = null;
let currentUrl = location.href;
let initTimer = null;
let initializedUrl = null;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * DOM要素が出現するまで待機
 */
export function waitNote(timeoutMs = 10000) {
    return new Promise(resolve => {
        const find = () => document.querySelector(".contents");

        const existing = find();
        if (existing) {
            resolve(existing);
            return;
        }

        let observer;

        const timeout = setTimeout(() => {
            observer?.disconnect();
            resolve(null);
        }, timeoutMs);

        observer = new MutationObserver(() => {
            const element = find();

            if (element) {
                clearTimeout(timeout);
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    });
}

/**
 * 検索結果のフィルター
 */
async function filterSearchPage() {
    const contents = await waitNote();

    if (!contents) return;

    const blackNoteSetting = await getSetting(
        "search-filter-black-note"
    );

    if (!blackNoteSetting) return;

    let blackNotesJson;

    try {
        blackNotesJson = JSON.parse(blackNoteSetting);
    } catch (error) {
        console.error("ブラックリストのJSON解析に失敗:", error);
        return;
    }

    const blackTitles = blackNotesJson?.title ?? [];
    console.log(blackTitles)

    if (!blackTitles.length) return;

    function filterNotes(root) {
        if (!(root instanceof Element)) return;

        const elements = [];

        if (root.matches("div")) {
            elements.push(root);
        }

        elements.push(...root.querySelectorAll("div"));

        for (const elem of elements) {
            const title = elem.querySelector(":scope > h3");

            if (!title) continue;

            const text = title.textContent?.trim() ?? "";

            if (!blackTitles.some(
                blackTitle => text.includes(blackTitle)
            )) {
                continue;
            }

            const target = elem.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement;

            if (target) {
                console.log(`削除しました: ${text}`)
                target.remove();
            }
        }
    }

    function scan() {
        const currentContents = document.querySelector(".contents");

        if (!currentContents) return;

        const notes = currentContents.parentElement
            ?.parentElement
            ?.parentElement;

        if (notes) {
            filterNotes(notes);
        }
    }

    scan();

    if (pageObserver) {
        pageObserver.disconnect();
    }

    pageObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) continue;

                filterNotes(node);
            }
        }
    });

    pageObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
}

async function initializePage() {
    const url = location.href;

    if (initializedUrl === url) return;

    initializedUrl = url;

    pageObserver?.disconnect();
    pageObserver = null;

    if (url.startsWith("https://note.com/patcher/black-note")) {
        await openBlackSetting();
        return;
    }

    if (!url.startsWith("https://note.com/search")) {
        return;
    }

    const findButtonTarget = () => {
        const divs = document.querySelectorAll("div");

        return [...divs].find(
            div => div.getAttribute("aria-label") === labelsJp.searchResSort
        );
    };

    let labelDiv = findButtonTarget();

    if (!labelDiv) {
        const start = Date.now();

        while (!labelDiv && Date.now() - start < 10000) {
            await sleep(200);

            if (location.href !== url) return;

            labelDiv = findButtonTarget();
        }
    }

    if (labelDiv) {
        if (!labelDiv.textContent.includes("除外フィルター設定")) {
            addBlackButton(labelDiv);
        }
        
    } else {
        console.warn("ボタンを追加する物が見つかりません！");
    }

    if (location.href !== url) return;

    await filterSearchPage();
}

function checkPageChange() {
    if (currentUrl === location.href) return;

    currentUrl = location.href;
    initializedUrl = null;

    clearTimeout(initTimer);

    initTimer = setTimeout(() => {
        initializePage();
    }, 100);
}

export function initSearchFilter() {
    initializePage();

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    if (!history.__searchFilterPatched) {
        history.pushState = function (...args) {
            const result = originalPushState.apply(this, args);
            checkPageChange();
            return result;
        };

        history.replaceState = function (...args) {
            const result = originalReplaceState.apply(this, args);
            checkPageChange();
            return result;
        };

        history.__searchFilterPatched = true;
    }

    window.addEventListener("popstate", checkPageChange);

    setInterval(checkPageChange, 500);
}