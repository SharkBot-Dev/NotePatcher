export async function replaceNotFound(elem) {
    Array.from(document.getElementsByTagName("script")).forEach((script) => script.remove());
    document.getElementById("__nuxt").remove();
    document.body.appendChild(elem);
}