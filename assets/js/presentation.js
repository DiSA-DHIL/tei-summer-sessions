import Reveal from "reveal.js";
import RevealMarkdown from "reveal.js/plugin/markdown/markdown.esm.js";
import Highlight from "reveal.js/plugin/highlight/highlight.esm.js";
import RevealNotes from "reveal.js/plugin/notes/notes.esm.js";

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

document.querySelectorAll("aside").forEach((aside) => {
  if (!aside.hasAttribute("data-markdown")) {
    aside.setAttribute("data-markdown", "true");
  }
});

document.querySelectorAll("*[data-background-image]").forEach((div) => {
  if (!div.hasAttribute("data-background-size")) {
    div.setAttribute("data-background-size", "contain");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("code.language-xml > script").forEach((script) => {
    const content = script.textContent;
    const escaped = content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const parent = script.parentElement;
    parent.removeChild(script);
    parent.innerHTML = escaped;
  });
  let deck = new Reveal({
    plugins: [Highlight, RevealNotes, RevealMarkdown],
  });

  deck.initialize({
    hash: true,
    maxScale: 1.5,
  });
});
