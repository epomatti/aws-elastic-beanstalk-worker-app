#!/usr/bin/env bash

DIR=$( dirname -- "$0"; )
aws dynamodb create-table --cli-input-json "file://$DIR/table-schema.json"