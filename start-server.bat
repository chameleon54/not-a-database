@echo off
cd /d "%~dp0"
start http://localhost:8000/datajson.html
php -S localhost:8000
pause
