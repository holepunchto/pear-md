const { selectAll } = require("hast-util-select");
const { SKIP, visit } = require("unist-util-visit");

/**
 * wraps tables with a .table-container div
 */
module.exports = function rehypeWrapTables() {
  return (tree) => {
    visit(
      tree,
      (node) => node.type === "element" && node.tagName === "table",
      (table, index, parent) => {
        if (
          parent.tagName === "div" &&
          parent.properties?.class === "table-container"
        ) {
          return SKIP;
        }
        const thList = selectAll("thead th", table);
        const hasContent = thList.find((h) => h.children.length > 0);
        if (!hasContent) {
          table.children = table.children.filter((n) => n.tagName !== "thead");
        }
        parent.children[index] = {
          type: "element",
          tagName: "div",
          properties: {
            className: "table-container",
          },
          children: [table],
        };
      },
    );
  };
};
