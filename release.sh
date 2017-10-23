git checkout release
git rebase master
npm run build
git add dist 
git status
echo -e "\n-------------------------------------------------"
echo -e "Rebased branch ready to be committed and pushed\n"
