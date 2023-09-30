#!/bin/bash
set -e

git pull
echo "git pull"

yarn 
echo "yarn"

yarn build
echo "yarn build done"

aws s3 sync build/ s3://testnet.clubrare.xyz --acl public-read
echo "sync to s3 is done for clubrare"

aws cloudfront create-invalidation --distribution-id E3LMC5LQKQC3SV --paths "/*"

echo "created invalidation!"
echo "Successfully deployed!"
