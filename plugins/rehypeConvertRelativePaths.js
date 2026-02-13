import path from "path";
import { visit } from "unist-util-visit";

const URL_ATTRIBUTES = ["src", "srcSet", "href"];

/**
 * Converts all relative src, srcSet, and href paths to absolute paths
 * (but NOT absolute urls/keep host omitted)
 * @param {object} opts
 * @param {string} opts.root
 * @param {{[prefix: string]: string}} opts.replace
 */
export default function rehypeConvertRelativePaths(opts = {}) {
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
            let newPath = path.resolve(root, node.properties[k]);
            if (opts.replace) {
              for (const [key, value] of Object.entries(opts.replace)) {
                newPath = newPath.replace(
                  new RegExp(
                    `^${key.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&")}`,
                  ),
                  value,
                );
              }
            }
            node.properties[k] = newPath;
          }
        });
      },
    );
  };
}
