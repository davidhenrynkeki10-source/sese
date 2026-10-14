import Swal from "sweetalert2";

function ensureToastStyles() {
  if (typeof document === "undefined" || document.getElementById("sese-swal-styles")) {
    return;
  }
  const style = document.createElement("style");
  style.id = "sese-swal-styles";
  style.textContent = `
    .sese-straight-line-toast {
      display: flex !important;
      flex-direction: row !important;
      align-items: center !important;
      padding: 10px 22px !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
      border: 1px solid #eae5da !important;
      border-radius: 4px !important;
      white-space: nowrap !important;
      width: auto !important;
      max-width: 90vw !important;
      margin-top: 14px !important;
      font-family: var(--ui-sans, sans-serif) !important;
      animation: none !important;
      transition: none !important;
      transform: none !important;
    }
    .sese-straight-line-toast,
    .sese-straight-line-toast * {
      animation: none !important;
      transition: none !important;
    }
    .sese-straight-line-toast .swal2-title {
      margin: 0 0 0 10px !important;
      font-size: 12px !important;
      font-weight: 500 !important;
      letter-spacing: 0.5px !important;
      white-space: nowrap !important;
      color: #262320 !important;
      padding: 0 !important;
    }
    .sese-straight-line-toast .swal2-icon {
      margin: 0 !important;
      width: 18px !important;
      height: 18px !important;
      border-width: 2px !important;
      animation: none !important;
    }
    .sese-straight-line-toast .swal2-icon * {
      animation: none !important;
      transition: none !important;
    }
    .sese-straight-line-toast .swal2-timer-progress-bar {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
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
  ensureToastStyles();

  return Swal.fire({
    toast: true,
    position: "top",
    icon: "success",
    title: "Product added successfully",
    showConfirmButton: false,
    timer: 2400,
    timerProgressBar: false,
    background: "#ffffff",
    color: "#262320",
    iconColor: "#166534",
    showClass: {
      popup: "swal2-noanimation",
      icon: "swal2-noanimation",
    },
    hideClass: {
      popup: "",
      icon: "",
    },
    customClass: {
      popup: "sese-straight-line-toast",
    },
    didOpen: (toast) => {
      if (onViewCart) {
        toast.style.cursor = "pointer";
        toast.onclick = () => onViewCart();
      }
    },
  });
}

export function showQuantityUpdatedAlert({
  text,
}: {
  text?: string;
} = {}) {
  ensureToastStyles();

  return Swal.fire({
    toast: true,
    position: "top",
    icon: "info",
    title: "Item quantity has been updated",
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: false,
    background: "#ffffff",
    color: "#262320",
    iconColor: "#262320",
    showClass: {
      popup: "swal2-noanimation",
      icon: "swal2-noanimation",
    },
    hideClass: {
      popup: "",
      icon: "",
    },
    customClass: {
      popup: "sese-straight-line-toast",
    },
  });
}
