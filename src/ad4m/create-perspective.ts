import { getAd4mClient } from "@perspect3vism/ad4m-connect";
import type { Ad4mClient, PerspectiveProxy } from "@perspect3vism/ad4m";

const PERSPECTIVE_NAME = "AD4M Tutorial Neighbourhoods";

async function createPerspective(): Promise<PerspectiveProxy> {
  const ad4m: Ad4mClient = await getAd4mClient();

  // Try to find our tutorial perspective
  const allPerspectives = await ad4m.perspective.all()
  let perspective = allPerspectives.find(p => p.name === PERSPECTIVE_NAME)

  // Create it if it's not there
  if (!perspective) {
    perspective = await ad4m.perspective.add(PERSPECTIVE_NAME);
  }

  // Return for the tutorial page to use it
  return perspective;
}

export default createPerspective;