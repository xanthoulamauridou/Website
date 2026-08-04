#!/usr/bin/env node
/**
 * Build script for Xanthoula Mavridou's portfolio site.
 *
 * Reads data/works.json + data/exhibitions.json, fills them into
 * src/template.html, copies the artwork images, and writes the
 * finished, ready-to-publish site into dist/.
 *
 * Run locally with:  node src/build.js
 * (GitHub Actions runs this automatically — see .github/workflows/deploy.yml)
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

const CATEGORY_LABELS = {
  oil: "Oil Paintings",
  ink: "Ink Drawings",
  mixed: "Mixed Media",
  sketches: "Sketches",
};
// Order categories should appear in, left to right / top to bottom.
const CATEGORY_ORDER = ["oil", "ink", "mixed", "sketches"];

function readJSON(file) {
  const full = path.join(ROOT, "data", file);
  if (!fs.existsSync(full)) return [];
  const raw = fs.readFileSync(full, "utf8");
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`Could not parse data/${file}: ${err.message}`);
  }
}

function escapeAttr(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const CLIP_SVG =
  '<svg class="clip" width="16" height="13" viewBox="0 0 16 13" fill="none" aria-hidden="true">' +
  '<rect x="1.5" y="1.5" width="13" height="4.5" rx="1" stroke="currentColor"/>' +
  '<path d="M4 6.5L2 12" stroke="currentColor" stroke-linecap="round"/>' +
  '<path d="M12 6.5L14 12" stroke="currentColor" stroke-linecap="round"/></svg>';

function metaLine(work) {
  const bits = [];
  if (work.medium) bits.push(work.medium);
  if (work.year) bits.push(work.year);
  let line = bits.join(", ");
  if (work.dimensions) line += (line ? " · " : "") + work.dimensions;
  if (work.date) line += (line ? " · " : "") + work.date;
  return line;
}

function renderFrame(imgFile, title, alt) {
  const src = `images/works/${imgFile}`;
  return (
    `<div class="frame" data-title="${escapeAttr(title)}">` +
    `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt || title)}" loading="lazy"></div>`
  );
}

function renderWork(work) {
  const images = work.images && work.images.length ? work.images : [];
  const isFeature = !!work.feature || images.length > 1 || !!work.description;

  let mediaHtml;
  if (images.length > 1) {
    mediaHtml =
      '<div class="feature-media">' +
      images.map((img) => renderFrame(img, work.title, work.alt)).join("") +
      "</div>";
  } else if (images.length === 1) {
    mediaHtml = renderFrame(images[0], work.title, work.alt);
  } else {
    mediaHtml = "";
  }

  const captionBits = [
    CLIP_SVG,
    `<span class="t-title">${escapeAttr(work.title)}</span>`,
    `<span class="t-meta">${escapeAttr(metaLine(work))}</span>`,
  ];
  if (work.description) {
    // description may contain simple inline tags like <em>, so it is not escaped
    captionBits.push(`<p class="feature-text">${work.description}</p>`);
  }

  return (
    `<figure class="artwork${isFeature ? " feature" : ""}" data-cat="${escapeAttr(work.category)}">` +
    mediaHtml +
    `<figcaption>${captionBits.join("\n        ")}</figcaption>` +
    `</figure>`
  );
}

function groupBySeries(works) {
  // Preserve JSON order; consecutive works sharing the same series/subgroup
  // key are grouped into one <div class="subgroup">.
  const groups = [];
  let current = null;
  for (const w of works) {
    const key = w.series || w.subgroup || null;
    if (!current || current.key !== key) {
      current = { key, label: w.series || w.subgroup || null, note: w.seriesNote || null, items: [] };
      groups.push(current);
    }
    current.items.push(w);
  }
  return groups;
}

function renderWorksSection(works) {
  const byCategory = {};
  for (const w of works) {
    if (!byCategory[w.category]) byCategory[w.category] = [];
    byCategory[w.category].push(w);
  }

  const categories = CATEGORY_ORDER.filter((c) => byCategory[c] && byCategory[c].length);
  // include any categories not in the known order, appended at the end
  for (const c of Object.keys(byCategory)) {
    if (!categories.includes(c)) categories.push(c);
  }

  const tabs =
    '<button class="tab active" data-cat="all" role="tab" aria-selected="true">All</button>' +
    categories
      .map(
        (c) =>
          `<button class="tab" data-cat="${escapeAttr(c)}" role="tab" aria-selected="false">${escapeAttr(
            CATEGORY_LABELS[c] || c
          )}</button>`
      )
      .join("");

  const groupsHtml = categories
    .map((cat) => {
      const label = CATEGORY_LABELS[cat] || cat;
      const subgroups = groupBySeries(byCategory[cat]);
      const subgroupsHtml = subgroups
        .map((sg) => {
          const header = sg.label
            ? `<p class="subgroup-label">${escapeAttr(sg.label)}</p>` +
              (sg.note ? `<p class="subgroup-note">${escapeAttr(sg.note)}</p>` : "")
            : "";
          return (
            `<div class="subgroup">${header}<div class="gallery">` +
            sg.items.map(renderWork).join("\n") +
            "</div></div>"
          );
        })
        .join("\n");
      return (
        `<div class="medium-group reveal" data-group="${escapeAttr(cat)}">` +
        `<h3 class="medium-title">${escapeAttr(label)}</h3>` +
        subgroupsHtml +
        "</div>"
      );
    })
    .join("\n");

  return {
    tabs: `<div class="tabs reveal" role="tablist" aria-label="Filter works by medium">${tabs}</div>`,
    works: groupsHtml,
  };
}

function renderExhibitions(exhibitions) {
  if (!exhibitions.length) {
    return '<p class="exhibition-desc">No exhibitions listed yet.</p>';
  }
  return exhibitions
    .map(
      (ex) => `
      <div class="exhibition reveal">
        ${ex.tag ? `<span class="exhibition-tag">${escapeAttr(ex.tag)}</span>` : ""}
        <h3>${escapeAttr(ex.title)}</h3>
        ${ex.venue ? `<p class="exhibition-meta">${escapeAttr(ex.venue)}</p>` : ""}
        ${ex.dates ? `<p class="exhibition-meta">${escapeAttr(ex.dates)}</p>` : ""}
        ${ex.description ? `<p class="exhibition-desc">${escapeAttr(ex.description)}</p>` : ""}
      </div>`
    )
    .join("\n");
}

function copyImages() {
  const srcDir = path.join(ROOT, "images", "works");
  const outDir = path.join(DIST, "images", "works");
  fs.mkdirSync(outDir, { recursive: true });
  if (!fs.existsSync(srcDir)) return;
  for (const file of fs.readdirSync(srcDir)) {
    fs.copyFileSync(path.join(srcDir, file), path.join(outDir, file));
  }
}

function build() {
  const works = readJSON("works.json");
  const exhibitions = readJSON("exhibitions.json");

  const template = fs.readFileSync(path.join(ROOT, "src", "template.html"), "utf8");
  const { tabs, works: worksHtml } = renderWorksSection(works);
  const exhibitionsHtml = renderExhibitions(exhibitions);

  let html = template
    .replace("<!--EXHIBITIONS-->", exhibitionsHtml)
    .replace("<!--TABS-->", tabs)
    .replace("<!--WORKS-->", worksHtml);

  fs.mkdirSync(DIST, { recursive: true });
  fs.writeFileSync(path.join(DIST, "index.html"), html, "utf8");
  copyImages();

  console.log(`Built dist/index.html — ${works.length} works, ${exhibitions.length} exhibition(s).`);
}

build();
