import test from "brittle"; // https://github.com/holepunchto/brittle
import { unified } from "unified";
import { remarkPearPreset } from "../index.js";

test("rehypeConvertRelativePaths: converts relative paths to absolute paths", async function (t) {
  const markdown = `# Hello World`;

  const contentProcessor = unified()
    .use(remarkPearPreset)
    .use(() => (tree) => {
      tree.children.push({
        type: "element",
        tagName: "footer",
        children: [
          {
            type: "text",
            value: "Example Footer",
          },
        ],
      });
    });

  const result = `${await contentProcessor.process(markdown)}`;
  t.is(
    result,
    `
<h1 id="user-content-hello-world"><a data-heading-link href="#hello-world">#</a>Hello World</h1>
<footer>Example Footer</footer>`,
  );
});
