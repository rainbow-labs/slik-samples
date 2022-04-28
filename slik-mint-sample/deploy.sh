#!/bin/bash

gcloud config set project slikdevelopers

yarn install
yarn build

firebase deploy --only hosting:slikmintdemo
