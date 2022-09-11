#!/usr/bin/env bash

if [ -z $queue ] || [ $queue = "" ]
then
      echo "Error: SQS queue URL is null or empty. Set the \$queue variable".
      exit -1
fi

END=$1
MSG_COUNT=1

for ((i=1;i<=END;i++)); do

      JSON_BATCH=""
      
      for ((j=1;j<=10;j++)); do
            JSON_BATCH=$JSON_BATCH"{ \"Id\": \"msg-$MSG_COUNT\", \"MessageBody\" : \"{ \\\"id\\\": \\\"msg-$MSG_COUNT\\\" }\" }, "
            MSG_COUNT=$((MSG_COUNT+1))
      done
      JSON_BATCH=${JSON_BATCH::-2}
      JSON_BATCH="[ $JSON_BATCH ]"
      echo $JSON_BATCH > entries.json
      echo "Sending batch $i"
      aws sqs send-message-batch --queue-url $queue --entries file://entries.json
done
