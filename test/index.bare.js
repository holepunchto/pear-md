runTests();

async function runTests() {
  const test = (await import("brittle")).default;

  test.pause();

  await import("./markdownToHtml.test.js", {
    with: { imports: "../package.json" },
  });
  await import("./rehypeConvertRelativePaths.test.js", {
    with: { imports: "../package.json" },
  });
  await import("./remarkPearPrest.test.js", {
    with: { imports: "../package.json" },
  });

  test.resume();
}
