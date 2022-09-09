import { start } from './processor'

(async () => {
  try {
    await start();
  } catch (e) {
    console.error(e);
  }
})();