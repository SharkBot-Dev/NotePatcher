import { initSearchFilter } from "./patchs/searchFilter.js"

async function init() {
    console.log("NotePatcherReady.")

    initSearchFilter();
}

if (location.href.startsWith("https://note.com")) {
    init();
}