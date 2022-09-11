import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";

const region = process.env.DYNAMODB_REGION;
const tableName = process.env.DYNAMODB_TABLE_NAME;

export const putItem = async (id: string, status: string) => {
  const client = new DynamoDBClient({ region: region });

  const input: PutItemCommandInput = {
    TableName: tableName,
    Item: {
      "MessageId": { "S": id },
      "Status": { "S": status }
    }
  }
  const command = new PutItemCommand(input);
  await client.send(command);
}
