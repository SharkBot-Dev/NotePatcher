import { protectElement } from "./../../lib/protectElement.js"
import labelsJp from "./../../consts/jp_labels.js";

export async function addBlackButton(labelDiv) {
    const button = document.createElement("div");
    button.innerHTML = `
    <button data-name="ButtonGroupItem" aria-disabled="false" aria-pressed="false" tabindex="-1" data-key="new" type="button" class="m-0 inline-flex cursor-pointer items-center justify-center overflow-hidden min-w-16 whitespace-nowrap border border-solid px-3 py-2 text-center align-top font-bold text-xs rounded-full decoration-0 border-border-default bg-surface-normal text-text-primary relative outline-0 hover:outline-0 focus:outline-0 active:outline-0 outline-none"><span data-name="reaction-overlay" aria-hidden="true" class="absolute inset-0 block overflow-hidden scale-[0.99] duration-200 transition-transform ease-in motion-reduce:scale-100 rounded-lg before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-200 before:ease-in after:absolute after:inset-0 after:opacity-0 after:transition-opacity after:duration-200 after:ease-in z-0 before:bg-reactionOverlay after:bg-reactionOverlay"></span>除外フィルター設定</button>
    `;

    button.getElementsByTagName("button")[0].addEventListener("click", () => {
        location.href = "https://note.com/patcher/black-note"
    })

    button.id = "black-note-button"
    protectElement('div[aria-label="' + labelsJp.searchResSort + '"]', button.id, () => button)

    labelDiv.appendChild(button);
}