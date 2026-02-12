import test from "brittle"; // https://github.com/holepunchto/brittle

import { markdownToHtml } from "../index.js";

test("markdownToHtml: hello world", async function (t) {
  const markdown = `# Hello World`;
  const result = await markdownToHtml(markdown);

  t.is(
    result,
    `<h1 id="user-content-hello-world"><a data-heading-link href="#hello-world">#</a>Hello World</h1>`,
  );
});

test("markdownToHtml: name headings and add headling links", async function (t) {
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

test("markdownToHtml: add heading links", async function (t) {
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

test("markdownToHtml: embed youtube", async function (t) {
  const markdown = `
[![Build with Pear - Episode 01: Developing with Pear](https://img.youtube.com/vi/y2G97xz78gU/0.jpg)](https://www.youtube.com/watch?v=y2G97xz78gU)
`;
  const result = await markdownToHtml(markdown);
  t.is(
    result,
    `\
<p>
  <div class="youtube-video-player">
    <iframe title="Youtube video player" class="youtube-video-player__video" src="https://www.youtube-nocookie.com/embed/y2G97xz78gU?rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;" referrerpolicy="strict-origin-when-cross-origin"></iframe>
  </div>
</p>`,
  );
});

test("markdownToHtml: wrap tables", async function (t) {
  const markdown = `\
|       |       |       |       |       |
| :---: | :---: | :---: | :---: | :---: |
| <a href="https://keet.io" data-pear="pear://keet" title="Encrypted peer-to-peer message, audio & video chat"><img src="assets/keet.svg" alt="Encrypted peer-to-peer message, audio & video chat"></a> | <a href="https://pass.pears.com" data-pear="pear://pass" title="Secure peer-to-peer password & secrets manager"><img src="assets/pearpass.svg" alt="Secure peer-to-peer password & secrets manager"></a> | &nbsp; | &nbsp; | &nbsp; |
| <a href="https://keet.io" data-pear="pear://keet" title="Encrypted peer-to-peer message, audio & video chat"><strong>Keet</strong></a> | <a href="https://pass.pears.com" data-pear="pear://pass" title="Secure peer-to-peer password & secrets manager"><strong>PearPass</strong></a> | &nbsp; | &nbsp; | &nbsp; |`;
  const result = await markdownToHtml(markdown);
  t.is(
    result,
    `\
<div class="table-container">
  <table>
    <tbody>
      <tr>
        <td align="center"><a href="https://keet.io" data-pear="pear://keet" title="Encrypted peer-to-peer message, audio &#x26; video chat"><img src="assets/keet.svg" alt="Encrypted peer-to-peer message, audio &#x26; video chat"></a></td>
        <td align="center"><a href="https://pass.pears.com" data-pear="pear://pass" title="Secure peer-to-peer password &#x26; secrets manager"><img src="assets/pearpass.svg" alt="Secure peer-to-peer password &#x26; secrets manager"></a></td>
        <td align="center"> </td>
        <td align="center"> </td>
        <td align="center"> </td>
      </tr>
      <tr>
        <td align="center"><a href="https://keet.io" data-pear="pear://keet" title="Encrypted peer-to-peer message, audio &#x26; video chat"><strong>Keet</strong></a></td>
        <td align="center"><a href="https://pass.pears.com" data-pear="pear://pass" title="Secure peer-to-peer password &#x26; secrets manager"><strong>PearPass</strong></a></td>
        <td align="center"> </td>
        <td align="center"> </td>
        <td align="center"> </td>
      </tr>
    </tbody>
  </table>
</div>`,
  );
});

test("markdownToHtml: sanitize mark styles", async function (t) {
  const markdown = `<mark style="background-color: #80ff80; color: red">**stable**</mark>`;
  const result = await markdownToHtml(markdown);
  t.is(
    result,
    `<p><mark style="background-color: #80ff80;"><strong>stable</strong></mark></p>`,
  );
});

test("markdownToHtml: drop scripts", async function (t) {
  const markdown = `\
# Test

<script>alert("HI")</script>`;
  const result = await markdownToHtml(markdown);
  t.is(
    result,
    `<h1 id="user-content-test"><a data-heading-link href="#test">#</a>Test</h1>`,
  );
});
