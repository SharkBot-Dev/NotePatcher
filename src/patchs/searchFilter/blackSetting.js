import { replaceNotFound } from "../../lib/notfoundReplacer.js";
import { setSetting, getSetting } from "./../../lib/settings.js"

export async function openBlackSetting() {
    let noteTitle = "";
    const blackNoteSetting = await getSetting("search-filter-black-note")
    if (blackNoteSetting) {
        if (JSON.parse(blackNoteSetting)) {
            noteTitle = JSON.parse(blackNoteSetting).title.join("\n")
        }
    }

    const div = document.createElement("div");
    div.className = "ntt-inline-dialog ntt-dialog"
    div.innerHTML = `
        <div class="ntt-form-replace">
        <h3>非表示にするノートのタイトル</h3>
        <p>改行で区切れます。</p>
        <textarea id="ntt-black-note-title" rows="5" cols="33">${noteTitle}</textarea><br>
        <button data-ntt-save="true">保存して閉じる</button>
        </div>
    `

    function close() {
        div.remove();
    }

    div.addEventListener('click', (event) => {
        const target = event.target instanceof Element ? event.target : null;
        if (target?.closest('[data-ntt-close="true"]')) {
            location.href = "https://note.com/search";
            return
        };

        if (target?.closest('[data-ntt-save="true"]')) {
            const blacknoteValue = document.getElementById("ntt-black-note-title").value;
            const blackNoteSplit = blacknoteValue.split("\n").filter((bnt) => bnt)

            setSetting({"search-filter-black-note": JSON.stringify({
                title: blackNoteSplit
            })})

            location.href = "https://note.com/search"
        };
    })

    replaceNotFound(div);
}