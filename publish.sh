REMOTE=`git remote get-url --push origin`
rm -rf dist
mkdir dist/
cd dist

cp ../index.html ./dokieli.html
cp ../markdown/index.html ./index.html
cp ../markdown/dokieli_markdown.html ./dokieli_markdown.html
cp ../markdown/dokieli_smartdown.html ./dokieli_smartdown.html
cp ../scripts/dokieli.js ./
cp ../scripts/dokieli.js.map ./
# cp ../scripts/smartdownStarter.js ./
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
