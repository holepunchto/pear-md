import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeFormat from "rehype-format";
import rehypePrettyCode from "rehype-pretty-code";
import { unified } from "unified";
import rehypeEmbedYoutubeLinks from "./plugins/rehypeEmbedYoutubeLinks.js";
import rehypeConvertLocalMarkdownLinks from "./plugins/rehypeConvertLocalMarkdownLinks.js";
import rehypeNameHeadings from "./plugins/rehypeNameHeadings.js";
import rehypeSanitizeMarkStyles from "./plugins/rehypeSanitizeMarkStyles.js";
import rehypeWrapTables from "./plugins/rehypeWrapTables.js";
import rehypeHeadingLinks from "./plugins/rehypeHeadingLinks.js";

const schema = JSON.parse(JSON.stringify(defaultSchema));
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

export const remarkPearPreset = {
  plugins: [
    remarkParse,
    remarkGfm,
    [remarkRehype, { allowDangerousHtml: true }],
    rehypeRaw,
    [
      rehypePrettyCode,
      {
        theme: {
          dark: "github-dark",
          light: "github-light",
        },
        defaultLang: {
          block: "plaintext",
          inline: "plaintext",
        },
      },
    ],
    rehypeConvertLocalMarkdownLinks,
    rehypeEmbedYoutubeLinks,
    rehypeNameHeadings,
    rehypeSlug,
    rehypeHeadingLinks,
    rehypeSanitizeMarkStyles,
    rehypeWrapTables,
    [rehypeSanitize, schema],
    rehypeFormat,
    rehypeStringify,
  ],
};

/**
 * Converts a markdown string to an html string
 * @param {string} input
 */
export async function markdownToHtml(input) {
  const processor = unified();
  processor.use(remarkParse).use(remarkPearPreset).use(rehypeStringify);
  return `${await processor.process(input)}`.trim();
}
