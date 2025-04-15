@echo off
echo Starting Dental Application...

:: Start the backend server
start cmd /k "cd dentist_back && npm run dev"

:: Start the frontend server
start cmd /k "cd dentist_front && npm run dev"

:: Wait a few seconds for servers to start
timeout /t 5

:: Open the browser to the application
start http://localhost:3000

echo Application started! Check your browser. 