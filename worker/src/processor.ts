import { SQSClient, ReceiveMessageCommand } from "@aws-sdk/client-sqs";
require('dotenv').config()

const REGION = process.env.AWS_REGION;
const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;

const params = {
  AttributeNames: ["SentTimestamp"],
  MaxNumberOfMessages: 1,
  MessageAttributeNames: ["All"],
  QueueUrl: SQS_QUEUE_URL,
  WaitTimeSeconds: 20,
};

const start = async () => {
  const sqsClient = new SQSClient({ region: REGION });

  try {
    const data = await sqsClient.send(new ReceiveMessageCommand(params));
    console.log("Success, ", data);
    return data;
  } catch (err) {
    console.log("Error", err);
  }

}

export { start };