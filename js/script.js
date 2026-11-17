// Fichier du binôme JavaScript.
// La liste des id et des classes à utiliser est dans GUIDE.md, partie « Pour le binôme JavaScript ».
"use strict";

/* ==========================================================
   TravelSim - Logique du simulateur de budget de voyage
   ========================================================== */

/* ===== 1. Réglages ===== */
const CLE_STOCKAGE = "travelsim-historique";
const TAUX_REMISE = 0.10; // remise étudiante de 10 %

// Répartition du budget par catégorie (en %), selon le type de voyage
const CATEGORIES = [
    { nom: "Hébergement", icone: "fa-bed",      parts: { "aller-retour": 40, "aller-simple": 50 } },
    { nom: "Transport",   icone: "fa-car",      parts: { "aller-retour": 20, "aller-simple": 10 } },
    { nom: "Nourriture",  icone: "fa-utensils", parts: { "aller-retour": 20, "aller-simple": 20 } },
    { nom: "Activités",   icone: "fa-ticket",   parts: { "aller-retour": 15, "aller-simple": 15 } },
    { nom: "Divers",      icone: "fa-ellipsis", parts: { "aller-retour": 5,  "aller-simple": 5 } }
];

const LIBELLES_TYPE = {
    "aller-retour": "Aller-retour",
    "aller-simple": "Aller simple"
};

/* ===== 2. Éléments de la page ===== */
const formulaire = document.getElementById("form-voyage");
const champDestination = document.getElementById("destination");
const champDate = document.getElementById("date-depart");
const champJours = document.getElementById("jours");
const champType = document.getElementById("type-voyage");
const champBudget = document.getElementById("budget");
const champDevise = document.getElementById("devise");
const champEtudiant = document.getElementById("etudiant");
const messageErreur = document.getElementById("message-erreur");

const sectionResultats = document.getElementById("resultats");
const corpsHistorique = document.getElementById("corps-historique");
const messageVide = document.getElementById("historique-vide");

/* ===== 3. Fonctions utilitaires ===== */

// Formate un montant avec la devise choisie (ex : 1 000 €)
function formaterMontant(montant, devise) {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: devise,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(montant);
}

// Transforme "2026-04-15" en "15/04/2026" (sans passer par Date, pour éviter les décalages de fuseau)
function formaterDate(dateIso) {
    const [annee, mois, jour] = dateIso.split("-");
    return `${jour}/${mois}/${annee}`;
}

// Arrondit à 2 décimales
function arrondir(nombre) {
    return Math.round(nombre * 100) / 100;
}

/* ===== 4. Validation du formulaire ===== */

// Marque un champ comme valide ou invalide (bordure rouge sur le bloc .saisie)
function marquerChamp(champ, estValide) {
    champ.closest(".saisie").classList.toggle("invalide", !estValide);
    return estValide;
}

function validerFormulaire() {
    const jours = Number(champJours.value);
    const budget = Number(champBudget.value);

    const resultats = [
        marquerChamp(champDestination, champDestination.value.trim() !== ""),
        marquerChamp(champDate, champDate.value !== ""),
        marquerChamp(champJours, Number.isInteger(jours) && jours >= 1),
        marquerChamp(champBudget, champBudget.value !== "" && budget > 0)
    ];

    const toutEstValide = resultats.every(Boolean);
    messageErreur.classList.toggle("visible", !toutEstValide);
    return toutEstValide;
}

/* ===== 5. Calcul de la simulation ===== */
function calculerSimulation() {
    const budget = Number(champBudget.value);
    const jours = Number(champJours.value);
    const type = champType.value;
    const devise = champDevise.value;
    const etudiant = champEtudiant.checked;

    const remise = etudiant ? arrondir(budget * TAUX_REMISE) : 0;
    const total = arrondir(budget - remise);
    const parJour = arrondir(total / jours);

    const repartition = CATEGORIES.map(function (categorie) {
        const part = categorie.parts[type];
        return {
            nom: categorie.nom,
            icone: categorie.icone,
            part: part,
            montant: arrondir(total * part / 100)
        };
    });

    return {
        id: Date.now(),
        destination: champDestination.value.trim(),
        date: champDate.value,
        jours: jours,
        type: type,
        devise: devise,
        etudiant: etudiant,
        budget: budget,
        remise: remise,
        total: total,
        parJour: parJour,
        repartition: repartition
    };
}

/* ===== 6. Affichage des résultats ===== */
function afficherResultats(sim) {
    const f = function (montant) { return formaterMontant(montant, sim.devise); };

    document.getElementById("res-destination").textContent = sim.destination;
    document.getElementById("res-details").textContent =
        `${sim.jours} jour${sim.jours > 1 ? "s" : ""} · ${LIBELLES_TYPE[sim.type]} · Départ le ${formaterDate(sim.date)}`;
    document.getElementById("res-total").textContent = f(sim.total);
    document.getElementById("res-quotidien").textContent = f(sim.parJour);
    document.getElementById("res-remise").textContent = sim.remise > 0 ? "- " + f(sim.remise) : f(0);
    document.getElementById("res-budget").textContent = f(sim.budget);

    // Recrée la liste de répartition avec une boucle
    const liste = document.getElementById("repartition");
    liste.innerHTML = "";

    sim.repartition.forEach(function (ligne) {
        const li = document.createElement("li");
        li.className = "categorie";

        const nom = document.createElement("span");
        nom.className = "nom";
        const icone = document.createElement("i");
        icone.className = "fa-solid " + ligne.icone;
        nom.append(icone, " " + ligne.nom);

        const barre = document.createElement("span");
        barre.className = "barre";
        const remplissage = document.createElement("span");
        remplissage.className = "remplissage";
        remplissage.style.width = ligne.part + "%";
        barre.appendChild(remplissage);

        const montant = document.createElement("span");
        montant.className = "montant";
        montant.textContent = f(ligne.montant);

        li.append(nom, barre, montant);
        liste.appendChild(li);
    });

    sectionResultats.hidden = false;
}

/* ===== 7. Historique (sauvegardé dans le navigateur) ===== */
function lireHistorique() {
    try {
        const donnees = JSON.parse(localStorage.getItem(CLE_STOCKAGE));
        return Array.isArray(donnees) ? donnees : [];
    } catch (erreur) {
        return [];
    }
}

function sauvegarderHistorique(historique) {
    try {
        localStorage.setItem(CLE_STOCKAGE, JSON.stringify(historique));
    } catch (erreur) {
        // Stockage indisponible : l'historique ne sera pas conservé après rechargement
    }
}

function afficherHistorique() {
    const historique = lireHistorique();
    corpsHistorique.innerHTML = "";

    historique.forEach(function (sim) {
        const tr = document.createElement("tr");

        const valeurs = [
            sim.destination,
            formaterDate(sim.date),
            sim.jours,
            LIBELLES_TYPE[sim.type],
            formaterMontant(sim.budget, sim.devise),
            formaterMontant(sim.total, sim.devise)
        ];

        valeurs.forEach(function (valeur) {
            const td = document.createElement("td");
            td.textContent = valeur; // textContent : sécurisé même si l'utilisateur tape du HTML
            tr.appendChild(td);
        });

        const tdAction = document.createElement("td");
        const bouton = document.createElement("button");
        bouton.type = "button";
        bouton.className = "bouton-supprimer";
        bouton.dataset.id = sim.id;
        bouton.innerHTML = '<i class="fa-solid fa-trash"></i> Supprimer';
        tdAction.appendChild(bouton);
        tr.appendChild(tdAction);

        corpsHistorique.appendChild(tr);
    });

    messageVide.classList.toggle("visible", historique.length === 0);
}

function supprimerSimulation(id) {
    const historique = lireHistorique().filter(function (sim) {
        return String(sim.id) !== String(id);
    });
    sauvegarderHistorique(historique);
    afficherHistorique();
}

/* ===== 8. Défilement doux (en tenant compte de l'en-tête fixe) ===== */
function defilerVers(element) {
    const hauteurEntete = document.querySelector(".entete").offsetHeight;
    const position = element.getBoundingClientRect().top + window.scrollY - hauteurEntete - 16;
    window.scrollTo({ top: position, behavior: "smooth" });
}

/* ===== 9. Menu : lien actif selon la section visible ===== */
function surveillerMenu() {
    const liens = document.querySelectorAll(".menu a");
    const sections = ["accueil", "simulateur", "historique", "a-propos"]
        .map(function (id) { return document.getElementById(id); });

    function mettreAJour() {
        const repere = window.scrollY + window.innerHeight / 3;
        let courante = sections[0];

        sections.forEach(function (section) {
            if (section.offsetTop <= repere) {
                courante = section;
            }
        });

        // En bas de page, on active la dernière section
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
            courante = sections[sections.length - 1];
        }

        liens.forEach(function (lien) {
            lien.classList.toggle("actif", lien.getAttribute("href") === "#" + courante.id);
        });
    }

    window.addEventListener("scroll", mettreAJour, { passive: true });
    mettreAJour();
}

/* ===== 10. Événements ===== */

// Soumission du formulaire
formulaire.addEventListener("submit", function (evenement) {
    evenement.preventDefault();

    if (!validerFormulaire()) {
        return;
    }

    const simulation = calculerSimulation();

    // Ajout en tête de l'historique (la plus récente en premier)
    const historique = lireHistorique();
    historique.unshift(simulation);
    sauvegarderHistorique(historique);

    afficherResultats(simulation);
    afficherHistorique();
    defilerVers(sectionResultats);
});

// Efface l'erreur d'un champ dès que l'utilisateur le modifie
[champDestination, champDate, champJours, champBudget].forEach(function (champ) {
    champ.addEventListener("input", function () {
        champ.closest(".saisie").classList.remove("invalide");
        if (!document.querySelector(".saisie.invalide")) {
            messageErreur.classList.remove("visible");
        }
    });
});

// Suppression d'une ligne de l'historique (délégation d'événement)
corpsHistorique.addEventListener("click", function (evenement) {
    const bouton = evenement.target.closest(".bouton-supprimer");
    if (bouton) {
        supprimerSimulation(bouton.dataset.id);
    }
});

// Clic sur les liens du menu : défilement doux avec décalage
document.querySelectorAll('a[href^="#"]').forEach(function (lien) {
    lien.addEventListener("click", function (evenement) {
        const cible = document.querySelector(lien.getAttribute("href"));
        if (cible) {
            evenement.preventDefault();
            if (cible.id === "accueil") {
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                defilerVers(cible);
            }
        }
    });
});

/* ===== 11. Initialisation au chargement ===== */
(function initialiser() {
    const historique = lireHistorique();

    // Affiche la dernière simulation si elle existe, sinon cache la section résultats
    if (historique.length > 0) {
        afficherResultats(historique[0]);
    } else {
        sectionResultats.hidden = true;
    }

    afficherHistorique(); // remplace aussi la ligne d'exemple du HTML
    surveillerMenu();
})();