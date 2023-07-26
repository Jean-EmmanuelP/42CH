#!/bin/bash

# Se déplacer dans le dossier backend
cd ./backend

# Executer npm start
echo "Lancement de npm start dans le dossier backend..."
npm start &

# Se déplacer vers la racine du projet
cd ..

# Exécuter docker-compose up
echo "Lancement de docker-compose up..."
docker-compose up &

# Exécuter npm run dev
echo "Lancement de npm run dev..."
npm run dev &

echo "Toutes les commandes ont été exécutées en arrière-plan."

