#!/bin/bash

DIR=`pwd`
URL=`git config --get remote.origin.url`
TMPDIR=../cryptris-gh-pages

# clone repository from origin url to tmpdir
echo "Publishing to fresh branch gh-pages @ ${URL} using tmpdir ${TMPDIR} in 3 seconds..."
sleep 3

rm -rf ${TMPDIR}
git clone ${URL} ${TMPDIR}

cd ${TMPDIR}
./javascript_replace.sh
./translate.sh
git checkout --orphan gh-pages
git rm --cached -r .

git add *.html css docs fonts html img js snapshots vendor
git commit -m "publish"
git push --set-upstream origin gh-pages
