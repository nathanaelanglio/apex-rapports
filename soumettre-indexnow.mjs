#!/usr/bin/env node
// soumettre-indexnow.mjs — signale nos pages a Bing, Yandex, Seznam et Naver.
//
// POURQUOI CE SCRIPT EXISTE.
// Mesure du 24/09/2026, refaite le 28/09 : une recherche `site:apexautomation.fr`
// ne renvoyait AUCUN resultat. Zero page indexee, alors que le site est en ligne
// depuis aout, que robots.txt autorise tout et que le sitemap declare sept pages.
// Un domaine neuf sans aucun lien entrant n'est tout simplement jamais decouvert.
//
// IndexNow resout exactement ce cas, et SANS AUCUN COMPTE : il suffit d'heberger
// un fichier-cle a la racine du site et d'appeler une URL. C'est ce qui le
// distingue de Google Search Console, qui exige une propriete verifiee sur le
// compte Google du President (et un enregistrement DNS chez IONOS).
//
// ⛔ CE SCRIPT NE COUVRE PAS GOOGLE. Google n'a jamais adopte IndexNow. Pour
//    Google, il faut la Search Console : c'est une action du President, elle
//    reste ouverte. Ce script traite Bing — donc aussi DuckDuckGo, Ecosia et
//    Yahoo, qui s'appuient sur l'index de Bing.
//
// ⛔ LA CLE ET SON FICHIER VONT ENSEMBLE. Le fichier `<cle>.txt` a la racine du
//    site doit contenir la cle, et RIEN d'autre : pas de saut de ligne ajoute,
//    pas de commentaire. IndexNow le lit pour verifier que nous possedons bien
//    le domaine. Si le fichier disparait, toutes les soumissions echouent en
//    silence (code 403), sans qu'aucune page ne le signale.
//
// usage :
//   node soumettre-indexnow.mjs            (soumet les URL du sitemap)
//   node soumettre-indexnow.mjs --verifier (verifie seulement que la cle est en ligne)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ICI = path.dirname(fileURLToPath(import.meta.url));
const HOTE = "apexautomation.fr";
const CLE = "104ca05bd2ae5caa89167265405336a5";
const FICHIER_CLE = `https://${HOTE}/${CLE}.txt`;

// ⛔ On lit les URL DANS LE SITEMAP, jamais une liste recopiee a la main :
//    une liste recopiee se perime des qu'une page est ajoutee, et personne ne
//    s'en apercoit. Le sitemap est la seule source qui fasse foi.
function lireSitemap() {
  const brut = fs.readFileSync(path.join(ICI, "sitemap.xml"), "utf8");
  const urls = [...brut.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  if (!urls.length) throw new Error("Aucune URL trouvee dans sitemap.xml. Rien n'est soumis.");
  const etrangeres = urls.filter((u) => !u.startsWith(`https://${HOTE}/`));
  if (etrangeres.length) throw new Error(`URL hors domaine dans le sitemap : ${etrangeres.join(", ")}`);
  return urls;
}

async function verifierCleEnLigne() {
  const r = await fetch(FICHIER_CLE, { headers: { "User-Agent": "APEX/1.0" } });
  if (!r.ok) return { ok: false, motif: `HTTP ${r.status}` };
  const corps = (await r.text()).trim();
  if (corps !== CLE) return { ok: false, motif: `le fichier ne contient pas la cle (recu : ${corps.slice(0, 60)})` };
  return { ok: true };
}

const urls = lireSitemap();
const v = await verifierCleEnLigne();

console.log(`  fichier-cle : ${FICHIER_CLE}`);
console.log(`  ${v.ok ? "EN LIGNE et conforme" : "INDISPONIBLE — " + v.motif}`);

if (process.argv.includes("--verifier")) process.exit(v.ok ? 0 : 1);

// ⛔ On ne soumet RIEN tant que la cle n'est pas servie : IndexNow refuserait
//    tout le lot, et un 403 global ne dit pas lequel des deux a manque.
if (!v.ok) {
  console.error("\n  Rien n'a ete soumis. GitHub Pages met une a deux minutes a publier un fichier ajoute.");
  process.exit(1);
}

console.log(`\n  ${urls.length} URL a soumettre :`);
for (const u of urls) console.log(`    ${u}`);

const reponse = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOTE, key: CLE, keyLocation: FICHIER_CLE, urlList: urls }),
});

// 200 = accepte et traite · 202 = accepte, cle en cours de verification.
// Tout le reste est un echec qui doit se voir.
console.log(`\n  reponse IndexNow : HTTP ${reponse.status}`);
if (reponse.status === 200 || reponse.status === 202) {
  console.log("  Soumis. Bing (donc DuckDuckGo, Ecosia, Yahoo), Yandex, Seznam et Naver sont prevenus.");
  console.log("  ⛔ Google n'est PAS concerne : il n'a jamais adopte IndexNow. Search Console reste a faire.");
} else {
  console.error(`  ECHEC. Corps : ${(await reponse.text()).slice(0, 300)}`);
  process.exit(1);
}
