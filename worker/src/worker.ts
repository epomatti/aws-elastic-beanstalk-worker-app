import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';

const LONG_RUNNING_TASK_DURATION: number = Number(process.env.LONG_RUNNING_TASK_DURATION);
console.log(`Long running task will delay for: ${LONG_RUNNING_TASK_DURATION} ms`);

const delay = async (ms: number) => {
  return await new Promise(resolve => setTimeout(resolve, ms));
}

const start = async () => {

  const app = express()
  const port: number = Number(process.env.PORT);

  app.post('/', async (req: any, res: any) => {
    console.log("received message");
    await delay(LONG_RUNNING_TASK_DURATION);
    console.log("message processed");
    res.send('Ok')
  })

  app.get('/health', (req: any, res: any) => {
    res.send('Ok')
  })

  app.listen(port, () => {
    console.log(`Worker endpoint started on port ${port}`)
  })
}

export { start };
