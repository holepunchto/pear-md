import test from "brittle"; // https://github.com/holepunchto/brittle

import { markdownToHtml } from "../index.js" with {
  imports: "../package.json",
};

test("name headings and add headling links", async function (t) {
  const markdown = `
# Test-1<a name="one"></a>

## Two
`;
  const result = await markdownToHtml(markdown);

  t.is(
    result,
    `\
<h1 id="user-content-one"><a data-heading-link href="#one">#</a>Test-1</h1>
<h2 id="user-content-two"><a data-heading-link href="#two">#</a>Two</h2>`,
  );
});

test("add heading links", async function (t) {
  const markdown = `
# Test-1<a name="one"></a>

## Two

## Two
`;
  const result = await markdownToHtml(markdown, { addHeadingLinks: true });

  t.is(
    result,
    `\
<h1 id="user-content-one"><a data-heading-link href="#one">#</a>Test-1</h1>
<h2 id="user-content-two"><a data-heading-link href="#two">#</a>Two</h2>
<h2 id="user-content-two-1"><a data-heading-link href="#two-1">#</a>Two</h2>`,
  );
});
