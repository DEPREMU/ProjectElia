@echo off
echo Starting the application...

if not exist "node_modules" (
    echo node_modules not found, running npm install...
    npm install
    npm start
)

npm start
