import { SQSClient, ReceiveMessageCommand, ReceiveMessageCommandInput } from "@aws-sdk/client-sqs";
require('dotenv').config()

const REGION = process.env.AWS_REGION;
const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;
const SQS_WAIT_TIME: number = Number(process.env.SQS_WAIT_TIME);
const SQS_MAX_NUMBER_OF_MESSAGES: number = Number(process.env.SQS_MAX_NUMBER_OF_MESSAGES);
const LONG_RUNNING_TASK_DURATION: number = Number(process.env.LONG_RUNNING_TASK_DURATION);

const params: ReceiveMessageCommandInput = {
  MaxNumberOfMessages: SQS_MAX_NUMBER_OF_MESSAGES,
  MessageAttributeNames: ["All"],
  QueueUrl: SQS_QUEUE_URL,
  WaitTimeSeconds: SQS_WAIT_TIME,
};

const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const start = async () => {
  const sqsClient = new SQSClient({ region: REGION });
  try {
    while (1) {
      const data = await sqsClient.send(new ReceiveMessageCommand(params));

      // Simulates a long running task
      await delay(LONG_RUNNING_TASK_DURATION);

      console.log(`Messages received: ${data.Messages?.length}. Http status code: ${data.$metadata.httpStatusCode}`);
    }
  } catch (err) {
    console.error("Error", err);
  }
}

export { start };