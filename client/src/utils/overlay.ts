export function overlayFilterPlugin(options = {}) {
    const color = options.color ?? "rgba(0,0,0,0.25)";
    const blur = Math.max(0, options.blur ?? 0);

    return {
        name: "overlay-filter",

        /**
         * Add a full-coverage overlay to the cloned HTML root.
         * @param {any} context
         */
        async afterClone(context) {
            const root = context.clone;
            if (!(root instanceof HTMLElement)) return; // HTML-only

            // Ensure containing block so absolute overlay anchors to the root
            if (getComputedStyle(root).position === "static") {
                root.style.position = "relative";
            }

            const overlay = document.createElement("div");
            overlay.style.position = "absolute";
            overlay.style.left = "0";
            overlay.style.top = "0";
            overlay.style.right = "0";
            overlay.style.bottom = "0";
            overlay.style.background = color;
            overlay.style.pointerEvents = "none";
            if (blur) overlay.style.filter = `blur(${blur}px)`;

            root.appendChild(overlay);
        },
    };
}
