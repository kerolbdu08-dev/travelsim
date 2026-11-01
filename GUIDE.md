# TravelSim : guide du HTML et du CSS

## 1. Les fichiers

```
planificateurbudget/
├── index.html      la structure de la page (HTML)
├── css/style.css   la mise en forme (CSS)
├── js/script.js    les calculs (JavaScript, partie du binôme)
├── assets/         logo.svg, favicon.svg (icône de l'onglet), avion.svg (dessin de la bannière)
└── GUIDE.md        ce guide
```

`index.html` relie les deux autres fichiers dans le `<head>` :
- `<link rel="stylesheet" href="css/style.css">` charge le CSS ;
- `<script src="js/script.js" defer></script>` charge le JavaScript. `defer` attend que toute la page soit lue avant de lancer le script : sans lui, le script chercherait des éléments qui n'existent pas encore.

La police Poppins et les icônes Font Awesome viennent d'Internet. **Sans connexion, la page marche, mais sans icônes et avec la police Arial.**

## 2. Les balises HTML, de haut en bas

| Balise | Rôle |
|---|---|
| `<!DOCTYPE html>` | Dit au navigateur que c'est du HTML5. |
| `<html lang="fr">` | Racine de la page, en français (utile aux lecteurs d'écran). |
| `<head>` | Informations invisibles : encodage, titre de l'onglet, liens vers le CSS et le JS. |
| `<meta charset="UTF-8">` | Affiche correctement les accents. |
| `<meta name="viewport">` | Adapte la page à la largeur du téléphone. |
| `<body>` | Tout ce qui est visible. |
| `<header>` | L'en-tête : logo et menu. |
| `<nav>` + `<ul>` + `<li>` + `<a>` | Le menu : une liste de liens. `href="#simulateur"` saute à l'élément qui a `id="simulateur"`. |
| `<main>` | Le contenu principal (une seule fois par page). |
| `<section>` | Une partie de la page : accueil, simulateur, résultats, historique, à propos. |
| `<h1>`, `<h2>`, `<h3>` | Les titres, du plus important au moins important. Un seul `<h1>` par page. |
| `<p>` | Un paragraphe. |
| `<span>` | Un morceau de texte à styler sans changer la ligne (ex. « Sim » en bleu dans le titre). |
| `<div>` | Une boîte sans signification, pour grouper et mettre en page. |
| `<img src alt>` | Une image. `alt` décrit l'image si elle ne s'affiche pas ; vide (`alt=""`) si elle est décorative. |
| `<i class="fa-...">` | Une icône Font Awesome. |
| `<form>` | Le formulaire. `novalidate` coupe les messages automatiques du navigateur : c'est notre JavaScript qui vérifie. |
| `<label for="x">` | Le nom d'un champ. `for` le relie au champ `id="x"` : cliquer sur le texte active le champ. |
| `<input type="text / date / number / checkbox">` | Les champs de saisie. `number` n'accepte que des chiffres, `min` fixe la plus petite valeur. |
| `<select>` + `<option>` | Une liste déroulante. `value` est ce que lit le JavaScript. |
| `<button type="submit">` | Envoie le formulaire, ce qui déclenche l'événement `submit` en JavaScript. |
| `<ul>` + `<li>` | Une liste : ici, la répartition des dépenses. |
| `<table>` | Le tableau de l'historique : `<thead>` (en-tête), `<tbody>` (lignes), `<tr>` (une ligne), `<th>` (case de titre), `<td>` (case de données). |
| `<footer>` | Le pied de page. |

**Classe ou id ?** Une `class` peut être portée par plusieurs éléments (toutes les `.carte`). Un `id` est unique dans la page : il sert aux liens du menu et au JavaScript.

## 3. Les notions CSS utilisées

| Notion | Où | Pourquoi |
|---|---|---|
| Variables `:root { --bleu: ... }` | début du fichier | Une couleur définie une fois, réutilisée partout avec `var(--bleu)`. |
| Sélecteurs | `body`, `.carte`, `#simulateur`, `.menu a`, `.saisie input` | Élément, classe, id, et descendant (« les `a` dans `.menu` »). |
| Modèle de boîte | `margin`, `padding`, `border`, `width` | Espace extérieur, espace intérieur, bordure, largeur. `box-sizing: border-box` fait entrer padding et bordure dans la largeur. |
| `display: flex` | en-tête, champs, résultats | Aligne les éléments en ligne ; `justify-content` les répartit, `align-items` les centre en hauteur, `gap` les espace. |
| `flex-wrap` + `flex: 1 1 220px` | champs du formulaire | Chaque champ fait au moins 220 px ; s'il n'y a plus la place, il passe à la ligne. |
| `position: sticky` | en-tête | Le menu reste en haut pendant le défilement. |
| `position: relative` + marge négative | `#simulateur` | La carte du formulaire remonte sur la bannière. |
| `display: none` / `block` | `.erreur`, `.vide` | Caché par défaut, affiché quand le JavaScript ajoute la classe `visible`. |
| Pseudo-classes | `:hover`, `:focus-within` | Survol de la souris ; champ en cours de saisie (bordure bleue). |
| `linear-gradient` | bannière, image du résultat | Un dégradé de couleurs, sans image à charger. |
| `overflow-x: auto` | tableau | Sur téléphone, le tableau défile au lieu de déborder. |
| `@media (max-width: 760px)` | fin du fichier | Sous 760 px de large (téléphone), les blocs s'empilent. |

## 4. Pour le binôme JavaScript

### Les champs à lire
| id | Type | Valeur |
|---|---|---|
| `form-voyage` | formulaire | écouter `addEventListener('submit', ...)`, puis `event.preventDefault()` |
| `destination` | texte | `.value` |
| `date-depart` | date | `.value` au format `aaaa-mm-jj` |
| `jours` | nombre | `Number(...value)` |
| `type-voyage` | liste | `aller-retour` ou `aller-simple` |
| `budget` | nombre | `parseFloat(...value)` |
| `devise` | liste | `EUR`, `USD` ou `MAD` |
| `etudiant` | case | `.checked` (vrai ou faux) |

### Les zones à remplir
| id | Contenu |
|---|---|
| `res-destination` | nom de la destination |
| `res-details` | jours, type, date de départ |
| `res-total` | total à prévoir |
| `res-quotidien` | budget par jour |
| `res-remise` | remise étudiant |
| `res-budget` | budget de départ |
| `repartition` | la liste `<ul>` : une `<li class="categorie">` par catégorie (voir le modèle dans le HTML) ; la largeur de la barre se règle avec `style.width = "40%"` sur `.remplissage` |
| `corps-historique` | le `<tbody>` : une `<tr>` par simulation ; **supprimer la ligne d'exemple** |

### Les classes à ajouter ou retirer (`classList`)
| Classe | Sur | Effet |
|---|---|---|
| `visible` | `#message-erreur` | affiche le message d'erreur |
| `invalide` | le `.saisie` d'un champ faux | bordure rouge |
| `visible` | `#historique-vide` | affiche « Aucune simulation » quand le tableau est vide |
| `bouton-supprimer` | bouton dans chaque ligne | style rouge du bouton Supprimer |

Les valeurs affichées dans la page (Paris, 900 €, etc.) sont des **exemples** pour voir le design : le script les remplace.

## 5. Questions probables à l'oral

- **Pourquoi `<section>` et pas seulement `<div>` ?** `<section>` dit ce qu'est le contenu (une partie de la page) ; `<div>` ne dit rien, il sert seulement à la mise en page.
- **À quoi sert `for` dans `<label>` ?** À relier le texte au champ : on clique sur le texte, le champ s'active.
- **Pourquoi des variables CSS ?** Pour changer une couleur partout en une seule ligne.
- **Comment la page s'adapte au téléphone ?** La balise `viewport`, `flex-wrap` sur les champs, et la règle `@media` qui empile les blocs sous 760 px.
- **Comment le CSS et le JavaScript travaillent ensemble ?** Le CSS prépare les états (`.erreur` caché, `.erreur.visible` affiché), le JavaScript ajoute ou retire la classe.
