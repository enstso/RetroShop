# Contrat d'événements MFE — RetroShop

Ce document fige le contrat de communication entre les Micro-Frontends.
Toute divergence (nom, payload, type) entraîne un échec silencieux : les
listeners ne sont jamais appelés et rien ne se passe à l'écran.

Bus utilisé : `shared/eventBus.js` (singleton exposé sur `window.__EVENT_BUS__`).

---

## Événements

### `cart:add`

Demande l'ajout d'un produit au panier.

| Champ      | Émetteur(s)              | Écouteur(s) |
| ---------- | ------------------------ | ----------- |
| Évènement  | `mfe-product`, `mfe-reco` | `mfe-cart`  |

**Payload** : l'objet produit tel que défini dans `shared/products.js`.

```ts
{
  id: number,
  name: string,
  price: number,
  image: string,
  category: 'manettes' | 'jeux' | 'consoles' | 'accessoires'
}
```

Note : c'est `mfe-cart` qui génère un `cartId` unique à la réception. Ainsi le
même produit peut être ajouté plusieurs fois sans collision.

---

### `cart:clear`

Demande la remise à zéro du panier. Peut être émis depuis n'importe quel MFE.

| Champ      | Émetteur(s) | Écouteur(s)                          |
| ---------- | ----------- | ------------------------------------ |
| Évènement  | `mfe-cart`  | `mfe-cart`, `mfe-reco`, `shell`      |

**Payload** :

```ts
{
  timestamp: number   // Date.now() au moment de l'émission
}
```

`mfe-cart` réagit en vidant son state (ce qui déclenche au passage un `cart:updated`
avec `items: []`). `mfe-reco` revient à ses 3 recos par défaut. `shell` remet le badge à 0.

---

### `cart:updated`

Diffuse l'état complet du panier après chaque changement (ajout, suppression, vidage).

| Champ      | Émetteur(s) | Écouteur(s)            |
| ---------- | ----------- | ---------------------- |
| Évènement  | `mfe-cart`  | `shell`, `mfe-reco`    |

**Payload** : snapshot complet (pas de delta).

```ts
{
  items: Array<{
    cartId: string,   // unique par ligne du panier
    id: number,       // id produit (peut se répéter)
    name: string,
    price: number,
    image: string,
    category: string
  }>,
  count: number,      // = items.length
  total: number       // = somme des prix
}
```

Vider le panier émet un `cart:updated` avec `items: []`, `count: 0`, `total: 0`.
Aucun événement `cart:clear` séparé n'est utilisé.

---

## Qui émet quoi, qui écoute quoi

| MFE         | Émet                                | Écoute                                  |
| ----------- | ----------------------------------- | --------------------------------------- |
| mfe-product | `cart:add`                          | —                                       |
| mfe-cart    | `cart:updated`, `cart:clear`        | `cart:add`, `cart:clear`                |
| mfe-reco    | `cart:add`                          | `cart:updated`, `cart:clear`            |
| shell       | —                                   | `cart:updated` (badge), `cart:clear`    |

---

## Règles d'implémentation

1. Tout `on(...)` dans un `useEffect` doit retourner un cleanup qui appelle `off(...)`.
2. Les noms d'événements sont des chaînes littérales — pas de constantes partagées
   entre MFEs (chaque équipe code chez soi). Le contrat est ici la source de vérité.
3. Les payloads sont des objets simples sérialisables (pas de fonctions, pas de classes).
