# Migration SEO : Linguana → Webflow Localization

## 📋 Contexte du projet

**Objectif** : Migrer un site multilingue de Linguana vers Webflow Localization native tout en préservant les slugs SEO existants.

### Situation actuelle
- **Site actuel** : `linguana.nestore.com` (via Linguana)
- **Configuration** : Français (primaire) + Anglais (secondaire)
- **Problème** : Linguana ne communique pas avec Webflow Localization
- **Enjeu SEO** : Les slugs anglais actuels doivent être préservés pour ne pas perdre le trafic

### Migration prévue
1. ✅ Activer Webflow Localization sur le site
2. ⏳ Traduire le contenu avec Webflow (automatique)
3. ⏳ **Réappliquer les slugs anglais existants** (via API Webflow)
4. ⏳ Basculer de `linguana.nestore.com` vers les serveurs Webflow

---

## 🎯 Problème à résoudre

**Besoin** : Récupérer les slugs anglais actuels depuis Linguana pour les réappliquer dans Webflow après la traduction automatique.

**Contraintes** :
- Le sitemap XML (`https://linguana.nestore.com/sitemap.xml`) ne contient que les slugs français
- Linguana gère les langues via JavaScript/cookies, pas via des URLs distinctes
- L'export CSV de Linguana contient les traductions de texte, mais **pas les slugs**
- Webflow va traduire automatiquement mais générera de nouveaux slugs (différents de ceux de Linguana)

---

## ✅ Ce qui a été fait

### 1. Extraction des slugs français
- ✅ Script créé : `extract-slugs-from-sitemap.js`
- ✅ Résultat : `slugs-fr-from-sitemap.txt` (251 slugs français)
- ✅ Source : Sitemap XML de Linguana

### 2. Tentative d'export depuis Linguana
- ❌ L'export CSV depuis l'interface Linguana ne fonctionne pas (timeout serveur)
- ❌ L'export CSV récupéré manuellement ne contient que les traductions de texte, pas les slugs
- ✅ Fichier disponible : `page-a900378d-3673-480e-b781-2983c0548c6b (1).csv` (34,419 lignes de traductions)

### 3. Préparation du crawler
- ✅ Script créé : `crawler-linguana-slugs.js`
- ✅ Utilise Puppeteer pour crawler le site en simulant la langue anglaise
- ⏳ **À tester** : Le script doit être lancé pour récupérer les slugs anglais

---

## 📁 Fichiers disponibles

```
nestore/
├── README.md (ce fichier)
├── package.json
├── extract-slugs-from-sitemap.js          # Extrait les slugs FR du sitemap
├── crawler-linguana-slugs.js              # Crawle le site pour récupérer les slugs EN
├── test-linguana-language.js              # Script de test pour identifier le mécanisme de langue
├── slugs-fr-from-sitemap.txt              # 251 slugs français extraits
├── slugs-mapping-template.csv             # Template CSV pour le mapping
└── page-a900378d-3673-480e-b781-2983c0548c6b (1).csv  # Export traductions Linguana (sans slugs)
```

---

## 🚀 Prochaines étapes

### Option 1 : Crawler le site Linguana (recommandé)
**Script** : `crawler-linguana-slugs.js`

**Fonctionnement** :
1. Lit `slugs-fr-from-sitemap.txt`
2. Visite chaque URL avec Puppeteer
3. Simule le changement de langue (cookie `linguana-lang=en`)
4. Récupère l'URL finale anglaise
5. Génère `slugs-mapping-fr-en.csv`

**Installation** :
```bash
npm install puppeteer
```

**Lancement** :
```bash
node crawler-linguana-slugs.js
```

**Temps estimé** : ~10-15 minutes pour 251 pages

**Résultat attendu** : CSV avec colonnes `slug_fr,slug_en,url_fr,url_en`

---

### Option 2 : Utiliser l'API Webflow directement
**Si les items CMS existent déjà dans Webflow avec les deux locales** :
- Utiliser le MCP Webflow pour récupérer les slugs des deux locales
- Créer le mapping directement depuis Webflow

**Nécessite** :
- Site ID Webflow
- Accès MCP Webflow configuré (déjà disponible ✅)

---

### Option 3 : Screaming Frog SEO Spider
- Outil gratuit (limite 500 URLs)
- Peut crawler avec simulation de langue
- Export CSV manuel

---

## 🔧 Script final : Mise à jour des slugs dans Webflow

**À créer** : Script qui utilise l'API Webflow pour mettre à jour les slugs anglais.

**Fonctionnement prévu** :
1. Lit le CSV `slugs-mapping-fr-en.csv`
2. Récupère les items CMS depuis Webflow (via MCP ou API)
3. Pour chaque item :
   - Trouve l'item correspondant au slug français
   - Met à jour le slug anglais avec `cmsLocaleId` (locale anglaise)
4. Publie les changements

**Endpoint Webflow à utiliser** :
- `PATCH /collections/{collection_id}/items/live` avec `cmsLocaleId` pour cibler la locale anglaise
- Documentation : https://developers.webflow.com/data/reference/cms/collection-items/live-items/update-items-live

---

## ❓ Questions ouvertes / À challenger

1. **Mécanisme de langue Linguana** : Comment Linguana gère-t-il exactement le changement de langue ?
   - Cookie ? localStorage ? Paramètre URL ?
   - Le script `test-linguana-language.js` peut aider à identifier

2. **Performance du crawler** : 251 pages × 2-3 secondes = 8-12 minutes
   - Est-ce acceptable ?
   - Faut-il ajouter des retries en cas d'erreur ?

3. **Matching slugs → items CMS** : Comment faire le lien entre les slugs et les items CMS dans Webflow ?
   - Par le slug français (exact match) ?
   - Par le nom de l'item ?
   - Besoin d'un mapping manuel ?

4. **Pages statiques vs CMS** : Toutes les pages sont-elles des items CMS ?
   - Certaines pages peuvent être statiques (ex: `/contact`, `/blog`)
   - Comment gérer ces cas ?

5. **Validation** : Comment vérifier que les slugs ont bien été mis à jour ?
   - Script de vérification post-migration ?

---

## 📚 Ressources

- **Webflow Data API** : https://developers.webflow.com/data
- **Webflow Localization** : https://developers.webflow.com/data/docs/working-with-localization
- **Update CMS Items (multilingual)** : https://developers.webflow.com/data/reference/cms/collection-items/live-items/update-items-live
- **Sitemap Linguana** : https://linguana.nestore.com/sitemap.xml

---

## 💡 Notes importantes

- ⚠️ **Les slugs sont critiques pour le SEO** : Changer un slug casse tous les liens existants
- ⚠️ **Le token Linguana peut expirer** : Si besoin, récupérer un nouveau token depuis les DevTools
- ✅ **MCP Webflow est configuré** : Disponible dans Cursor pour interagir avec Webflow
- ⏳ **Le crawler n'a pas encore été testé** : À valider avec quelques URLs d'abord

---

**Dernière mise à jour** : 2025-11-06
