/**
 * Crawler pour récupérer les slugs anglais depuis Linguana
 * Visite chaque page, simule le changement de langue, et récupère l'URL finale
 */

const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const BASE_URL = "https://www.nestore.com";
const SLUGS_FILE = path.join(__dirname, "slugs-fr-from-sitemap.txt");
const OUTPUT_CSV = path.join(__dirname, "slugs-mapping-fr-en.csv");

async function crawlLinguanaSlugs() {
  console.log("🚀 Démarrage du crawler Linguana...\n");

  // Lire les slugs français
  const slugsFr = fs
    .readFileSync(SLUGS_FILE, "utf-8")
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`📋 ${slugsFr.length} slugs à crawler\n`);

  // Lancer le navigateur
  console.log("🌐 Lancement du navigateur...");
  const browser = await puppeteer.launch({
    headless: true, // Mode headless (invisible)
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // Configurer le viewport
  await page.setViewport({ width: 1920, height: 1080 });

  const results = [];
  let successCount = 0;
  let errorCount = 0;

  try {
    for (let i = 0; i < slugsFr.length; i++) {
      const slugFr = slugsFr[i];
      const urlFr = `${BASE_URL}/${slugFr}`;

      process.stdout.write(
        `\r[${i + 1}/${slugsFr.length}] ${slugFr}...`
      );

      try {
        // Visiter la page française
        await page.goto(urlFr, {
          waitUntil: "networkidle2",
          timeout: 30000,
        });

        // Attendre que le JS Linguana se charge et génère le switcher
        await page.waitForTimeout(3000);

        // Récupérer le lien anglais depuis le switcher Linguana
        let urlEn = null;
        let slugEn = null;

        try {
          // Chercher le lien anglais dans le switcher
          const enLink = await page.$eval(
            'a.linguana-lang-switcher-link[href*="/en"]',
            (el) => el.href
          );

          if (enLink) {
            urlEn = enLink;
            const urlObj = new URL(enLink);
            slugEn = urlObj.pathname.replace(/^\/en\/?/, "").replace(/^\//, "");
          }
        } catch (error) {
          // Si le sélecteur n'existe pas, le lien anglais n'existe peut-être pas
          console.log(`\n   ⚠️  Pas de lien EN trouvé pour: ${slugFr}`);
        }

        // Si on a trouvé un slug anglais
        if (slugEn && urlEn) {
          results.push({ slugFr, slugEn, urlFr, urlEn });
          successCount++;
        } else {
          // Pas de traduction anglaise disponible
          results.push({
            slugFr,
            slugEn: "",
            urlFr,
            urlEn: "",
          });
          console.log(`\n   ⚠️  Pas de traduction EN pour: ${slugFr}`);
        }
      } catch (error) {
        errorCount++;
        console.log(`\n   ❌ Erreur pour ${slugFr}: ${error.message}`);
        results.push({ slugFr, slugEn: "", urlFr, urlEn: "", error: error.message });
      }

      // Petite pause pour ne pas surcharger le serveur
      await page.waitForTimeout(500);
    }
  } finally {
    await browser.close();
  }

  console.log(`\n\n✅ Crawling terminé !`);
  console.log(`   ✅ Succès: ${successCount}`);
  console.log(`   ❌ Erreurs: ${errorCount}\n`);

  // Créer le CSV
  const csvHeader = "slug_fr,slug_en,url_fr,url_en\n";
  const csvRows = results
    .map((r) => {
      const slugFr = r.slugFr || "";
      const slugEn = r.slugEn || "";
      const urlFr = r.urlFr || "";
      const urlEn = r.urlEn || "";
      return `"${slugFr}","${slugEn}","${urlFr}","${urlEn}"`;
    })
    .join("\n");

  fs.writeFileSync(OUTPUT_CSV, csvHeader + csvRows, "utf-8");

  console.log(`📄 CSV créé: ${OUTPUT_CSV}\n`);

  // Afficher quelques exemples
  console.log("📋 Exemples de mapping:");
  results.slice(0, 10).forEach((r, i) => {
    if (r.slugEn && r.slugEn !== r.slugFr) {
      console.log(`   ${i + 1}. ${r.slugFr} → ${r.slugEn}`);
    }
  });
  console.log("");
}

// Vérifier que le fichier de slugs existe
if (!fs.existsSync(SLUGS_FILE)) {
  console.error(`❌ Fichier non trouvé: ${SLUGS_FILE}`);
  console.error("   Lancez d'abord: node extract-slugs-from-sitemap.js");
  process.exit(1);
}

crawlLinguanaSlugs().catch((error) => {
  console.error("❌ Erreur fatale:", error);
  process.exit(1);
});

