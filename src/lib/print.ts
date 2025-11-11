/* Utility to print a specific DOM element by cloning it into a hidden iframe.
   This isolates styles and avoids page-level print CSS conflicts. */

export async function printElement(
  sourceEl: HTMLElement,
  opts: { title?: string; pagePaddingMM?: number } = {},
) {
  const title = opts.title ?? document.title ?? "Document";
  const pagePaddingMM = opts.pagePaddingMM ?? 20; // inner padding for A4

  // 1) Create iframe
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.setAttribute("aria-hidden", "true");
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument!;
  const iframeWin = iframe.contentWindow!;

  // 2) Collect existing stylesheets and inline styles from the parent document (HEAD ONLY)
  const linkHrefs: string[] = Array.from(
    document.head.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
  )
    .map((l) => l.href)
    .filter(Boolean);
  const inlineStyles: string[] = Array.from(
    document.head.querySelectorAll<HTMLStyleElement>("style"),
  ).map((s) => s.textContent || "");

  // 3) Build basic HTML for the print iframe
  iframeDoc.open();
  iframeDoc.write(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  ${linkHrefs.map((href) => `<link rel="stylesheet" href="${href}" />`).join("\n")}
  <style>
    @page { size: A4; margin: 0; }
    html, body { background: #fff; margin: 0; padding: 0; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    /* Ensure the cloned document fits A4 */
    .print-root {
      width: 210mm; min-height: 297mm; margin: 0 auto; box-sizing: border-box;
      padding: ${pagePaddingMM}mm;
    }
  </style>
  ${inlineStyles.map((css) => `<style>${css}</style>`).join("\n")}
</head>
<body>
  <div class="print-root"></div>
</body>
</html>`);
  iframeDoc.close();

  // 4) Clone the element and mount it inside iframe
  const clone = sourceEl.cloneNode(true) as HTMLElement;
  const mountPoint = iframeDoc.querySelector(".print-root")!;
  mountPoint.appendChild(clone);

  // 5) Wait for stylesheets and assets inside iframe to load
  await waitForIframeStylesAndAssets(iframeDoc);

  // 6) Print
  return new Promise<void>((resolve) => {
    const cleanup = () => {
      // Delay removal slightly to allow print dialog to open
      setTimeout(() => {
        try { document.body.removeChild(iframe); } catch {}
        resolve();
      }, 100);
    };

    // Fallback cleanup
    iframeWin.addEventListener("afterprint", cleanup, { once: true });
    try {
      iframeWin.focus();
      iframeWin.print();
    } catch {
      cleanup();
    }
    // In case afterprint doesn't fire on some browsers
    setTimeout(cleanup, 3000);
  });
}

async function waitForIframeStylesAndAssets(doc: Document) {
  // Wait for link stylesheets
  const linkPromises = Array.from(doc.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')).map(
    (link) =>
      new Promise<void>((resolve) => {
        if ((link as any).sheet) return resolve();
        link.addEventListener("load", () => resolve(), { once: true });
        link.addEventListener("error", () => resolve(), { once: true });
      }),
  );

  // Wait for fonts
  const fontsPromise = (doc as any).fonts?.ready ? (doc as any).fonts.ready.catch(() => {}) : Promise.resolve();

  // Wait for images within the iframe
  const images: HTMLImageElement[] = Array.from(doc.querySelectorAll("img"));
  const imagePromises = images.map(
    (img) =>
      new Promise<void>((resolve) => {
        if (img.complete) return resolve();
        img.addEventListener("load", () => resolve(), { once: true });
        img.addEventListener("error", () => resolve(), { once: true });
      }),
  );

  await Promise.all([fontsPromise, ...linkPromises, ...imagePromises]);
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
