import assert from "node:assert/strict";
import { readdir, readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const templates = [];
const listings = JSON.parse(await readFile(new URL("listings.json", root), "utf8"));
for (const file of (await readdir(new URL("templates/", root))).sort()) {
  if (!file.endsWith(".json")) continue;
  const id = file.slice(0, -5);
  const bundle = JSON.parse(await readFile(new URL(`templates/${file}`, root), "utf8"));
  assert.match(id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.equal(bundle.format, "siaas-project-v2");
  const { project } = bundle;
  const listing = listings[id];
  assert.deepEqual(Object.keys(bundle).sort(), ["format", "project"]);
  assert(project.name && project.description);
  // Semantic identifiers only: palette values are owned by Personal PROJECT_PALETTES.
  assert(["mint", "sky", "lavender", "peach", "rose", "lemon", "aqua", "slate"].includes(project.palette), "Invalid project.palette");
  assert.match(project.color, /^#[0-9a-f]{6}$/i);
  assert(project.assistants.length > 0 && project.assistants.length <= 50);
  for (const assistant of project.assistants) {
    assert(assistant.name && assistant.description && assistant.instructions);
    assert.equal(assistant.model, null);
    assert(Array.isArray(assistant.sources) && assistant.sources.length <= 100);
    assert.equal(new Set(assistant.sources).size, assistant.sources.length);
    for (const source of assistant.sources) {
      const url = new URL(source);
      assert(["http:", "https:"].includes(url.protocol) && !url.username && !url.password);
    }
    assert.deepEqual(Object.keys(assistant).sort(), ["description", "instructions", "model", "name", "sources"]);
  }
  const orchestration = project.orchestration;
  assert(orchestration && typeof orchestration === "object" && !Array.isArray(orchestration));
  assert.deepEqual(Object.keys(orchestration).sort(), ["assistant_indices", "enabled", "instructions", "max_steps", "share_results"]);
  assert.equal(typeof orchestration.enabled, "boolean");
  assert.equal(typeof orchestration.share_results, "boolean");
  assert.equal(typeof orchestration.instructions, "string");
  assert(orchestration.instructions.length <= 4000);
  assert(Number.isInteger(orchestration.max_steps) && orchestration.max_steps >= 1 && orchestration.max_steps <= 8);
  assert(Array.isArray(orchestration.assistant_indices) && orchestration.assistant_indices.length <= 8);
  assert.equal(new Set(orchestration.assistant_indices).size, orchestration.assistant_indices.length);
  for (const index of orchestration.assistant_indices)
    assert(Number.isInteger(index) && index >= 0 && index < project.assistants.length, "Invalid orchestration assistant index");
  assert(!orchestration.enabled || (orchestration.assistant_indices.length > 0 && orchestration.assistant_indices.length <= orchestration.max_steps), "Invalid enabled orchestration budget");
  assert.deepEqual(Object.keys(project).sort(), ["assistants", "color", "description", "name", "orchestration", "palette"]);
  assert(listing.description.en && listing.description.it && Number.isInteger(listing.order));
  assert(["Education", "Hobby", "Work"].includes(listing.category));
  templates.push({ id, ...bundle, listing });
}
assert(templates.length > 0);
assert.deepEqual(Object.keys(listings).sort(), templates.map(t => t.id).sort());
templates.sort((a, b) => a.listing.order - b.listing.order || a.id.localeCompare(b.id));
const output = JSON.stringify({ version: 2, templates }, null, 2) + "\n";
const destination = new URL("catalog.json", root);
if (process.argv.includes("--check")) {
  assert.equal(await readFile(destination, "utf8"), output, "Run npm run build and commit catalog.json.");
} else {
  await writeFile(destination, output);
}
console.log(`Validated ${templates.length} portable project templates.`);
