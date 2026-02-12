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

test("embed youtube", async function (t) {
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
