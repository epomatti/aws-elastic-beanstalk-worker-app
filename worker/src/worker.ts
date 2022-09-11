import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { putItem } from './dynamodb';

const port: number = Number(process.env.PORT);
const LONG_RUNNING_TASK_DURATION: number = Number(process.env.LONG_RUNNING_TASK_DURATION);
console.log(`Long running task will delay for: ${LONG_RUNNING_TASK_DURATION} ms`);

const app = express();
app.use(express.json());

const delay = async (ms: number) => {
  return await new Promise(resolve => setTimeout(resolve, ms));
}

const start = async () => {
  app.post('/', async (req, res) => {
    const id = req.body.id;
    console.log(`Received message: ${id}`);
    await delay(LONG_RUNNING_TASK_DURATION);
    await putItem(id, "OK");
    console.log(`Messaged processed: ${id}`);
    res.send('Ok')
  })

  app.get('/health', (req, res) => {
    res.send('Ok')
  })

  app.listen(port, () => {
    console.log(`Worker endpoint started on port ${port}`)
  })
}

export { start };
