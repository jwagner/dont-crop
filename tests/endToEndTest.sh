#!/bin/bash
set -e
node_major_version=$(node --version|sed 's/v\([^.]*\).*/\1/g')
rm -rf e2e
mkdir -p e2e

rm -f dont-crop*.tgz
npm pack
tarball=(dont-crop*.tgz)

mv "$tarball" e2e
cd e2e

# run node sharp example as end to end test for ts-node
cp -R ../examples/node-sharp .
cd node-sharp
npm unlink dont-crop
npm install "../$tarball" 
echo "testing ts-node commonjs"
npm start
# test esm compatibility  as  well
if [ "$node_major_version" -ge 14 ]
  then
    echo "testing ts-node esm"
    node --loader ts-node/esm example.ts
fi
cd ..

# test plain node module compatibility
cp -R ../tests/node-module-compatibility .
cd node-module-compatibility
npm install "../$tarball" 
echo "testing node commonjs"
node commonjs.js
if [ "$node_major_version" -ge 14 ]
  then
    echo "testing node esm"
    node esm.mjs
fi
cd ..

cd ..
rm -rf e2e
# run testsuite as end to end test using pupeteer
echo "testing browser"
ts-node tests/puppeteer.ts