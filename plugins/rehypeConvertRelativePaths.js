const path = require("bare-path");
const { visit } = require("unist-util-visit");

const URL_ATTRIBUTES = ["src", "srcSet", "href"];

/**
 * Converts all relative src, srcSet, and href paths to absolute paths
 * (but NOT absolute urls/keep host omitted)
 * @param {object} opts
 * @param {string} opts.root
 */
module.exports = function rehypeConvertRelativePaths(opts = {}) {
  const { root } = opts;
  return (tree) => {
    visit(
      tree,
      (node) => URL_ATTRIBUTES.some((k) => node.properties?.hasOwnProperty(k)),
      (node) => {
        URL_ATTRIBUTES.forEach((k) => {
          if (
            node.properties.hasOwnProperty(k) &&
            !URL.parse(node.properties[k]) &&
            !node.properties[k].startsWith("#")
          ) {
            node.properties[k] = path.resolve(root, node.properties[k]);
          }
        });
      },
    );
  };
};
