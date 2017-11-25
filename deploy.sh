#!/usr/bin/env bash

host="polytech-info.fr"
user="root"
workdir="/home/cloud/test/"

ssh ${user}@${host} mkdir ${workdir} -p
scp docker-compose.yml ${user}@${host}:${workdir}


ssh ${user}@${host} cd ${workdir}
ssh ${user}@${host} docker-compose pull
ssh ${user}@${host} docker-compose up

exit
