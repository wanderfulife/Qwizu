# Survey Data Processor

Application web pour l'analyse des données de questionnaires de satisfaction.

## Fonctionnalités

- Chargement de la structure du questionnaire (fichier JavaScript)
- Chargement des réponses au questionnaire (fichier Excel)
- Analyse et traitement des données
- Visualisation des résultats sous forme de tableaux et de graphiques
- Export des résultats

## Technologies utilisées

- [Next.js](https://nextjs.org/) - Framework React
- [TypeScript](https://www.typescriptlang.org/) - Typage statique
- [Material-UI](https://mui.com/) - Composants d'interface
- [Chart.js](https://www.chartjs.org/) - Visualisation de données
- [SheetJS](https://sheetjs.com/) - Lecture de fichiers Excel

## Installation

1. Cloner le repository
2. Installer les dépendances :
   ```bash
   npm install
   ```

## Développement

Pour lancer l'application en mode développement :

```bash
npm run dev
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

## Structure du projet

```
src/
├── app/              # Pages de l'application (Next.js App Router)
│   ├── layout.tsx    # Layout principal avec Header et Footer
│   ├── page.tsx      # Page d'accueil
│   ├── processing/   # Page de traitement
│   └── results/      # Page de résultats
├── components/       # Composants React
│   ├── FileUpload/   # Composants de chargement de fichiers
│   ├── Layout/       # Composants de mise en page
│   └── Visualization/ # Composants de visualisation
├── lib/              # Logique métier
├── utils/            # Fonctions utilitaires
└── theme.ts          # Configuration du thème Material-UI
```

## Architecture et flux de données

L'application suit une architecture modulaire avec une séparation claire des responsabilités :

1. **Page d'accueil** (`/`) - Chargement des fichiers
   - Le composant `FileUploadContainer` gère le chargement de deux fichiers :
     - Structure du questionnaire (fichier JavaScript)
     - Réponses au questionnaire (fichier Excel)
   - Les fichiers sont validés et stockés temporairement

2. **Page de traitement** (`/processing`) - Analyse des données
   - La bibliothèque `SurveyProcessor` orchestre le processus :
     - Parse la structure du questionnaire avec `SurveyParser`
     - Lit les réponses Excel avec `ExcelParser`
     - Mappe les réponses aux questions avec `DataMapper`
     - Calcule les statistiques avec `StatisticsProcessor`

3. **Page de résultats** (`/results`) - Visualisation
   - Affichage des données sous plusieurs formes :
     - Résumé des statistiques principales
     - Analyse détaillée par question
     - Visualisations (graphiques en barres, camemberts)
     - Données brutes filtrables

## Documentation complète

Pour une documentation détaillée du projet, veuillez consulter le fichier [PROJECT-DOCUMENTATION.md](PROJECT-DOCUMENTATION.md) qui contient :
- Spécifications techniques complètes
- Structure des fichiers
- Logique de traitement des données
- Architecture de l'application
- Considérations de performance et de sécurité

## Utilisation

1. Accédez à la page d'accueil
2. Téléchargez le fichier de structure du questionnaire (format JavaScript)
3. Téléchargez le fichier de réponses (format Excel)
4. Cliquez sur "Traiter les fichiers"
5. Consultez les résultats dans l'onglet "Résultats"

## Contribution

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalité`)
3. Commitez vos modifications (`git commit -am 'Ajout d'une fonctionnalité'`)
4. Poussez la branche (`git push origin feature/ma-fonctionnalité`)
5. Ouvrez une Pull Request

## Points forts

- Interface utilisateur intuitive et responsive
- Traitement sécurisé des fichiers côté client (aucun envoi au serveur)
- Visualisations variées des données (graphiques, tableaux, nuages de mots)
- Gestion des différents types de questions du questionnaire
- Support des flux conditionnels du questionnaire

## Améliorations possibles

- Export des résultats au format PDF ou Excel
- Fonctionnalités avancées de filtrage et de tri
- Analyses statistiques plus approfondies
- Support de questionnaires multilingues
- Mode de comparaison entre différents jeux de données

## Licence

Ce projet est sous licence MIT.