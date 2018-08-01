#!/usr/bin/env bash
git checkout master                                              #切换master分支
git merge dev                                                    #合并dev分支

#!/usr/bin/env sh
#set -e用于设置当命令以非零状态退出时，则退出shell。
#主要作用是，当脚本执行出现意料之外的情况时，立即退出，避免错误被忽略，导致最终结果不正确
#set -e
echo "Enter release version: "
read VERSION                                                     #输入版本号

read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r       #输入一个字符
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]                                        #判断输入的值是否是Y或y
then
  echo "Releasing $VERSION ..."

  # build
  #VERSION=$VERSION npm run dist                                  #不清楚

  # publish theme
  #echo "Releasing theme-chalk $VERSION ..."
  #cd packages/theme-chalk                                        #进入文件夹
  #npm version $VERSION --message "[release] $VERSION"            #修改当前文件夹下package.json中version的值
  #if [[ $VERSION =~ "beta" ]]                                    #判断版本中是否含有beta字符串
  #then
  #  npm publish --tag beta                                       #发布beta版本
  #else
  #  npm publish                                                  #发布稳定版本
  #fi
  #cd ../..                                                       #回到主目录

  # commit
  git add -A                                                     #git add .和git add -u的集合
  git commit -m "[build] $VERSION"                               #提交
  npm version $VERSION --message "[release] $VERSION"            #修改当前文件夹下package.json中version的值

  # publish
  git push origin master                                          #将本地master代码提交到远程master上
  git push origin refs/tags/v$VERSION                             #将本地master代码提交到一个新的远程分支上
  git checkout dev                                               #切换dev分支
  git rebase master                                              #合并master分支
  git push origin dev                                             #将本地dev代码提交到远程dev上
  read a
  read a
  read a
  #if [[ $VERSION =~ "beta" ]]
  #then
  #  npm publish --tag beta
  #else
  #  npm publish
  #fi
fi

