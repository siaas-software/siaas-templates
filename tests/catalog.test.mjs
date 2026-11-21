import assert from 'node:assert/strict';
import test from 'node:test';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const assignments = {
  'computer-science-study': 'sky', 'production-planning': 'slate',
  'personal-finance': 'mint', 'construction-cost-analysis': 'peach',
  'technical-documentation': 'lavender', 'materials-procurement': 'aqua',
  'pdf-maintenance-acceptance': 'lavender',
  'spreadsheet-purchase-reconciliation': 'aqua',
};
test('eight official semantic assignments and portable catalog parity', () => {
  const catalog = JSON.parse(readFileSync('catalog.json', 'utf8'));
  assert.equal(catalog.version, 2);
  assert.deepEqual(catalog.templates.map(t => t.id).sort(), Object.keys(assignments).sort());
  for (const { id, listing, ...bundle } of catalog.templates) {
    assert.equal(bundle.format, 'siaas-project-v2');
    assert.equal(bundle.project.palette, assignments[id]);
    assert.deepEqual(bundle.project.orchestration.assistant_indices, bundle.project.assistants.map((_, i) => i));
    assert.equal(bundle.project.orchestration.enabled, false);
    assert.deepEqual(bundle, JSON.parse(readFileSync(`templates/${id}.json`, 'utf8')));
  }
});
test('catalog builds reproducibly and rejects missing or unknown official palette keys', () => {
  const directory = mkdtempSync(join(tmpdir(), 'siaas-catalog-'));
  try {
    for (const path of ['scripts', 'templates', 'listings.json', 'catalog.json'])
      cpSync(path, join(directory, path), { recursive: true });
    const build = () => spawnSync(process.execPath, ['scripts/build-catalog.mjs'], { cwd: directory, encoding: 'utf8' });
    const original = readFileSync(join(directory, 'catalog.json'), 'utf8');
    assert.equal(build().status, 0);
    assert.equal(readFileSync(join(directory, 'catalog.json'), 'utf8'), original);
    const path = join(directory, 'templates/personal-finance.json');
    const bundle = JSON.parse(readFileSync(path, 'utf8'));
    for (const palette of ['unknown', '', null, undefined]) {
      bundle.project.palette = palette;
      writeFileSync(path, JSON.stringify(bundle));
      const result = build();
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /Invalid project.palette/);
      assert.equal(readFileSync(join(directory, 'catalog.json'), 'utf8'), original);
    }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('rejects malformed v2 orchestration indexes and enabled budgets', () => {
  const directory = mkdtempSync(join(tmpdir(), 'siaas-orchestrator-v2-'));
  try {
    for (const path of ['scripts', 'templates', 'listings.json', 'catalog.json'])
      cpSync(path, join(directory, path), { recursive: true });
    const path = join(directory, 'templates/computer-science-study.json');
    const original = JSON.parse(readFileSync(path, 'utf8'));
    const build = () => spawnSync(process.execPath, ['scripts/build-catalog.mjs'], { cwd: directory, encoding: 'utf8' });
    for (const value of [
      { assistant_indices: [0, 0] }, { assistant_indices: [99] },
      { assistant_indices: [-1] }, { assistant_indices: ['0'] },
      { enabled: true, assistant_indices: [] },
      { enabled: true, assistant_indices: [0, 1, 2], max_steps: 2 },
      { max_steps: 9 }
    ]) {
      const next = structuredClone(original);
      next.project.orchestration = { ...next.project.orchestration, ...value };
      writeFileSync(path, JSON.stringify(next));
      assert.notEqual(build().status, 0, JSON.stringify(value));
    }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('two Gemma example templates are offline, scoped and role-separated', () => {
  const catalog = JSON.parse(readFileSync('catalog.json', 'utf8'));
  for (const id of ['pdf-maintenance-acceptance', 'spreadsheet-purchase-reconciliation']) {
    const template = catalog.templates.find(t => t.id === id);
    assert(template, id);
    assert.equal(template.project.assistants.length, 2);
    assert.deepEqual(template.project.orchestration.assistant_indices, [0, 1]);
    assert.equal(template.project.orchestration.max_steps, 2);
    assert.equal(template.project.orchestration.enabled, false);
    assert.equal(template.project.orchestration.share_results, false);
    for (const agent of template.project.assistants) {
      assert.equal(agent.model, null);
      assert.deepEqual(agent.sources, []);
      assert(agent.instructions.length > 200 && agent.instructions.length <= 6000);
    }
  }
});
test('synthetic invoice fixture is internally consistent without model computation', () => {
  const folder = 'examples/gemma-spreadsheet-purchase-reconciliation/';
  const csv = f => readFileSync(folder + f, 'utf8').trim().split(/\r?\n/).slice(1).map(line => line.split(','));
  const cents = v => { const [whole, fraction=''] = v.split('.'); return Number(whole) * 100 + Number(fraction.padEnd(2, '0')); };
  const ordered = csv('purchase-orders.csv');
  const invoiced = csv('supplier-invoices.csv');
  assert.equal(ordered.length, 3);
  assert.equal(invoiced.length, 3);
  const orderTotal = ordered.reduce((sum, row) => sum + Number(row[3]) * cents(row[4]), 0);
  const invoiceTotal = invoiced.reduce((sum, row) => sum + Number(row[4]) * cents(row[5]), 0);
  assert.equal(orderTotal, 29600);
  assert.equal(invoiceTotal, 26100);
  assert.equal(orderTotal - invoiceTotal, 3500);
  assert.equal(invoiced[2][5], '0.90');
  assert.equal(ordered[2][4], '0.80');
});

test('PDF synthetic acceptance fixture is a two-page searchable PDF', () => {
  const content = readFileSync('examples/gemma-pdf-maintenance-acceptance/acceptance-case.pdf');
  assert.equal(content.subarray(0, 8).toString('ascii'), '%PDF-1.4');
  assert.match(content.toString('ascii'), /\/Count 2/);
  assert.match(content.toString('ascii'), /FM-2026-017/);
  assert.match(content.toString('ascii'), /AHU-02/);
  assert.match(content.toString('ascii'), /%%EOF/);
});
