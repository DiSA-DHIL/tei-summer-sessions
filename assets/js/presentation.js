import Reveal from "reveal.js";
import Markdown from "reveal.js/plugin/markdown/markdown.esm.js";
import Highlight from "reveal.js/plugin/highlight/highlight.esm.js";

let infoDivs = document.querySelectorAll(
  "section[data-background-iframe] > div"
);
infoDivs.forEach((div) => {
  let closer = document.createElement("span");
  closer.classList.add("closer");
  closer.innerHTML = "&times;";
  div.appendChild(closer);
  closer.addEventListener("click", (e) => {
    closer.parentNode.classList.add("hidden");
  });
});

document.querySelectorAll("section a").forEach((a) => {
  a.setAttribute("target", "_blank");
  a.setAttribute("ref", "noopener noreferrer");
});

document.querySelectorAll(":is(ol,ul):is(.fragmented)").forEach((list) => {
  list.querySelectorAll(":scope > li").forEach((item) => {
    item.classList.add("fragment");
  });
});

let deck = new Reveal({
  plugins: [Highlight],
});

deck.initialize({
  hash: true,
  maxScale: 1.5,
});
