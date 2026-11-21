@echo off
echo ========================================================
echo        Starting TravelMateNE — Explore Northeast
echo ========================================================
echo.

echo 1. Starting FastAPI Backend on http://localhost:8000 ...
start "TravelMateNE Backend" cmd /k "python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 2 /nobreak >nul

echo 2. Starting React Vite Frontend on http://localhost:5173 ...
cd frontend
start "TravelMateNE Frontend" cmd /k "pnpm run dev"

echo.
echo Both servers have been launched!
echo Access the application at: http://localhost:5173
echo API Documentation at:     http://localhost:8000/docs
echo ========================================================
pause
