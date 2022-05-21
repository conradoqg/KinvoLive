#!/bin/bash

BASE_DIR="./src/main/service/kinvo.api"

echo "Generating schemas from samples (if they exist)..."
FILES="./src/main/service/kinvo.api/sample/*"
for SAMPLE_FILE in $FILES
do
  SCHEMA_FILE="$BASE_DIR/schema/$(basename $SAMPLE_FILE)"
  echo "Processing $SAMPLE_FILE file..."
  echo "  Schema: $SCHEMA_FILE"
  quicktype $SAMPLE_FILE -s json -l schema -o $SCHEMA_FILE
done

echo "Generating types from schemas..."
SCHEMA_DIR="$BASE_DIR/schema/*.json"
TS_FILE="./src/main/service/kinvo.api/kinvo.api.type.ts"
quicktype $SCHEMA_DIR -s schema -l ts  -o $TS_FILE --acronym-style original --converters all-objects --runtime-typecheck-ignore-unknown-properties --raw-type any
echo -e "/* eslint-disable */\n$(cat $TS_FILE)" > $TS_FILE

echo "Done."
