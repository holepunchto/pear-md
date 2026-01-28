const path = require("bare-path");

const { visit } = require("unist-util-visit");

module.exports = function rehypeConvertLocalMarkdownLinks() {
  return (tree) => {
    visit(
      tree,
      (node) =>
        node.tagName === "a" &&
        node.properties.href &&
        !URL.parse(node.properties.href) &&
        node.properties.href.endsWith(".md"),
      (node) => {
        const dirname = path.dirname(node.properties.href);
        const basename = path.basename(node.properties.href);

        node.properties.href = path
          .join(dirname, basename)
          .replace(/\.md$/, ".html");
      },
    );
  };
};
