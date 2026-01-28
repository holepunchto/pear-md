const remarkParse = require("remark-parse").default;
const remarkGfm = require("remark-gfm").default;
const remarkRehype = require("remark-rehype").default;
const rehypeStringify = require("rehype-stringify").default;
const rehypeRaw = require("rehype-raw").default;
const rehypeSanitize = require("rehype-sanitize").default;
const { defaultSchema } = require("rehype-sanitize");
const rehypeSlug = require("rehype-slug").default;
const rehypePrettyCode = require("rehype-pretty-code", {
  with: { imports: "./package.json" },
}).default;
const { unified } = require("unified", {
  with: { imports: "./package.json" },
});
const rehypeMapLinks = require("./plugins/rehypeMapLinks");
const rehypeEmbedYoutubeLinks = require("./plugins/rehypeEmbedYoutubeLinks");
const rehypeConvertLocalMarkdownLinks = require("./plugins/rehypeConvertLocalMarkdownLinks");
const rehypeConvertRelativePaths = require("./plugins/rehypeConvertRelativePaths");
const rehypeNameHeadings = require("./plugins/rehypeNameHeadings");
const rehypeSanitizeMarkStyles = require("./plugins/rehypeSanitizeMarkStyles");
const rehypeWrapTables = require("./plugins/rehypeWrapTables");
const rehypeHeadingLinks = require("./plugins/rehypeHeadingLinks");

const schema = defaultSchema;
if (!schema.attributes) schema.attributes = {};
schema.attributes.div.push("className");
if (!schema.attributes.a) schema.attributes.a = [];
schema.attributes.a.push("dataPear");

if (!schema.attributes.aside) schema.attributes.aside = [];
schema.attributes.aside.push("className");
if (!schema.attributes.mark) schema.attributes.mark = [];
schema.attributes.mark.push("style");
schema.attributes.mark.push("name");
if (!schema.attributes.iframe) schema.attributes.iframe = [];
schema.attributes.iframe.push("src");
schema.attributes.iframe.push("allow");
schema.attributes.iframe.push("referrerpolicy");
if (!schema.tagNames) schema.tagNames = [];
schema.tagNames.push("mark");
schema.tagNames.push("iframe");

/**
 * Wraps headings in a section/nests sections according to their heading depth
 * @param {object} opts
 * @param {boolean} [opts.addHeadingLinks]
 * @param {string} [opts.root]
 * @param {(string) => string} [opts.linkMapper]
 */
function remarkPear(opts = {}) {
  const { addHeadingLinks, linkMapper, root } = opts;
  this.use(remarkGfm);
  this.use(remarkRehype, { allowDangerousHtml: true });
  this.use(rehypeRaw);
  this.use(rehypePrettyCode, {
    theme: {
      dark: "github-dark",
      light: "github-light",
    },
    defaultLang: {
      block: "plaintext",
      inline: "plaintext",
    },
  });
  if (root) this.use(rehypeConvertRelativePaths, { root });
  this.use(rehypeConvertLocalMarkdownLinks);
  this.use(rehypeEmbedYoutubeLinks);
  this.use(rehypeNameHeadings);
  this.use(rehypeSlug);
  if (addHeadingLinks) this.use(rehypeHeadingLinks);
  if (linkMapper) this.use(rehypeMapLinks, { linkMapper });
  this.use(rehypeSanitizeMarkStyles);
  this.use(rehypeWrapTables);
  this.use(rehypeSanitize, schema);
}

/**
 * Converts a markdown string to an html string
 * @param {string} input
 * @param {object} opts
 * @param {boolean} [opts.addHeadingLinks]
 * @param {string} [opts.root]
 * @param {(string) => string} [opts.linkMapper]
 */
async function markdownToHtml(input, opts) {
  const processor = unified();
  processor.use(remarkParse).use(remarkPear, opts).use(rehypeStringify);
  return `${await processor.process(input)}`.trim();
}

module.exports = { remarkPear, markdownToHtml };
