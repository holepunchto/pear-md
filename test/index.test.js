const test = require("brittle"); // https://github.com/holepunchto/brittle

const { markdownToHtml, remarkPear } = require("../index.js");
const { unified } = require("unified", {
  with: { imports: "../../package.json" },
});

test("convert paths", async function (t) {
  const markdown = `\
- [A](./test.md)
- [B](/test.md)
- [C](test.md)
- [D](https://example.com/test.md)
- [E](./README.md)
- [F](./other/README.md)
`;

  const result = await markdownToHtml(markdown, {
    root: "/page",
    linkMapper: (url) => (url === "/page/README.html" ? "/index.html" : url),
  });

  t.is(
    result,
    `\
<ul>
<li><a href="/page/test.html">A</a></li>
<li><a href="/test.html">B</a></li>
<li><a href="/page/test.html">C</a></li>
<li><a href="https://example.com/test.md">D</a></li>
<li><a href="/index.html">E</a></li>
<li><a href="/page/other/README.html">F</a></li>
</ul>`,
  );
});

test("name headings", async function (t) {
  const markdown = `
# Test-1<a name="one"></a>

## Two
`;
  const result = await markdownToHtml(markdown);

  t.is(
    result,
    `\
<h1 id="user-content-one">Test-1</h1>
<h2 id="user-content-two">Two</h2>`,
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
<div class="heading-link"><a href="#one"><h1>#</h1></a><h1 id="user-content-one">Test-1</h1></div>
<div class="heading-link"><a href="#two"><h2>#</h2></a><h2 id="user-content-two">Two</h2></div>
<div class="heading-link"><a href="#two-1"><h2>#</h2></a><h2 id="user-content-two-1">Two</h2></div>`,
  );
});

test("embed youtube", async function (t) {
  const markdown = `
[![Build with Pear - Episode 01: Developing with Pear](https://img.youtube.com/vi/y2G97xz78gU/0.jpg)](https://www.youtube.com/watch?v=y2G97xz78gU)
`;
  const result = await markdownToHtml(markdown);
  t.is(
    result,
    `\
<p><iframe title="Youtube video player" src="https://www.youtube-nocookie.com/embed/y2G97xz78gU?rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;" referrerpolicy="strict-origin-when-cross-origin"></iframe></p>`,
  );
});

test("wrap tables", async function (t) {
  const markdown = `\
|       |       |       |       |       |
| :---: | :---: | :---: | :---: | :---: |
| <a href="https://keet.io" data-pear="pear://keet" title="Encrypted peer-to-peer message, audio & video chat"><img src="assets/keet.svg" alt="Encrypted peer-to-peer message, audio & video chat"></a> | <a href="https://pass.pears.com" data-pear="pear://pass" title="Secure peer-to-peer password & secrets manager"><img src="assets/pearpass.svg" alt="Secure peer-to-peer password & secrets manager"></a> | &nbsp; | &nbsp; | &nbsp; |
| <a href="https://keet.io" data-pear="pear://keet" title="Encrypted peer-to-peer message, audio & video chat"><strong>Keet</strong></a> | <a href="https://pass.pears.com" data-pear="pear://pass" title="Secure peer-to-peer password & secrets manager"><strong>PearPass</strong></a> | &nbsp; | &nbsp; | &nbsp; |`;
  const result = await markdownToHtml(markdown);
  t.is(
    result,
    `<div class="table-container"><table><tbody><tr><td align="center"><a href="https://keet.io" data-pear="pear://keet" title="Encrypted peer-to-peer message, audio &#x26; video chat"><img src="assets/keet.svg" alt="Encrypted peer-to-peer message, audio &#x26; video chat"></a></td><td align="center"><a href="https://pass.pears.com" data-pear="pear://pass" title="Secure peer-to-peer password &#x26; secrets manager"><img src="assets/pearpass.svg" alt="Secure peer-to-peer password &#x26; secrets manager"></a></td><td align="center"> </td><td align="center"> </td><td align="center"> </td></tr><tr><td align="center"><a href="https://keet.io" data-pear="pear://keet" title="Encrypted peer-to-peer message, audio &#x26; video chat"><strong>Keet</strong></a></td><td align="center"><a href="https://pass.pears.com" data-pear="pear://pass" title="Secure peer-to-peer password &#x26; secrets manager"><strong>PearPass</strong></a></td><td align="center"> </td><td align="center"> </td><td align="center"> </td></tr></tbody></table></div>`,
  );
});

test("sanitize mark styles", async function (t) {
  const markdown = `<mark style="background-color: #80ff80; color: red">**stable**</mark>`;
  const result = await markdownToHtml(markdown);
  t.is(
    result,
    `<p><mark style="background-color: #80ff80;"><strong>stable</strong></mark></p>`,
  );
});

test("drop scripts", async function (t) {
  const markdown = `\
# Test

<script>alert("HI")</script>`;
  const result = await markdownToHtml(markdown);
  t.is(result, `<h1 id="user-content-test">Test</h1>`);
});
