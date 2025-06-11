import { resolve } from "path";
import { defineConfig } from "vite";
import { readdir } from "fs/promises";

const dirents = await readdir(__dirname, { withFileTypes: true });

const workshops = dirents
  .filter(
    (dirent) => dirent.isDirectory() && /\d{4}-\d{2}-\d{2}/gi.test(dirent.name)
  )
  .map(({ name }) => {
    const date = new Date(`${name}T12:00:00`);
    const label = date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    return {
      dir: name,
      label,
      date,
    };
  })
  .sort((d1, d2) => {
    return d2.date - d1.date;
  });

const replaceTemplateString = (data) => ({
  name: "list",
  transformIndexHtml(html) {
    return html.replace(/{%\s*(\w+)\s*%}/gi, (_, p1) => data[p1] || "");
  },
});

const input = {
  main: resolve(__dirname, "index.html"),
};
workshops.forEach(({ dir }) => {
  input[dir] = resolve(__dirname, dir, "index.html");
});

export default defineConfig({
  plugins: [
    replaceTemplateString({
      LIST: `<ul>${workshops
        .map(({ dir, label, date }) => {
          return `<li><a href="${dir}/index.html">${label}</a></li>`;
        })
        .join("")}</ul>`,
    }),
  ],
  build: {
    rollupOptions: {
      input,
    },
  },
});
