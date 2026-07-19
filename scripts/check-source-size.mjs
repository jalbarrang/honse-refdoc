import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../src/", import.meta.url));
const violations = [];

async function visit(directory) {
  await Promise.all(
    (await readdir(directory, { withFileTypes: true })).map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await visit(path);
      if (!entry.isFile() || extname(entry.name) !== ".tsx") return;
      const source = (await readFile(path, "utf8")).replace(/\n$/, "");
      const lineCount = source.split(/\r?\n/).length;
      if (lineCount >= 100) violations.push(`${relative(root, path)}: ${lineCount} lines`);
    }),
  );
}

await visit(root);
if (violations.length > 0) {
  console.error(
    `Page/component files must be fewer than 100 lines:\n${violations.toSorted().join("\n")}`,
  );
  process.exitCode = 1;
} else {
  console.log("All page/component files are under 100 lines.");
}
