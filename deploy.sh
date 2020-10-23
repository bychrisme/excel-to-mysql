#!/usr/bin/env bash

git pull
cp .env.beta .env
npm install
pm2 start server.js --name excel-mysql