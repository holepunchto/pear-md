const { SKIP, visit } = require("unist-util-visit");
const { headingRank } = require("hast-util-heading-rank");
const { h } = require("hastscript");

/**
 * Gives all headings clickable links to their corresponding anchor tags
 * (Note: this does NOT set heading ids and is only needed when rendering a page)
 */
module.exports = function rehypeHeadingLinks() {
  return (tree) => {
    visit(
      tree,
      (node) => headingRank(node),
      (heading, index, parent) => {
        parent.children[index] = h("div.heading-link", [
          h(
            "a",
            { href: `#${heading.properties.id}` },
            h(heading.tagName, "#"),
          ),
          heading,
        ]);
        return SKIP;
      },
    );
  };
};
