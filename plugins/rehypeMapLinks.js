const path = require("bare-path");
const { visit } = require("unist-util-visit");

const URL_ATTRIBUTES = ["src", "srcSet", "href"];

/**
 * Converts all relative src, srcSet, and href paths to absolute paths
 * (but NOT absolute urls/keep host omitted)
 * @param {object} opts
 * @param {{ (src: string) => string }} opts.linkMapper
 */
module.exports = function rehypeMapLinks(opts = {}) {
  const { linkMapper } = opts;
  return (tree) => {
    visit(
      tree,
      (node) => URL_ATTRIBUTES.some((k) => node.properties?.hasOwnProperty(k)),
      (node) => {
        URL_ATTRIBUTES.forEach((k) => {
          if (node.properties.hasOwnProperty(k)) {
            const mappedUrl = linkMapper(node.properties[k]);
            if (mappedUrl) node.properties[k] = mappedUrl;
          }
        });
      },
    );
  };
};
