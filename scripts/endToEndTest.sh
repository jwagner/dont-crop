#!/bin/bash
set -e
node_major_version=$(node --version|sed 's/v\([^.]*\).*/\1/g')
rm -rf e2e
mkdir -p e2e

rm -f dont-crop*.tgz
npm pack
tarball=(dont-crop*.tgz)

mv "$tarball" e2e

cp -R examples/node-sharp e2e
cd e2e/node-sharp
npm unlink dont-crop
npm install "../$tarball" 
echo "testing commonjs"
npm start
# test esm compatibility  as  well
if [ "$node_major_version" -ge 14 ]
  then
    echo "testing esm"
    node --loader ts-node/esm example.ts
fi
cd ../../
rm -rf e2e
echo "testing browser"
ts-node scripts/puppeteer.ts