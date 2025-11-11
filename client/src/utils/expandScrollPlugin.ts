import { SnapdomPlugin } from "@zumer/snapdom";

// utils/expandScrollPlugin.ts
export const expandScrollPlugin: SnapdomPlugin = () => {
    const SCOPE_ATTR = "data-force-visible";

    function makeHiddenBox(doc: Document) {
        const box = doc.createElement("div");
        box.id = "test-for-delete";
        Object.assign(box.style, {
            position: "fixed",
            left: "-10000px",
            top: "-10000px",
            width: "auto",
            height: "auto",
            visibility: "hidden",
            pointerEvents: "none",
            contain: "layout style paint",
            zIndex: "-2147483648",
        });
        return box;
    }

    function stripInlineHiding(root: HTMLElement) {
        const stack = [root];
        while (stack.length) {
            const n = stack.pop();
            if (n instanceof HTMLElement) {
                const s = n.style;
                if (s.opacity === "0") s.opacity = "";
                if (s.visibility === "hidden" || s.visibility === "collapse")
                    s.visibility = "";
                if (s.transition) s.transition = "none";
                if (s.animation) s.animation = "none";
                for (const ch of n.children) stack.push(ch as HTMLElement);
            }
        }
    }

    function injectForceCSS(doc: Document) {
        const id = "snap-force-visible";
        const css = `
      [${SCOPE_ATTR}], [${SCOPE_ATTR}] * {
        opacity: 1 !important;
        visibility: visible !important;
        animation: none !important;
        transition: none !important;
        filter: none !important;
      }
    `;
        let tag = doc.getElementById(id);
        if (!tag) {
            tag = doc.createElement("style");
            tag.id = id;
            (doc.head || doc.documentElement).appendChild(tag);
        }
        tag.textContent = css;
        tag.parentNode?.appendChild(tag); // ensure highest precedence
    }

    return {
        name: "shadow-copy-expand-force-visible",

        async beforeClone(ctx: any) {
            const src = ctx.element as HTMLElement;
            if (!(src instanceof HTMLElement)) return;

            const doc = src.ownerDocument || document;

            // ✅ عرض واقعی المان اصلی رو محاسبه کن
            const originalRect = src.getBoundingClientRect();
            const originalWidth = originalRect.width;

            const box = makeHiddenBox(doc);
            const shadow = src.cloneNode(true) as HTMLElement;

            box.appendChild(shadow);
            (doc.body || doc.documentElement).appendChild(box);

            // ✅ عرض رو ثابت نگه دار تا محتوا فشرده نشه
            shadow.style.width = `${originalWidth}px`;
            shadow.style.boxSizing = "border-box"; // مهم برای حفظ padding/border

            // Remove scroll restrictions
            shadow.style.height = "auto";
            shadow.style.maxHeight = "none";
            shadow.style.overflow = "visible";
            shadow.style.overflowY = "visible";
            shadow.style.overflowX = "visible";

            shadow.setAttribute(SCOPE_ATTR, "");
            stripInlineHiding(shadow);
            injectForceCSS(doc);

            void shadow.offsetHeight; // force reflow

            ctx.box = box;
            ctx.shadow = shadow;
            ctx.original = src;
            ctx.element = shadow;
        },

        async afterSnap(ctx: any) {
            const box = document.getElementById("test-for-delete");
            if (box && box.parentNode) {
                box.parentNode.removeChild(box);
            }
            if (ctx.box?.parentNode) {
                ctx.box.parentNode.removeChild(ctx.box);
            }
        },
    };
};
