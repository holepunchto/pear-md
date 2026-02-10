import { visit } from "unist-util-visit";

/**
 * Ensures the only style we're allowed to add to "mark" elements is
 * "background-color" set to a hex code (strips all other mark style attributes)
 */
export default function rehypeSanitizeMarkStyles() {
  return (tree) => {
    visit(
      tree,
      (node) => node.type === "element" && node.tagName === "mark",
      (node) => {
        const match = node.properties.style.match(
          /background-color: (#[0-9a-fA-F]{3,6})/,
        );
        if (match) {
          node.properties.style = `background-color: ${match[1]};`;
        } else {
          delete node.properties.style;
        }
      },
    );
  };
}
