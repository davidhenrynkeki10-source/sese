// Top banner alert matching the Jumia e-commerce banner style:
// Full-width vibrant green bar at top with checkmark icon, centered text, and circular white dismiss button.

let activeBannerTimeout: NodeJS.Timeout | null = null;
let activeBannerEl: HTMLElement | null = null;

function dismissBanner(el: HTMLElement) {
  if (!el || !el.parentNode) return;
  el.style.animation = "seseBannerSlideUp 0.22s cubic-bezier(0.4, 0, 0.2, 1) forwards";
  setTimeout(() => {
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
    if (activeBannerEl === el) {
      activeBannerEl = null;
    }
  }, 220);
}

function ensureBannerStyles() {
  if (typeof document === "undefined" || document.getElementById("sese-banner-alert-styles")) {
    return;
  }
  const style = document.createElement("style");
  style.id = "sese-banner-alert-styles";
  style.textContent = `
    @keyframes seseBannerSlideDown {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    @keyframes seseBannerSlideUp {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(-100%);
        opacity: 0;
      }
    }
    .sese-top-banner {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 42px;
      background-color: #0da059;
      color: #ffffff;
      z-index: 9999999;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
      animation: seseBannerSlideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      user-select: none;
      box-sizing: border-box;
      padding: 0 16px;
    }
    .sese-top-banner-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 13.5px;
      font-weight: 500;
      letter-spacing: 0.1px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .sese-top-banner-check {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .sese-top-banner-close {
      position: absolute;
      right: 18px;
      top: 50%;
      transform: translateY(-50%);
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #ffffff;
      border: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
      transition: transform 0.15s ease, opacity 0.15s ease;
    }
    .sese-top-banner-close:hover {
      transform: translateY(-50%) scale(1.08);
      opacity: 0.95;
    }
    @media (max-width: 600px) {
      .sese-top-banner {
        height: 38px;
        padding: 0 12px;
      }
      .sese-top-banner-content {
        font-size: 12.5px;
        gap: 6px;
      }
      .sese-top-banner-close {
        right: 10px;
        width: 18px;
        height: 18px;
      }
    }
@media (max-width: 600px) {
  .sese-top-banner {
    border: 2px solid #fff;
    border-radius: 8px;
    animation: seseBannerDance 1.5s ease-in-out;
  }
}
@keyframes seseBannerDance {
  0%, 100% { transform: translateY(0); }
  20% { transform: translateY(-4px); }
  40% { transform: translateY(4px); }
  60% { transform: translateY(-4px); }
  80% { transform: translateY(4px); }
}
  `;
  document.head.appendChild(style);
}

export function showTopBannerAlert({
  message = "Product added successfully",
  duration = 3200,
  onViewCart,
}: {
  message?: string;
  duration?: number;
  onViewCart?: () => void;
} = {}) {
  if (typeof document === "undefined") return;

  ensureBannerStyles();

  // If a banner is already visible, remove it immediately
  if (activeBannerEl && activeBannerEl.parentNode) {
    if (activeBannerTimeout) clearTimeout(activeBannerTimeout);
    activeBannerEl.parentNode.removeChild(activeBannerEl);
    activeBannerEl = null;
  }

  const banner = document.createElement("div");
  banner.className = "sese-top-banner";
  banner.setAttribute("role", "status");
  banner.setAttribute("aria-live", "polite");

  // Center content
  const content = document.createElement("div");
  content.className = "sese-top-banner-content";
  if (onViewCart) {
    content.style.cursor = "pointer";
    content.onclick = () => {
      dismissBanner(banner);
      onViewCart();
    };
  }

  // White Checkmark Icon
  const checkIcon = document.createElement("span");
  checkIcon.className = "sese-top-banner-check";
  checkIcon.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `;

  // Text label
  const label = document.createElement("span");
  label.textContent = message;

  content.appendChild(checkIcon);
  content.appendChild(label);
  banner.appendChild(content);

  // Circular white close button on right with green 'x'
  const closeBtn = document.createElement("button");
  closeBtn.className = "sese-top-banner-close";
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close notification");
  closeBtn.innerHTML = `
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0da059" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  `;
  closeBtn.onclick = (e) => {
    e.stopPropagation();
    if (activeBannerTimeout) clearTimeout(activeBannerTimeout);
    dismissBanner(banner);
  };
  banner.appendChild(closeBtn);

  // Pause auto-dismiss on hover
  banner.onmouseenter = () => {
    if (activeBannerTimeout) clearTimeout(activeBannerTimeout);
  };
  banner.onmouseleave = () => {
    if (activeBannerTimeout) clearTimeout(activeBannerTimeout);
    activeBannerTimeout = setTimeout(() => {
      dismissBanner(banner);
    }, 1800);
  };

  document.body.appendChild(banner);
  activeBannerEl = banner;

  activeBannerTimeout = setTimeout(() => {
    dismissBanner(banner);
  }, duration);
}

export function showProductAddedAlert({
  productName,
  size,
  onViewCart,
}: {
  productName?: string;
  size?: string;
  onViewCart?: () => void;
} = {}) {
  return showTopBannerAlert({
    message: "Product added successfully",
    duration: 3200,
    onViewCart,
  });
}

export function showQuantityUpdatedAlert({
  text = "Item quantity has been updated",
}: {
  text?: string;
} = {}) {
  return showTopBannerAlert({
    message: text || "Item quantity has been updated",
    duration: 3000,
  });
}
