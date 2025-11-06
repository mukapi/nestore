/**
 * Script pour extraire les slugs depuis le sitemap
 * et préparer un mapping pour la migration Webflow
 */

const fs = require("fs");
const path = require("path");

async function extractSlugsFromSitemap() {
  console.log("🚀 Extraction des slugs depuis le sitemap...\n");

  try {
    // Télécharger le sitemap
    console.log("📡 Téléchargement du sitemap...");
    const response = await fetch("https://linguana.nestore.com/sitemap.xml");
    const sitemapXml = await response.text();

    // Parser le XML pour extraire les URLs
    const urlMatches = sitemapXml.match(/<loc>(.*?)<\/loc>/g);
    
    if (!urlMatches) {
      console.error("❌ Aucune URL trouvée dans le sitemap");
      return;
    }

    console.log(`✅ ${urlMatches.length} URLs trouvées dans le sitemap\n`);

    // Extraire les slugs (enlever le domaine)
    const slugs = urlMatches
      .map((match) => {
        const url = match.replace(/<\/?loc>/g, "");
        const urlObj = new URL(url);
        return urlObj.pathname; // Retourne juste le chemin (ex: /boutiques/showroom-rue-palestro)
      })
      .filter((slug) => slug !== "/" && slug.length > 1) // Filtrer la racine
      .map((slug) => slug.replace(/^\//, "")); // Enlever le slash initial

    // Sauvegarder dans un fichier
    const outputPath = path.join(__dirname, "slugs-fr-from-sitemap.txt");
    fs.writeFileSync(outputPath, slugs.join("\n"), "utf-8");

    console.log(`✅ ${slugs.length} slugs extraits et sauvegardés dans: ${outputPath}\n`);

    // Afficher quelques exemples
    console.log("📋 Exemples de slugs extraits:");
    slugs.slice(0, 10).forEach((slug, i) => {
      console.log(`   ${i + 1}. ${slug}`);
    });
    console.log("   ...\n");

    // Créer aussi un CSV avec juste les slugs français (pour référence)
    const csvPath = path.join(__dirname, "slugs-mapping-template.csv");
    const csvHeader = "slug_fr,slug_en,item_id,item_name\n";
    const csvRows = slugs.map((slug) => `${slug},,,\n`).join("");
    fs.writeFileSync(csvPath, csvHeader + csvRows, "utf-8");

    console.log(`📄 Template CSV créé: ${csvPath}`);
    console.log("   Vous pouvez le compléter avec les slugs anglais et les IDs des items CMS\n");

    return slugs;
  } catch (error) {
    console.error("❌ Erreur lors de l'extraction:", error.message);
  }
}

extractSlugsFromSitemap();

