/* global CMS, createClass, h */
/**
 * Article preview for the Avencyx editorial app: replicates the markup of
 * src/components/InsightArticle.astro and loads the site's compiled CSS
 * (editorial/preview.css, exported from the build) so the preview uses the
 * production tokens, fonts and component classes. Keep the class strings in
 * sync with InsightArticle.astro when that template changes.
 */
CMS.registerPreviewStyle("/preview.css");

const PROSE =
  "prose mt-12 max-w-none [&_a]:text-sky [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l [&_blockquote]:border-sky/40 [&_blockquote]:pl-5 [&_code]:text-sky [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-white [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white [&_li]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-text [&_p]:my-5 [&_p]:leading-relaxed [&_p]:text-text [&_strong]:text-white [&_table]:my-6 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:text-sm [&_td]:border-b [&_td]:border-line [&_td]:px-3 [&_td]:py-2.5 [&_td]:align-top [&_td]:text-text [&_th]:border-b [&_th]:border-line [&_th]:px-3 [&_th]:py-2.5 [&_th]:text-left [&_th]:font-semibold [&_th]:whitespace-nowrap [&_th]:text-white [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-text";

const STRINGS = {
  en: { back: "← All insights", dateLocale: "en-GB", faq: "Frequently asked questions" },
  ro: { back: "← Toate articolele", dateLocale: "ro-RO", faq: "Întrebări frecvente" },
};

function formatDate(value, locale) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(date);
}

const InsightPreview = createClass({
  render: function () {
    const { entry, widgetFor } = this.props;
    const path = entry.get("path") || "";
    const lang = /(^|\/)ro\//.test(path) ? "ro" : "en";
    const t = STRINGS[lang];
    const title = entry.getIn(["data", "title"]) || "";
    const description = entry.getIn(["data", "description"]) || "";
    const publishDate = entry.getIn(["data", "publishDate"]);
    // The entry is an Immutable Map; list fields come back as Immutable
    // Lists of Maps, so convert before reading plain properties.
    const faqRaw = entry.getIn(["data", "faq"]);
    const faqList = faqRaw && typeof faqRaw.toJS === "function" ? faqRaw.toJS() : Array.isArray(faqRaw) ? faqRaw : [];
    const faq = faqList.filter((item) => item && item.q);

    return h(
      "article",
      { className: "py-20 sm:py-24" },
      h(
        "div",
        { className: "container-site max-w-3xl" },
        h(
          "nav",
          { "aria-label": "Breadcrumb", className: "text-sm text-text-muted" },
          h("span", { className: "transition-colors" }, t.back),
        ),
        h(
          "header",
          { className: "mt-8" },
          h("time", { className: "text-sm text-text-muted" }, formatDate(publishDate, t.dateLocale)),
          h("h1", { className: "mt-4 text-3xl font-semibold text-balance text-white sm:text-4xl" }, title),
          h("p", { className: "mt-4 text-lg leading-relaxed text-text" }, description),
        ),
        h("div", { className: PROSE }, widgetFor("body")),
        faq.length > 0 &&
          h(
            "section",
            { className: "mt-14 border-t border-line pt-10" },
            h("h2", { className: "text-2xl font-semibold text-white" }, t.faq),
            h(
              "div",
              { className: "mt-8 space-y-4" },
              ...faq.map((item, index) =>
                h(
                  "details",
                  { key: index, open: index === 0, className: "group rounded-(--radius-brand-lg) border border-line bg-surface" },
                  h(
                    "summary",
                    { className: "flex cursor-pointer items-center justify-between gap-4 p-6 font-semibold text-white" },
                    item.q,
                  ),
                  h("p", { className: "px-6 pb-6 text-sm leading-relaxed text-text" }, item.a || ""),
                ),
              ),
            ),
          ),
      ),
    );
  },
});

CMS.registerPreviewTemplate("insights", InsightPreview);
