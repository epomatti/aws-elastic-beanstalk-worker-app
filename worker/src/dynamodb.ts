import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import { getConfig } from "./config";

const config = getConfig();

export const putItem = async (id: string, status: string) => {
  const client = new DynamoDBClient({ region: config.dynamodbRegion });

  const input: PutItemCommandInput = {
    TableName: config.dynamodbTableName,
    Item: {
      "MessageId": { "S": id },
      "Status": { "S": status }
    }
  }
  const command = new PutItemCommand(input);
  await client.send(command);
}
