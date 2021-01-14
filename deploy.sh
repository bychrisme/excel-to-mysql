#!/usr/bin/env bash

git pull
yarn
pm2 stop excel-mysql
pm2 start --name excel-mysql npm -- start