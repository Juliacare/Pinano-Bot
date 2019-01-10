@echo off
cls
start cmd.exe /k "C:\Program Files\MongoDB\Server\4.0\bin\mongod"
start cmd.exe /k "C:\Program Files\MongoDB\Server\4.0\bin\mongo"
start cmd.exe /k "node app.js"