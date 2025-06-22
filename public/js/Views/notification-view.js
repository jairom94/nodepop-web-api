export function buildNotification(message,type) {
    const icons = {
        success:'d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"',
        info:'d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"',
        warning:'d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"',
        error:'d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"'
    }
    return `
    <div class="notification-content">
            <div class="notification-icon">
                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        ${icons[type]}></path>
                </svg>
            </div>
            <div class="notification-text">${message}</div>
        </div>
        <button  class="notification-icon notification-close">
            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6 18 17.94 6M18 18 6.06 6"></path>
            </svg>
        </button>
    <div class="notification-progress-bar"></div>
    `
}