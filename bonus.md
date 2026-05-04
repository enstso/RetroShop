BONUS RetroShop — Pour les equipes rapides

Vous avez fini avant le chrono ? Voici des defis supplementaires.
Chaque bonus rapporte des points. Faites-les dans l'ordre.

---

## +1 — Facile (5-10 min chacun)

### +1a : Event Bus Logger

Ajoutez un wrapper autour de l'Event Bus qui logge chaque emission et chaque
reception en console avec l'heure exacte.

Quand l'utilisateur clique "Ajouter au panier", la console du Shell doit afficher :

[14:23:05] EVENT BUS ↑ cart:add { id: 1, name: "Manette SNES", price: 29, image: "snes" }
[14:23:05] EVENT BUS ↓ cart:add (traite par mfe-cart)

Pour valider : envoyez-moi sur Teams :
1. Une capture d'ecran de votre console avec les logs
2. Expliquez en 2 phrases POURQUOI ce logger est utile en dev MFE

→ +1 point

### +1b : Ajouter 3 produits au catalogue

Modifiez shared/products.js pour ajouter 3 vrais produits retro gaming
(avec nom, prix, categorie coherente). Les produits doivent apparaitre
dans la grille et etre ajoutables au panier.

Pour valider : envoyez-moi sur Teams :
1. Le code de vos 3 produits (les 3 objets JSON)
2. Expliquez en 2 phrases COMMENT le MFE ProductGrid lit ces donnees
   sans savoir combien de produits il y a

→ +1 point

---

## +1,5 — Intermediaire (10-20 min chacun)

### +1,5a : Nouvel evenement cart:clear

Ajoutez un evenement cart:clear qui vide le panier depuis n'importe quel MFE.

- mfe-cart : ajouter un bouton "Vider le panier" qui emet cart:clear
- Shell : ecouter cart:clear et reinitialiser le badge
- mfe-reco : ecouter cart:clear et revenir aux recos par defaut

Payload : { timestamp: number }

Pour valider : envoyez-moi sur Teams :
1. Le contrat de votre evenement (nom + payload + qui emet + qui ecoute)
2. Expliquez en 2 phrases POURQUOI le cleanup est obligatoire
   dans le useEffect qui ecoute cart:clear

→ +1,5 points

### +1,5b : Test de contrat manuel

Creez un fichier contract.test.js que vous pouvez lancer avec :
node contract.test.js

Ce test doit verifier que le payload de cart:add contient bien les champs
{ id, name, price, image } avec les bons types (number, string, number, string).

Simulez manuellement un emit avec un payload valide, puis un payload invalide.
Le test reussit quand le payload valide passe et que l'invalide est detecte.

Pour valider : envoyez-moi sur Teams :
1. Votre code contract.test.js
2. Expliquez en 2 phrases ce qui se passerait en production si un MFE
   changeait son payload sans prevenir les autres

→ +1,5 points

---

## +2 — Presenter au tableau (equipe)

A la fin du projet, une equipe volontaire presente sa solution
au tableau (ou en partage d'ecran en visio).

Vous devez montrer :
- Votre architecture (Shell + MFEs qui tournent)
- La cascade d'evenements (qui emet quoi, qui ecoute quoi)
- Un bug que vous avez rencontre et comment vous l'avez resolu
- Ce que vous avez appris que vous ne saviez pas avant

5 minutes. Questions de la classe ensuite.

→ +2 points pour toute l'equipe

---

## +3 — Avance (20-30 min)

### +3 : Contract Validator (intercepteur d'Event Bus)

Creez un contractValidator.js partage qui intercepte TOUS les evenements
et verifie que le payload respecte le contrat AVANT de le laisser passer.

Contrats :

cart:add     → { id: "number", name: "string", price: "number", image: "string" }
cart:updated → { items: "object", count: "number", total: "number" }

Le validator wrappe eventBus.emit :

Si le payload est valide → l'event passe normalement
Si le payload est invalide → l'event est BLOQUE
Un message d'erreur explicite s'affiche en console :
[CONTRACT VIOLATION] cart:add — champ 'price' manquant ou mauvais type

Pour valider : envoyez-moi sur Teams :
1. Votre code contractValidator.js
2. La reponse a ces 3 questions (une phrase par question) :
   a) En production, qui devrait maintenir ce validateur ?
   b) Qu'est-ce qui se passe si le validateur est trop strict ?
   c) En quoi ce validateur est la version manuelle de Pact.io ?

→ +3 points

---

IMPORTANT — Pour CHAQUE bonus, vous DEVEZ m'envoyer un message Teams avec :
- Ce que vous avez fait (le code ou la capture)
- Comment vous l'avez fait (la methode)
- Ce que vous avez appris (le concept)

Sans ce message, le bonus n'est pas valide. C'est la preuve de votre
comprehension, pas juste du code qui marche.
