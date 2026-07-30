#!/usr/bin/env node
// Generates THIRD_PARTY_LICENSES.txt covering every production dependency
// bundled into the distributed container image, as required for binary
// redistribution under most OSS licenses (MIT/BSD/Apache-2.0 etc.).
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LICENSE_FILE_RE = /^(license|licence|copying)(\.(md|txt))?$/i;

function findLicenseText(dir) {
  let files;
  try {
    files = readdirSync(dir);
  } catch {
    return null;
  }
  const licenseFile = files.find((f) => LICENSE_FILE_RE.test(f));
  if (!licenseFile) return null;
  return readFileSync(join(dir, licenseFile), "utf8").trim();
}

const raw = execFileSync("pnpm", ["licenses", "list", "--json", "--prod"], {
  maxBuffer: 1024 * 1024 * 32,
}).toString();
const byLicense = JSON.parse(raw);

const packages = [];
for (const [license, pkgs] of Object.entries(byLicense)) {
  for (const pkg of pkgs) {
    packages.push({ ...pkg, license });
  }
}
packages.sort((a, b) => a.name.localeCompare(b.name));

const sections = packages.map((pkg) => {
  const header = [
    `${pkg.name}@${pkg.versions.join(", ")}`,
    `License: ${pkg.license}`,
    pkg.homepage ? `Homepage: ${pkg.homepage}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const text = findLicenseText(pkg.paths[0]);
  const body =
    text ?? "(license text not found in package; see homepage above)";

  return `${header}\n\n${body}`;
});

const banner =
  "This file lists the third-party open source dependencies bundled into\n" +
  "the clover-ui container image, along with their license texts, as\n" +
  "required for redistribution.\n";

const out = `${banner}\n${"=".repeat(80)}\n\n${sections.join(`\n\n${"=".repeat(80)}\n\n`)}\n`;

writeFileSync("THIRD_PARTY_LICENSES.txt", out);
console.log(
  `Wrote THIRD_PARTY_LICENSES.txt covering ${packages.length} packages.`,
);
