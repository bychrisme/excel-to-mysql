#!/usr/bin/env bash

git pull
cp .env.example .env
npm install
pm2 stop server.js --name excel-mysql
pm2 start server.js --name excel-mysql