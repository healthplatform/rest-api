rest-api
========

Note: to build rest-api-dist run:

    find -type f -not -name "*.ts" -and -not -path "./.git/*" | cpio -pdamv ../rest-api-dist && sed -i '/*.js/d' ../rest-api-dist/.gitignore && find ../rest-api-dist -name '*.ts' -delete

Simple baseline scaffold to get you started using Waterline and Restify with TypeScript.


## Install prerequisites

  0. node & npm (tested with node v4 and npm v3.3.4 on Ubuntu 15.04 x64)
  1. Run: `npm install -g tsd typescript`
  2. `cd` to directory you've cloned this repo into
  3. Run: `npm install`
  4. Run: `tsd install`

## Compile+run app

    tsc --sourcemap --module commonjs main.ts
    node main.js

Or:

    npm start

## Misc

### Cleanup compiled output

When not add *.js to `.gitignore`, clean out compiled js with this GNU findutils solution:

    find -name '*.js.map' -type f -exec bash -c 'rm "${1}" "${1%????}"' bash {} \;

Or delete all '*.js' outside of `node_modules` with:

    find \( -name node_modules -prune \) -o -name '*.js' -type f -exec rm {} \;

More complicated solution handling "foo.ts" & "foo.js" without "foo.js.map" coming at some point.
