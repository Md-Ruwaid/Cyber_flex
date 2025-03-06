console.log("Content script loaded");

// Detection Configuration
const phishingKeywords = ["login", "verify", "update", "account", "secure"];
const trustedDomains = ["paypal.com", "bankofamerica.com", "examplebank.com"];

// Detection Logic
function isSuspicious(url) {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    return phishingKeywords.some(keyword => url.includes(keyword)) && 
           !trustedDomains.some(domain => hostname.includes(domain));
}

// Show warning if suspicious
if (isSuspicious(window.location.href)) {
    // Create modal elements
    const modal = document.createElement('div');
    modal.style = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 99999;
        font-family: Arial, sans-serif;
        padding: 20px;
        text-align: center;
    `;

    modal.innerHTML = `
        <div style="color: #d32f2f; font-size: 24px; margin-bottom: 15px;">⚠️</div>
        <h2 style="color: #d32f2f; margin: 0 0 15px 0; font-size: 20px;">Security Warning</h2>
        <p style="color: #333; margin-bottom: 20px; line-height: 1.5;">
            ${window.location.hostname} says<br>
            <strong>This website may be a phishing attempt!</strong><br>
            <small style="display: block; margin-top: 10px; color: #666;">
            ${window.location.pathname}
            </small>
        </p>
        <button id="phish-ok" style="
            background: #d32f2f;
            color: white;
            border: none;
            padding: 10px 25px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-bottom: 10px;
        ">OK</button>
        <div style="font-size: 12px; color: #999; margin-top: 15px;">
            © ${new Date().getFullYear()} PhishGuard Detector
        </div>
    `;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.style = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 99998;
    `;

    // Add elements to page
    document.body.append(overlay, modal);

    // Handle interactions
    document.getElementById('phish-ok').addEventListener('click', () => {
        modal.remove();
        overlay.remove();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            overlay.remove();
        }
    });
}