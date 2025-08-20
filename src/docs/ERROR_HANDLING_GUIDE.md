# Guide de gestion des erreurs

Cette application fournit des notifications détaillées en cas d'erreur pour vous aider à résoudre les problèmes rapidement.

## Types d'erreurs courantes

### 1. Erreurs de chargement de fichiers

#### Fichier JavaScript (structure du questionnaire)
- **Format incorrect**: Le fichier doit être un fichier .js valide
- **Taille excessive**: La taille maximale autorisée est de 1 Mo
- **Fichier vide**: Le fichier ne doit pas être vide
- **Structure invalide**: Le fichier doit contenir une variable exportée nommée "templateSurveyQuestions"

#### Fichier Excel (réponses)
- **Format incorrect**: Le fichier doit être un fichier Excel .xlsx valide
- **Taille excessive**: La taille maximale autorisée est de 10 Mo
- **Fichier vide**: Le fichier ne doit pas être vide
- **Colonnes manquantes**: Le fichier doit contenir les colonnes obligatoires (ID_questionnaire, ENQUETEUR, DATE)

### 2. Erreurs de traitement

#### Structure du questionnaire
- **Questions dupliquées**: Chaque question doit avoir un ID unique
- **Options invalides**: Les questions à choix doivent avoir des options valides
- **Types invalides**: Les types de questions doivent être parmi les valeurs autorisées

#### Données Excel
- **ID dupliqués**: Chaque répondant doit avoir un ID unique
- **Lignes vides**: Le fichier ne doit pas contenir de lignes vides
- **Format des données**: Les données doivent correspondre à la structure du questionnaire

### 3. Erreurs système
- **Mémoire insuffisante**: Essayez avec un fichier plus petit
- **Temps d'attente dépassé**: Réessayez l'opération
- **Erreur inconnue**: Contactez le support si le problème persiste

## Notifications d'erreurs

L'application affiche des notifications détaillées pour chaque erreur avec :
- Un titre clair indiquant le type d'erreur
- Un message détaillé expliquant le problème
- Des actions possibles pour résoudre l'erreur
- Un code d'erreur pour le support technique

## Conseils de dépannage

### Pour les fichiers JavaScript
1. Vérifiez que le fichier contient bien la variable "templateSurveyQuestions"
2. Assurez-vous que la syntaxe est correcte
3. Vérifiez que les IDs des questions sont uniques
4. Assurez-vous que les questions à choix ont des options valides

### Pour les fichiers Excel
1. Vérifiez que les colonnes obligatoires sont présentes
2. Assurez-vous que chaque répondant a un ID unique
3. Vérifiez qu'il n'y a pas de lignes vides
4. Assurez-vous que le format des données correspond à la structure du questionnaire

### En cas de problème persistant
1. Essayez de recharger la page
2. Vérifiez que vous utilisez les dernières versions des fichiers
3. Contactez le support avec le code d'erreur affiché