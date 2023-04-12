import { getAd4mClient } from "@perspect3vism/ad4m-connect";
import type {
  Ad4mClient
} from "@perspect3vism/ad4m";

export const PERSPECTIVE_NAME = 'Todo React Perspective';

export async function ensurePerspective(ad4mClient: Ad4mClient) {
  ad4mClient?.perspective.all().then((perspectives) => {
    let perspective = perspectives.find(p => p.name === PERSPECTIVE_NAME)
    if (!perspective) {
      console.log('Creating perspective');
      return ad4mClient.perspective.add(PERSPECTIVE_NAME);
    } else {
      console.log('Perspective found', perspective.name, perspective);
      return perspective;
    }
  });
}

// export default async function perspectives() {
//   const ad4m: Ad4mClient = await getAd4mClient();

//   // We retrieve all Perspectives
//   const perspectives: PerspectiveProxy[] = await ad4m.perspective.all();
//   console.log(
//     "All Perspectives: " + perspectives.map((p) => `${p.name}: ${p.uuid}`)
//   );
//   console.log(perspectives);

//   // If there are no perspectives, we create one
//   if (perspectives.length === 0) {
//     const newPerspective = await ad4m.perspective.add(
//       "My tutorial perspective"
//     );
//     // ... and add a link to it
//     await newPerspective.add({
//       source: "ad4m://self",
//       target: "literal://string:Hello%20World",
//     });
//     perspectives.push(newPerspective);
//   }

//   // PerspectiveProxy is just a more specialized Ad4mClient for
//   // remote controlling a specific perspective.
//   const p1: PerspectiveProxy = perspectives[0];

//   // The following function returns a "rendered" full Perspective object
//   // containing all links
//   const snapshot: Perspective = await p1.snapshot();

//   console.log(snapshot);
// }