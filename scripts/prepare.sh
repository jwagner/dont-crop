#!/bin/sh
set -e
ts_config="tsconfig-release.json"
rm -rf dist/*
tsc -P "$ts_config" -d
tsc -P "$ts_config" -d -m commonjs --outDir dist/cjs/
find dist/ -name *.d.ts -not -name lib.d.ts -delete
# Node insists on .js extensions for esm import/from statements,
# ts refuses to add them but tolerates the presence of .js.
# That doesn't seem to work with ts-jest and probably other options.
# So this fragile and soul crushing hack will have to do for now.
for f in dist/mjs/*.js
do
  sed -i -E "s/from '([^']+)';$/from '\1.js';/g" "$f"
done
# another hack to make modules play nicely with node
# in order to support commonjs the parent module doesn't have
# type module. But without that imports in the mjs variant
# will be treated as commonjs. This fixes that.
# At least it's more robust than the hack above.
echo '{"type":"module"}' > dist/mjs/package.json
