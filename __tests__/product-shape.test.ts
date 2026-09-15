import fs from "node:fs";
import path from "node:path";

const root = path.join(__dirname, "..");

const read = (relativePath: string) => fs.readFileSync(path.join(root, relativePath), "utf8");

const walk = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const next = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git" || entry.name === ".expo") {
        return [];
      }
      return walk(next);
    }
    return [next];
  });

describe("product shape", () => {
  test("keeps screens, features, theme, contracts, and default cover", () => {
    const required = [
      "src/screens/sheet-list-screen.tsx",
      "src/screens/session-screen.tsx",
      "src/features/list/api.ts",
      "src/features/list/hooks.ts",
      "src/features/list/types.ts",
      "src/features/session/api.ts",
      "src/features/session/hooks.ts",
      "src/features/session/types.ts",
      "src/theme/unistyles.ts",
      "contracts/session-restore.json",
      "contracts/sheet-list.json",
      "fixtures/cover-normal.png",
      "fixtures/cover-large.png",
    ];

    required.forEach((relativePath) => {
      expect(fs.existsSync(path.join(root, relativePath))).toBe(true);
    });
  });

  test("uses LegendList with examId keys and never FlatList", () => {
    const srcFiles = walk(path.join(root, "src")).filter((file) => /\.(ts|tsx)$/.test(file));
    const source = srcFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");

    expect(source).toContain("LegendList");
    expect(source).toContain("recycleItems");
    expect(source).toMatch(/keyExtractor=\{?\(?item\)?\s*=>\s*item\.examId/);
    expect(source).not.toMatch(/\bFlatList\b/);
  });

  test("does not ship restore-demo or force-duplicate controls", () => {
    const srcFiles = walk(path.join(root, "src"));
    const source = srcFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");

    expect(source).not.toMatch(/restore-demo|restoreDemo|RestoreDemo/);
    expect(source).not.toMatch(/force-duplicate|forceDuplicate|ForceDuplicate/);
  });

  test("keeps 200-row, duplicate-only, and huge cover fixtures out of production", () => {
    const srcFiles = walk(path.join(root, "src"));
    const source = srcFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");

    expect(source).not.toMatch(/cover-large/);
    expect(source).not.toMatch(/createStressExams/);
    expect(source).not.toMatch(/duplicatePages:\s*3/);
    expect(fs.existsSync(path.join(root, "fixtures/cover-large.png"))).toBe(true);
  });

  test("README leads with exam picking, not LegendList", () => {
    const readme = read("README.md").trim();
    const firstSentence = readme.split(/[.!?]/)[0];

    expect(firstSentence).not.toMatch(/LegendList/i);
    expect(firstSentence).toMatch(/시험지|exam/i);
  });
});
