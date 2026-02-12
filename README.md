# pear-md

Markdown rendering utility for pear using [remark](https://github.com/remarkjs/remark). Use this to safely render markdown for use in pear appplications. Uses most of the same settings as github uses for rendering markdown, with a few exceptions/enhancements (for details see the plugins used in the preset).

## Usage

### `markdownToHtml`

To render an html string from a markdown string with default presets, use the `markdownToHtml` function.

```js
import { markdownToHtml } from "pear-md" with { imports: "./package.json" }; // bare
// import { markdownToHtml } from "pear-md"; // node

const result = await markdownToHtml("# Hello World");

assert(
  result,
  `<h1 id="user-content-hello-world"><a data-heading-link href="#hello-world">#</a>Hello World</h1>`,
);
```

### `remarkPearPreset`

If you want to do additional html processing with unified/rehype, you can use `remarkPearPreset`

```js
import { remarkPearPreset } from "pear-md" with { imports: "./package.json" }; // bare
import { unified } from "unified" with { imports: "./package.json" }; // bare
// import { remarkPearPreset } from "pear-md"; // node
// import { unified } from "unified"; // node

const processor = unified()
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

assert(
  `${await processor.process("# Hello World")}`,
  `<h1 id="user-content-hello-world">Hello World</h1><footer>Example Footer</footer>`,
);
```

### Plugins

If you want to use specific plugins from the preset (or plugins not in the preset, like `rehypeConvertRelativePaths`), you can import plugins invidiually like so:

```js
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified" with { imports: "../package.json" }; // bare
import rehypeConvertRelativePaths from "../plugins/rehypeConvertRelativePaths.js" with { // bare
  imports: "../package.json",
};
// import { unified } from "unified"; // node
// import rehypeConvertRelativePaths from "../plugins/rehypeConvertRelativePaths.js"; // node

const markdown = `[link](sample.pdf)`;

const contentProcessor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeConvertRelativePaths, {
    root: "/sample-root",
  })
  .use(rehypeStringify);

assert(
  `${await contentProcessor.process(markdown)}`,
  `<p><a href="/sample-root/sample.pdf">link</a></p>`,
);
```
