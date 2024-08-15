@echo off

if exist ".\node_modules\" (
    echo press a button now....
) else (
    echo installing dependencies...
    npm install

    if %errorlevel% neq 0 (
        echo Error: failed to install dependencies.
        exit /b %errorlevel%
    )
)

echo started successfully.
pause