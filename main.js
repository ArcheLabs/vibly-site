(function applySiteConfig() {
  const fallback = {
    brandName: "Vibly",
    tagline: "A personality-native network for humans and agents.",
    links: {
      github: {
        label: "GitHub",
        href: "https://github.com/ArcheLabs/vibly-site",
      },
      twitter: {
        label: "X / Twitter",
        href: "https://x.com/vibly_network",
      },
    },
    mascot: {
      src: "assets/mascot.png",
      alt: "Vibly floating mascot",
    },
    donate: {
      title: "Support Vibly",
      subtitle: "Support ongoing development through direct donation.",
      address: "REPLACE_WITH_DONATION_ADDRESS",
      explorer: {
        label: "View on Explorer",
        href: "https://etherscan.io/",
      },
      qr: {
        src: "assets/donation-qr.png",
        alt: "QR code for the Vibly donation address",
      },
      copy: [
        "This page is the current direct donation entry for Vibly.",
        "At this stage, donations are used to support ongoing development work. They do not represent any financial return, token entitlement, or governance promise.",
        "A more formal long-term coordination mechanism may be introduced later, when it is technically and operationally appropriate.",
        "Thank you for your support.",
      ],
    },
    enableFloatAnimation: true,
    enableAmbientHaze: true,
  };

  const config = {
    ...fallback,
    ...(window.VIBLY_SITE_CONFIG || {}),
    links: {
      ...fallback.links,
      ...((window.VIBLY_SITE_CONFIG || {}).links || {}),
    },
    mascot: {
      ...fallback.mascot,
      ...((window.VIBLY_SITE_CONFIG || {}).mascot || {}),
    },
    donate: {
      ...fallback.donate,
      ...((window.VIBLY_SITE_CONFIG || {}).donate || {}),
      explorer: {
        ...fallback.donate.explorer,
        ...(((window.VIBLY_SITE_CONFIG || {}).donate || {}).explorer || {}),
      },
      qr: {
        ...fallback.donate.qr,
        ...(((window.VIBLY_SITE_CONFIG || {}).donate || {}).qr || {}),
      },
    },
  };

  const isDonatePage = Boolean(document.querySelector("[data-donate-config]"));
  document.title = isDonatePage ? config.donate.title : config.brandName;
  document.body.dataset.motion = String(Boolean(config.enableFloatAnimation));
  document.body.dataset.ambient = String(Boolean(config.enableAmbientHaze));

  const description = document.querySelector('meta[name="description"]');
  if (description && isDonatePage) {
    description.setAttribute("content", config.donate.subtitle);
  } else if (description && config.tagline) {
    description.setAttribute(
      "content",
      `${config.brandName} is ${config.tagline.charAt(0).toLowerCase()}${config.tagline.slice(1)}`
    );
  }

  document.querySelectorAll('[data-config="brandName"]').forEach((node) => {
    node.textContent = config.brandName;
  });

  document.querySelectorAll('[data-config="tagline"]').forEach((node) => {
    node.textContent = config.tagline;
  });

  document.querySelectorAll("[data-config-link]").forEach((node) => {
    const key = node.dataset.configLink;
    const link = config.links[key];
    if (!link) return;

    node.textContent = link.label;
    node.setAttribute("href", link.href);
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noreferrer");
  });

  document.querySelectorAll('[data-config-image="mascot"]').forEach((node) => {
    node.setAttribute("src", resolveAssetPath(config.mascot.src));
    node.setAttribute("alt", config.mascot.alt);
  });

  document.querySelectorAll("[data-donate-config]").forEach((node) => {
    const key = node.dataset.donateConfig;
    if (!(key in config.donate)) return;
    node.textContent = config.donate[key];
  });

  document.querySelectorAll("[data-donate-link]").forEach((node) => {
    const key = node.dataset.donateLink;
    const link = config.donate[key];
    if (!link) return;

    node.textContent = link.label;
    node.setAttribute("href", link.href);
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noreferrer");
  });

  document.querySelectorAll('[data-donate-image="qr"]').forEach((node) => {
    node.setAttribute("src", resolveAssetPath(config.donate.qr.src));
    node.setAttribute("alt", config.donate.qr.alt);
  });

  document.querySelectorAll("[data-donate-copy]").forEach((node) => {
    node.replaceChildren(
      ...config.donate.copy.map((text) => {
        const paragraph = document.createElement("p");
        appendInlineText(paragraph, text);
        return paragraph;
      })
    );
  });

  setupAddressCopy(config.donate.address);
})();

function resolveAssetPath(path) {
  if (/^(https?:)?\/\//.test(path) || path.startsWith("/") || path.startsWith("../")) {
    return path;
  }

  return `${relativeRoot()}${path}`;
}

function relativeRoot() {
  const depth = window.location.pathname
    .split("/")
    .filter(Boolean)
    .filter((part) => !part.includes(".")).length;

  return depth > 0 ? "../".repeat(depth) : "";
}

function setupAddressCopy(address) {
  const button = document.querySelector("[data-copy-address]");
  if (!button) return;

  const status = document.querySelector("[data-copy-status]");
  const defaultLabel = button.textContent.trim();
  let timer;

  button.addEventListener("click", async () => {
    try {
      await copyText(address);
      button.textContent = "Copied";
      if (status) status.textContent = "Address copied.";
    } catch (error) {
      button.textContent = "Copy failed";
      if (status) status.textContent = "Select and copy the address manually.";
    }

    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      button.textContent = defaultLabel;
      if (status) status.textContent = "";
    }, 1800);
  });
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  input.remove();
}

function appendInlineText(node, text) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);

  parts.forEach((part) => {
    if (!part) return;

    if (part.startsWith("**") && part.endsWith("**")) {
      const strong = document.createElement("strong");
      strong.textContent = part.slice(2, -2);
      node.appendChild(strong);
      return;
    }

    node.appendChild(document.createTextNode(part));
  });
}
