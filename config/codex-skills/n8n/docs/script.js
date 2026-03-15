function copyText(elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard
        .writeText(text)
        .then(() => {
            const btn = document.querySelector(
                `button[onclick="copyText('${elementId}')"]`,
            );
            const originalText = btn.innerText;
            btn.innerText = "Copied!";
            setTimeout(() => {
                btn.innerText = originalText;
            }, 2000);
        })
        .catch((err) => {
            console.error("Failed to copy: ", err);
        });
}
