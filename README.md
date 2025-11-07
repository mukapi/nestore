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
2. ✅ Traduire le contenu avec Webflow (automatique)
3. ✅ **Réappliquer les slugs anglais existants** (via API Webflow MCP)
4. ⏳ Basculer de `linguana.nestore.com` vers les serveurs Webflow

---

## ✅ Checklist des collections - Mise à jour des slugs EN

### Collections à traiter

- [x] **Articles** (`5fdfeed248b60944ecc2dd90`)

  - ✅ 56 articles mis à jour sur 65 non archivés
  - ✅ Date : 2025-11-06
  - ✅ **TERMINÉ - Ne plus y toucher**

- [x] **Guide pop-up stores** (`5fdfeed248b609cd7ac2ddd0`)

  - ✅ 33 items mis à jour sur 41 non archivés
  - ✅ Date : 2025-11-06
  - ✅ **TERMINÉ - Ne plus y toucher**

- [x] **Boutiques Paris** (`5fdfeed248b6099cf9c2dda8`)

  - ✅ 9 items mis à jour sur 44 non archivés
  - ✅ Date : 2025-11-06
  - ✅ **TERMINÉ - Ne plus y toucher**

- [x] **Boutiques Frances** (`60c9c68af21f285a7d4adb9b`)

  - ✅ 1 item mis à jour sur 5 non archivés
  - ✅ Date : 2025-11-06
  - ✅ **TERMINÉ - Ne plus y toucher**

- [x] **Références** (`5fdfeed248b60975cdc2de1a`)

  - ✅ 25 items mis à jour sur 87 non archivés
  - ✅ Date : 2025-11-06
  - ✅ **TERMINÉ - Ne plus y toucher**

- [x] **Tags** (`5fdfeed248b6091ea8c2de1d`)

  - ✅ 5 items mis à jour sur 6 non archivés
  - ✅ Date : 2025-11-06
  - ✅ **TERMINÉ - Ne plus y toucher**

- [x] **Rubriques** (`5fdfeed248b609fd1ec2de19`)
  - ✅ 3 items mis à jour sur 3 non archivés (non drafts)
  - ✅ Date : 2025-11-06
  - ✅ **TERMINÉ - Ne plus y toucher**

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

### 1. Extraction et mapping des slugs

- ✅ Extraction des slugs français depuis le sitemap XML de Linguana
- ✅ Crawler Linguana pour récupérer les slugs anglais correspondants
- ✅ Résultat : `slugs-mapping-fr-en.csv` (253 mappings slug_fr → slug_en)
- ✅ Les slugs anglais ont été récupérés depuis le site Linguana

### 2. Mise à jour des slugs EN dans Webflow (via MCP)

- ✅ **Collection ciblée** : Articles (`5fdfeed248b60944ecc2dd90`)
- ✅ **Locale EN** : `690b2acd93972e10247b6eb1`
- ✅ **Articles traités** : 65 articles non archivés
- ✅ **Articles mis à jour** : 56 articles avec slugs EN corrigés
- ✅ **Source de vérité** : `slugs-mapping-fr-en.csv` (fichier de référence)
- ✅ **Méthode** : MCP Webflow `collections_items_update_items_live` (publication directe en live)
- ✅ **Résultat** : `update-slugs-en-summary.json` (résumé détaillé)

**Processus utilisé** :

1. Export des articles non archivés depuis Webflow
2. Matching des slugs FR avec `slugs-mapping-fr-en.csv`
3. Préparation des items à mettre à jour (avec `cmsLocaleId` EN)
4. Mise à jour par batches via MCP Webflow (30 + 26 items)
5. Publication directe en live

---

## 📁 Fichiers du projet

### Fichiers essentiels (à garder)

```
nestore/
├── README.md                                    # Documentation du projet
├── package.json                                 # Dépendances Node.js
├── slugs-mapping-fr-en.csv                      # ⭐ BIBLE : Mapping slug_fr → slug_en (253 lignes)
├── articles-non-archives-export.csv             # Export CSV des articles non archivés
└── update-slugs-en-summary.json                 # Résumé de la mise à jour des slugs EN
```

### Fichiers de référence

- **`slugs-mapping-fr-en.csv`** : ⭐ **Source de vérité** pour tous les slugs EN
  - Format : `slug_fr,slug_en,url_fr,url_en`
  - Contient tous les mappings pour toutes les pages du site
  - Utilisé pour mettre à jour les slugs EN dans Webflow

### Identifiants Webflow importants

- **Collection Articles** : `5fdfeed248b60944ecc2dd90`
- **Locale EN** : `690b2acd93972e10247b6eb1`

---

## 🚀 Comment réutiliser cette méthode

### Pour mettre à jour les slugs EN d'autres collections

**Prérequis** :

- ✅ MCP Webflow configuré dans Cursor
- ✅ Fichier `slugs-mapping-fr-en.csv` à jour (source de vérité)
- ✅ Collection ID et Locale ID EN de Webflow

**Processus** :

1. **Exporter les items** de la collection via MCP Webflow

   - Utiliser `collections_items_list_items` avec filtre `isArchived: false`
   - Sauvegarder dans un fichier JSON/CSV

2. **Faire le matching** avec `slugs-mapping-fr-en.csv`

   - Parser le CSV pour créer un mapping `slug_fr → slug_en`
   - Filtrer uniquement les URLs de la collection (ex: `post/` pour Articles)
   - Matcher les slugs FR des items Webflow avec le CSV

3. **Préparer les items à mettre à jour**

   - Créer un array d'items avec `id`, `cmsLocaleId` (EN), et `fieldData.slug` (nouveau slug EN)
   - Diviser en batches de 100 items max

4. **Mettre à jour via MCP Webflow**
   - Utiliser `mcp_webflow_collections_items_update_items_live`
   - Collection ID : `5fdfeed248b60944ecc2dd90` (Articles)
   - Locale EN : `690b2acd93972e10247b6eb1`
   - Les items sont publiés directement en live

**Exemple de structure d'item** :

```json
{
  "id": "item_id",
  "cmsLocaleId": "690b2acd93972e10247b6eb1",
  "fieldData": {
    "slug": "new-english-slug"
  }
}
```

---

## ✅ Résultats de la migration

### Mise à jour des slugs EN - Articles

- **Date** : 2025-11-06
- **Collection** : Articles (`5fdfeed248b60944ecc2dd90`)
- **Total articles non archivés** : 65
- **Articles mis à jour** : 56
- **Articles déjà corrects** : 5 (slug FR = EN)
- **Articles non trouvés dans CSV** : 4

### Mise à jour des slugs EN - Guide pop-up stores

- **Date** : 2025-11-06
- **Collection** : Guide pop-up stores (`5fdfeed248b609cd7ac2ddd0`)
- **Total items non archivés** : 41
- **Items mis à jour** : 33
- **Items déjà corrects** : 8 (slug FR = EN)
- **Items non trouvés dans CSV** : 0

### Mise à jour des slugs EN - Boutiques Paris

- **Date** : 2025-11-06
- **Collection** : Boutiques Paris (`5fdfeed248b6099cf9c2dda8`)
- **Total items non archivés** : 44
- **Items mis à jour** : 9
- **Items déjà corrects** : 20 (slug FR = EN)
- **Items non trouvés dans CSV** : 15

### Mise à jour des slugs EN - Boutiques Frances

- **Date** : 2025-11-06
- **Collection** : Boutiques Frances (`60c9c68af21f285a7d4adb9b`)
- **Total items non archivés** : 5
- **Items mis à jour** : 1
- **Items déjà corrects** : 4 (slug FR = EN)
- **Items non trouvés dans CSV** : 0

### Mise à jour des slugs EN - Références

- **Date** : 2025-11-06
- **Collection** : Références (`5fdfeed248b60975cdc2de1a`)
- **Total items non archivés** : 87
- **Items mis à jour** : 25
- **Items déjà corrects** : 57 (slug FR = EN)
- **Items non trouvés dans CSV** : 5

### Mise à jour des slugs EN - Tags

- **Date** : 2025-11-06
- **Collection** : Tags (`5fdfeed248b6091ea8c2de1d`)
- **Total items non archivés** : 6
- **Items mis à jour** : 5
- **Items déjà corrects** : 1 (slug FR = EN)
- **Items non trouvés dans CSV** : 0

### Mise à jour des slugs EN - Rubriques

- **Date** : 2025-11-06
- **Collection** : Rubriques (`5fdfeed248b609fd1ec2de19`)
- **Total items non archivés (non drafts)** : 3
- **Items mis à jour** : 3
- **Items déjà corrects** : 0
- **Items non trouvés dans CSV** : 0

### 3. Mise à jour des slugs EN pour les pages statiques (via MCP)

- ✅ **Pages identifiées** : 24 pages statiques (hors collections CMS)
- ✅ **Locale EN** : `690b2acd93972e10247b6eaa` (localeId pour pages statiques)
- ✅ **Pages mises à jour** : 22 pages sur 24
- ✅ **Pages ignorées** : 2 pages (search = utility page, contact = déjà correct)
- ✅ **Source de vérité** : `slugs-mapping-fr-en.csv` (fichier de référence)
- ✅ **Méthode** : MCP Webflow `pages_update_page_settings` avec `localeId`
- ✅ **Résultat** : `static-pages-update-summary.json` (résumé détaillé)

#### Pages statiques mises à jour

**Pages root** (13 pages) :

- `guide` → `guidelines-pop-up-shops`
- `boutiques` → `popup-shops`
- `qui-sommes-nous` → `who-are-we`
- `references` → `pop-up-stores-references`
- `metier` → `retail-expert`
- `contact-demande-envoyee` → `contact-request-send`
- `estimation-performance-pop-up-store` → `pop-up-store-performance-estimation`
- Et autres...

**Pages quartiers** (6 pages) :

- `quartiers/marais` → `neighborhoods-marais` (Webflow convertit `/` en `-`)
- `quartiers/saint-germain` → `neighborhoods-saint-germain`
- `quartiers/montmartre` → `neighborhoods-montmartre`
- Et autres...

**Pages villes** (5 pages) :

- `villes/lille` → `french-cities-lille` (Webflow convertit `/` en `-`)
- `villes/lyon` → `french-cities-lyon`
- Et autres...

#### Note importante

⚠️ **Webflow convertit les slashes en tirets** : Les slugs avec `/` (ex: `neighborhoods/marais`) sont automatiquement convertis en tirets (`neighborhoods-marais`) par Webflow. Les pages enfants héritent du chemin du parent (ex: `/en/quartiers/neighborhoods-marais`).

### Fichiers générés

- `articles-non-archives-export.csv` : Export complet des articles
- `update-slugs-en-summary.json` : Résumé détaillé Articles
- `guide-update-slugs-en-summary.json` : Résumé détaillé Guide pop-up stores
- `boutiques-update-slugs-en-summary.json` : Résumé détaillé Boutiques Paris
- `boutiques-france-update-slugs-en-summary.json` : Résumé détaillé Boutiques Frances
- `references-update-slugs-en-summary.json` : Résumé détaillé Références
- `tags-update-slugs-en-summary.json` : Résumé détaillé Tags
- `rubriques-update-slugs-en-summary.json` : Résumé détaillé Rubriques
- `static-pages-update-summary.json` : Résumé détaillé Pages statiques

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
**Migration slugs EN** : ✅ 7 collections CMS + 22 pages statiques terminées

**Collections CMS** :

- Articles : 56 items mis à jour
- Guide pop-up stores : 33 items mis à jour
- Boutiques Paris : 9 items mis à jour
- Boutiques Frances : 1 item mis à jour
- Références : 25 items mis à jour
- Tags : 5 items mis à jour
- Rubriques : 3 items mis à jour

**Pages statiques** :

- 22 pages mises à jour (root, quartiers, villes)
- 2 pages ignorées (search = utility, contact = déjà correct)
