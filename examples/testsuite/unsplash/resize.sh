#!/bin/bash
mkdir -p small
for f in *.jpg; do convert "$f" -resize 512x512\> -quality 90 "small/$f"; done
cd small
ls *.jpg|jq --raw-input --slurp 'split("\n") - [""] | {"images": .}' > index.json