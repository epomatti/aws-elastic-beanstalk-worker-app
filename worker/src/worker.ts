import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';

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
    console.log("received message");
    console.log(req.body);
    await delay(LONG_RUNNING_TASK_DURATION);
    console.log("message processed");
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
