#!/usr/bin/env bash

aws dynamodb delete-table --table-name "BeanstalkTasks"

DIR=$( dirname -- "$0"; )
aws dynamodb create-table --cli-input-json "file://$DIR/dynamodb-table-schema.json"