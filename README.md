# pear-md

markdown rendering utility for pear

## Usage

```js
const { markdownToHtml } = require("pear-md");

const result = await markdownToHtml("# Hello World");

assert(result, `<h1 id="user-content-hello-world">Hello World</h1>`);
```

```js
const { remarkPear } = require("pear-md");
const { unified } = require("unified");

const processor = unified().use(remarkPear);

assert(
  `${await processor.process("# Hello World")}`,
  `<h1 id="user-content-hello-world">Hello World</h1>`,
);
```
