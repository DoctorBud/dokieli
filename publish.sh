REMOTE=`git remote get-url --push origin`
rm -rf dist
mkdir dist/
cd dist

cp ../indexoverview.html ./index.html
cp ../index.html ./dokieli.html
cp ../indexmarkdown.html ./dokieli_markdown.html
cp ../indexsmartdown.html ./dokieli_smartdown.html
cp ../scripts/dokieli.js ./
cp ../scripts/dokieli.js.map ./
cp ../scripts/smartdownStarter.js ./
cp ../media/css/basic.css ./
cp ../media/css/dokieli.css ./
cp ../media/css/easymde.css ./
touch .nojekyll
ls -la

git init
git add . .nojekyll
git commit -m "Initial commit"
git remote add origin ${REMOTE}
git push --force origin master:gh-pages
