export function protectElement(parentSelector, protectedId, createElemFunc) {
    let isRestoring = false;

    const observer = new MutationObserver((mutations) => {
        if (isRestoring) return;

        if (!document.getElementById(protectedId)) {
            const parent = document.querySelector(parentSelector);
            
            if (parent) {
                isRestoring = true;
                observer.disconnect();

                const restoredElem = createElemFunc();
                parent.appendChild(restoredElem);

                observer.observe(document.body, { 
                    childList: true, 
                    subtree: true 
                });
                
                isRestoring = false;
            }
        }
    });

    observer.observe(document.body, { 
        childList: true, 
        subtree: true 
    });
}