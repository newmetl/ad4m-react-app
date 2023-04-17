import { Ad4mClient } from "@perspect3vism/ad4m";
import { PERSPECTIVE_NAME } from "../constants";


export async function resetAd4m(client: Ad4mClient): Promise<void> {
  console.log('--> resetAd4m()');

  const perspectives = await client?.perspective.all();
  let perspective = perspectives.find(p => p.name === PERSPECTIVE_NAME)

  return new Promise((resolve, reject) => {
    if (perspective) {
      client.perspective.remove(perspective.uuid).then(() => {
        client.perspective.all()
          .then((pers) => {
            resolve();
          });
      });
    } else {
      reject('Reset didn\'t work. No perspectve found.');
    }
  });


}