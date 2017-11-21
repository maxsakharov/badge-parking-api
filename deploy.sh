#!/bin/sh

BRANCH=`git rev-parse --abbrev-ref HEAD`
ACTION=$1
SERVICE=badge-api.service
DEV_SERVER=34.238.8.62
PROD_SERVER=187.23.1.45

if [[ -z ${ACTION} ]]; then
   ACTION="plan"
fi

docker_build() {
    echo "\033[36mBuilding Docker image...\033[0m"
    docker build -t maxsakharov/badge-parking-api:$1 .
    echo "\033[36mPushing Docker image...\033[0m"
    docker push maxsakharov/badge-parking-api:$1 || \
        { echo "\033[31mCan't push to the docker hub! Forgot 'docker login'?\033[0m"; exit 1; }
}

if [[ ${BRANCH} == 'master' ]]; then
    docker_build prod
    echo "\033[93mDeploying to prod!\033[0m"
    ssh -i ~/.ssh/honda_hackaton.pem core@${PROD_SERVER} "sudo systemctl restart ${SERVICE}"
else
    docker_build dev
    echo "\033[36mDeploying to dev!\033[0m"
    ssh -i ~/.ssh/honda_hackaton.pem core@${DEV_SERVER} "sudo systemctl restart ${SERVICE}"
fi;

echo "\033[93mDone!\033[0m"