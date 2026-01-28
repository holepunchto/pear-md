const { visit, EXIT } = require("unist-util-visit");
const { headingRank } = require("hast-util-heading-rank");

/**
 * looks for all headings with an immediate child that's a link with a name
 * attribute. If so, assigns the heading the id of the link attribute and
 * deletes the link
 */
module.exports = function rehypeNameHeadings() {
  return (tree) => {
    visit(
      tree,
      (node) => headingRank(node),
      (heading) => {
        visit(
          heading,
          (n, index, parent) =>
            n.type === "element" &&
            n.tagName === "a" &&
            parent === heading &&
            n.properties.name,
          (n, i, parent) => {
            heading.properties.id = n.properties.name;
            heading.children.splice(i, 1);
            return EXIT;
          },
        );
      },
    );
  };
};
