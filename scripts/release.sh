#!/bin/bash
git reset --hard
LAST_COMMIT_MESSAGE=`git log -1 --pretty=%B`

if [[ $LAST_COMMIT_MESSAGE == major* ]];
  then NPM_RELEASE_TYPE="major";
elif [[ $LAST_COMMIT_MESSAGE == feat* ]];
  then NPM_RELEASE_TYPE="minor";
elif [[ $LAST_COMMIT_MESSAGE == beta* ]];
  then NPM_RELEASE_TYPE="prerelease";
else NPM_RELEASE_TYPE="patch";
fi
echo $NPM_RELEASE_TYPE


git config --local user.email "tanner.barlow.dev@gmail.com"
git config --local user.name "Tanner Barlow"

SOURCE_BRANCH_NAME="master"

git pull origin ${SOURCE_BRANCH_NAME}
git checkout ${SOURCE_BRANCH_NAME}
echo "Checked out branch: ${SOURCE_BRANCH_NAME}"

NPM_VERSION=`npm version ${NPM_RELEASE_TYPE} -m "release: Update ${NPM_RELEASE_TYPE} version to %s [skip ci]"`
echo "Set NPM version to: ${NPM_VERSION}"

SHA=`git rev-parse HEAD`

git remote add authOrigin https://${CLVR_ACCESS_TOKEN}@github.com/tbarlow12/clvr.git
git push authOrigin ${SOURCE_BRANCH_NAME} --tags -f

echo "Pushed new tag: clvr-${NPM_VERSION} @ SHA: ${SHA:0:8}"

npm publish
