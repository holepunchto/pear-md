import test from "brittle"; // https://github.com/holepunchto/brittle
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeConvertRelativePaths from "../plugins/rehypeConvertRelativePaths.js";

test("rehypeConvertRelativePaths: converts relative paths to absolute paths", async function (t) {
  const markdown = `[link](sample.pdf)`;

  const contentProcessor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeConvertRelativePaths, {
      root: "/sample-root",
    })
    .use(rehypeStringify);

  const result = `${await contentProcessor.process(markdown)}`;
  t.is(result, `<p><a href="/sample-root/sample.pdf">link</a></p>`);
});
