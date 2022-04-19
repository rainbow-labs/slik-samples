#!/bin/bash

gcloud config set project slikdevelopers

firebase deploy --only hosting:slikfilesdemo
