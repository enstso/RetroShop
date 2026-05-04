# Validation — RetroShop

Validation de la checklist de l'énoncé après assemblage des 4 services.

Date : 2026-05-04

| # | Critère                                                                    | Résultat |
| - | -------------------------------------------------------------------------- | -------- |
| 1 | Les 4 services démarrent sans erreur                                       | OK       |
| 2 | Cliquer "Ajouter" dans le catalogue ajoute l'article au panier             | OK       |
| 3 | Le badge du header affiche le bon nombre                                   | OK       |
| 4 | Les recommandations changent selon le contenu du panier                    | OK       |
| 5 | Vider le panier remet tout à zéro (badge, panier, recos)                   | OK       |
| 6 | Tuer mfe-reco (Ctrl+C) ne casse pas le reste de la page                    | OK       |

## Lancement

```bash
# T1
cd mfe-product && npm install && npm start
# T2
cd mfe-cart && npm install && npm start
# T3
cd mfe-reco && npm install && npm start
# T4
cd shell && npm install && npm start
```

Ouvrir http://localhost:3000.

## Ports

| Service     | Port |
| ----------- | ---- |
| shell       | 3000 |
| mfe-product | 3001 |
| mfe-cart    | 3002 |
| mfe-reco    | 3003 |
