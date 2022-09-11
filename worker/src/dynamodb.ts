import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";

const region = process.env.DYNAMODB_REGION;
const tableName = process.env.DYNAMODB_TABLE_NAME;

export const putItem = async (id: string, status: string) => {
  console.log("1");
  const client = new DynamoDBClient({ region: region });
  console.log("2");
  
  const input: PutItemCommandInput = {
    TableName: tableName,
    Item: {
      "MessageId": { "S": id },
      "Status": { "S": status }
    }
  }
  console.log("3");
  
  const command = new PutItemCommand(input);
  console.log("4");
  const output = await client.send(command);
  console.log("5");
  console.log(output);
}
