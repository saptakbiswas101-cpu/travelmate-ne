# TravelMateNE — Development Runner PowerShell Script
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       Starting TravelMateNE — Explore Northeast        " -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

$env:PATH = "C:\Users\saptak biswas\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\saptak biswas\.cache\codex-runtimes\codex-primary-runtime\dependencies\python;C:\Users\saptak biswas\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\Scripts;" + $env:PATH
$env:NODE_OPTIONS = "--dns-result-order=ipv4first"

Write-Host "`n1. Launching FastAPI Backend on http://localhost:8000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:PATH = '$env:PATH'; python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload"

Start-Sleep -Seconds 2

Write-Host "2. Launching React Vite Frontend on http://localhost:5173 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:PATH = '$env:PATH'; `$env:NODE_OPTIONS = '--dns-result-order=ipv4first'; cd '$PSScriptRoot\frontend'; node ./node_modules/vite/bin/vite.js"

Write-Host "`nBoth services are running!" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "Backend API docs: http://localhost:8000/docs" -ForegroundColor Yellow
