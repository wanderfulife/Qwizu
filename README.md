# Survey Data Processor

Application web pour l'analyse des données de questionnaires de satisfaction.

## Fonctionnalités

### File Processing
- Upload and parse survey structure files (JavaScript format)
- Upload and parse Excel response files (.xlsx format)
- Validate file formats and content
- Handle parsing errors gracefully

### Data Analysis
- Map responses to questions using question IDs
- Process conditional question flows
- Aggregate response data by question
- Calculate response percentages and statistics
- Identify response patterns and trends

### Data Visualization
- Interactive charts for response distributions (bar charts, pie charts)
- Detailed tables for individual responses with sorting and filtering
- Summary dashboard with key statistics
- Cross-tabulation views for analyzing relationships between questions
- Responsive design for all device sizes

### User Experience
- Intuitive file upload interface
- Progress indicators during processing
- Clear error messages and validation
- Export options for processed data
- Responsive design for desktop and mobile devices
- Full accessibility compliance (WCAG 2.1 AA)

## Technologies utilisées

- [Next.js](https://nextjs.org/) - Framework React (v15+)
- [React](https://reactjs.org/) - UI library (v19+)
- [TypeScript](https://www.typescriptlang.org/) - Typage statique
- [Material-UI](https://mui.com/) - Composants d'interface (v7+)
- [Chart.js](https://www.chartjs.org/) - Visualisation de données
- [SheetJS](https://sheetjs.com/) - Lecture de fichiers Excel
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS

## Gestion des erreurs

L'application inclut un système de gestion d'erreurs avancé qui :
- Affiche des notifications claires et détaillées en cas d'erreur
- Fournit des messages d'erreur spécifiques pour différents types de problèmes
- Offre des actions possibles pour résoudre les erreurs
- Maintient une expérience utilisateur fluide même en cas d'erreur

Pour plus d'informations sur la gestion des erreurs, consultez le [Guide de gestion des erreurs](src/docs/ERROR_HANDLING_GUIDE.md).

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

L'application sera accessible à l'adresse [http://localhost:3002](http://localhost:3002).

## Tests

Pour exécuter les tests :

```bash
npm test
```

Tous les tests passent avec succès après les dernières corrections.

## Build

Pour construire l'application pour la production :

```bash
npm run build
```

Le build se termine maintenant avec succès après les corrections apportées.

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
├── contexts/         # Contextes React pour la gestion d'état
├── lib/              # Logique métier
├── utils/            # Fonctions utilitaires
├── hooks/            # Hooks React personnalisés
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

Pour une documentation détaillée du projet, veuillez consulter le fichier [MASTER_DOCUMENTATION.md](MASTER_DOCUMENTATION.md) qui contient :
- Spécifications techniques complètes
- Structure des fichiers
- Logique de traitement des données
- Architecture de l'application
- Considérations de performance et de sécurité
- Instructions d'utilisation
- Améliorations futures possibles

Cette documentation est automatiquement mise à jour à chaque commit grâce à notre système de documentation automatisé. Pour plus d'informations sur ce système, consultez [scripts/README.md](scripts/README.md).

## Améliorations récentes

### Corrections de build et de tests
- Correction de toutes les erreurs ESLint dans les fichiers de test
- Remplacement des imports CommonJS par des imports ES6
- Correction des problèmes de typage TypeScript dans les tests
- Résolution des problèmes de parsing JSX dans les tests de composants
- Mise à jour des attentes de test pour correspondre au comportement réel de l'implémentation

### Accessibilité
- Audit complet et améliorations pour la conformité WCAG 2.1 AA
- Ajout de la navigation au clavier complète
- Amélioration du contraste des couleurs
- Ajout d'attributs ARIA appropriés
- Support amélioré des lecteurs d'écran

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
- Conformité complète aux standards d'accessibilité

## Améliorations possibles

- Export des résultats au format PDF ou Excel
- Fonctionnalités avancées de filtrage et de tri
- Analyses statistiques plus approfondies
- Support de questionnaires multilingues
- Mode de comparaison entre différents jeux de données

## Licence

Ce projet est sous licence MIT.
- Clear error messages and validation
- Export options for processed data
- Responsive design for desktop and mobile devices

## Technologies utilisées

- [Next.js](https://nextjs.org/) - Framework React
- [TypeScript](https://www.typescriptlang.org/) - Typage statique
- [Material-UI](https://mui.com/) - Composants d'interface
- [Chart.js](https://www.chartjs.org/) - Visualisation de données
- [SheetJS](https://sheetjs.com/) - Lecture de fichiers Excel

## Gestion des erreurs

L'application inclut un système de gestion d'erreurs avancé qui :
- Affiche des notifications claires et détaillées en cas d'erreur
- Fournit des messages d'erreur spécifiques pour différents types de problèmes
- Offre des actions possibles pour résoudre les erreurs
- Maintient une expérience utilisateur fluide même en cas d'erreur

Pour plus d'informations sur la gestion des erreurs, consultez le [Guide de gestion des erreurs](src/docs/ERROR_HANDLING_GUIDE.md).

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
├── contexts/         # Contextes React pour la gestion d'état
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

Pour une documentation détaillée du projet, veuillez consulter le fichier [COMPREHENSIVE_DOCUMENTATION.md](COMPREHENSIVE_DOCUMENTATION.md) qui contient :
- Spécifications techniques complètes
- Structure des fichiers
- Logique de traitement des données
- Architecture de l'application
- Considérations de performance et de sécurité
- Instructions d'utilisation
- Améliorations futures possibles

Cette documentation est automatiquement mise à jour à chaque commit grâce à notre système de documentation automatisé. Pour plus d'informations sur ce système, consultez [DOCUMENTATION_SYSTEM.md](DOCUMENTATION_SYSTEM.md).

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