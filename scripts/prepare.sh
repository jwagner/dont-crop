#!/bin/sh
set -e
ts_config="tsconfig-release.json"
rm -rf dist/*
tsc -P "$ts_config" -d
tsc -P "$ts_config" -d -m commonjs --outDir dist/cjs/
find dist/ -name *.d.ts -not -name lib.d.ts -delete