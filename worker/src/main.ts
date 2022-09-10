import { start } from './processor'
import * as worker from './worker'

(async () => {
  try {
    await worker.start();
    // await start();
  } catch (e) {
    console.error(e);
  }
})();