#!/usr/bin/env bash

#echo "Switch to production database settings"
#exit

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
echo 'vera.hydev.org' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:HyDevelop/VeracrossAnalyzer.Client.git master:gh-pages

cd -
