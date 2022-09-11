import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { putItem } from './dynamodb';
import { delay } from './utils';
import { getConfig } from './config';

const config = getConfig();
console.log(`Long running task will delay for: ${config.longRunningTaskDuration} ms`);

const app = express();
app.use(express.json());

export const start = async () => {
  app.post('/', async (req, res) => {
    const id = req.body.id;
    console.log(`Received message: ${id}`);
    await delay(config.longRunningTaskDuration);
    await putItem(id, "OK");
    console.log(`Messaged processed: ${id}`);
    res.sendStatus(200);
  })

  app.get('/health', (req, res) => {
    res.sendStatus(200);
  })

  app.listen(config.port, () => {
    console.log(`Worker endpoint started on port ${config.port}`)
  })
}
