import test from "brittle"; // https://github.com/holepunchto/brittle
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeConvertRelativePaths from "../plugins/rehypeConvertRelativePaths.js";

test("rehypeConvertRelativePaths: readme example", async function (t) {
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

test("rehypeConvertRelativePaths: advanced example", async function (t) {
  const markdown = `\
- [pdf](sample.pdf)
- [home](README.html)
- [home-with-anchor-link](README.html#anchor-test)
- [absolute-link-with-anchor-link](/blah/README.html#anchor-test)
- [non-replaced-link](blah/README.html)
`;

  const contentProcessor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeConvertRelativePaths, {
      root: "/sample-root",
      replace: {
        "/sample-root/README.html": "/sample-root/index.html",
      },
    })
    .use(rehypeStringify);

  const result = `${await contentProcessor.process(markdown)}`;
  t.is(
    result,
    `\
<ul>
<li><a href="/sample-root/sample.pdf">pdf</a></li>
<li><a href="/sample-root/index.html">home</a></li>
<li><a href="/sample-root/index.html#anchor-test">home-with-anchor-link</a></li>
<li><a href="/blah/README.html#anchor-test">absolute-link-with-anchor-link</a></li>
<li><a href="/sample-root/blah/README.html">non-replaced-link</a></li>
</ul>`,
  );
});
