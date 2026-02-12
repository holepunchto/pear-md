import { visit } from "unist-util-visit";

const YOUTUBE_ID_REGEX =
  /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;

/**
 * Embeds links to youtube videos
 *
 * Will detect youtube links added to markdown in the following format:
 *
 * ```md
 * [![<ALT>](https://img.youtube.com/vi/<ID>/0.jpg)](https://www.youtube.com/watch?v=<ID>)
 * ```
 *
 * Example:
 *
 * ```md
 * [![Build with Pear - Episode 01: Developing with Pear](https://img.youtube.com/vi/y2G97xz78gU/0.jpg)](https://www.youtube.com/watch?v=y2G97xz78gU)
 * ```
 */
export default function rehypeEmbedYoutubeLinks() {
  return (tree) => {
    visit(
      tree,
      (node) =>
        node.type == "element" &&
        node.tagName == "a" &&
        node.properties.href?.match(YOUTUBE_ID_REGEX) &&
        node.children[0]?.type === "element" &&
        node.children[0]?.tagName === "img" &&
        (node.children[0]?.properties?.src ?? "").match(
          /.*img\.youtube\.com/gi,
        ),
      (node, i, parent) => {
        const result = YOUTUBE_ID_REGEX.exec(node.properties.href);
        parent.children[i] = {
          type: "element",
          tagName: "div",
          properties: {
            className: "youtube-video-player",
          },
          children: [
            {
              type: "element",
              tagName: "iframe",
              properties: {
                title: "Youtube video player",
                className: "youtube-video-player__video",
                src: `https://www.youtube-nocookie.com/embed/${result[1]}?rel=0`,
                allow:
                  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;",
                referrerpolicy: "strict-origin-when-cross-origin",
              },
            },
          ],
        };
      },
    );
  };
}
