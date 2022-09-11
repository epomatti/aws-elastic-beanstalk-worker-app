//TODO: implement singleton here

export interface Config {
  // The port on which to listen for HTTP messages sent by the SQS daemon
  port: number;
  // The delay to simulate a long-running task in milliseconds
  longRunningTaskDuration: number;
  // DynamoDB values
  dynamodbRegion: string;
  dynamodbTableName: string;
}

export const getConfig = (): Config => {
  return {
    port: Number(process.env.PORT),
    longRunningTaskDuration: Number(process.env.LONG_RUNNING_TASK_DURATION),
    dynamodbRegion: String(process.env.DYNAMODB_REGION),
    dynamodbTableName: String(process.env.DYNAMODB_TABLE_NAME)
  }
}
