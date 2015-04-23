jekyll build --destination output
cp output/* ~/Public/subinsebastien.github.com/*
cd ~/Public/subinsebastien.github.com/
git rm -r --cached .
git add .
git commit -m "Blog updates"
git push -u origin master
cd ~/Downloads/Personal\ Blog/blog/
rm -r output