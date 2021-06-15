#!/bin/sh
npm run build
npm run docs
npm run test
npm run endToEndTest
rsync -rv public/ x.29a.ch:/var/www/static/sandbox/2021/dont-crop/
