import path from "path";

import { visit } from "unist-util-visit";

export default function rehypeConvertLocalMarkdownLinks() {
  return (tree) => {
    visit(
      tree,
      (node) =>
        node.tagName === "a" &&
        node.properties.href &&
        !URL.parse(node.properties.href) &&
        /\.md/.test(node.properties.href),
      (node) => {
        const dummyURL = URL.parse(`http://./${node.properties.href}`);
        let href = path.relative(
          "/",
          dummyURL.pathname.replace(/\.md$/, ".html"),
        );
        if (dummyURL.search) {
          href = `${href}${dummyURL.search}`;
        }
        if (dummyURL.hash) {
          href = `${href}${dummyURL.hash}`;
        }

        node.properties.href = href;
      },
    );
  };
}
