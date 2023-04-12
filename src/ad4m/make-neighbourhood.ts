import { getAd4mClient } from "@perspect3vism/ad4m-connect";
import { Ad4mClient, Perspective } from "@perspect3vism/ad4m";
import type { PerspectiveProxy } from "@perspect3vism/ad4m";

async function makeNeighbourhood(perspective: PerspectiveProxy) {
  const ad4m: Ad4mClient = await getAd4mClient();

  // First check if the perspective is already a neighbourhood
  if (perspective.sharedUrl) {
    console.log("Perspective already a neighbourhood with URL:", perspective.sharedUrl);
    return perspective.sharedUrl;
  }

  // AD4M has a way to store Link Language templates and currently comes with one
  // Language based on Holochain.
  const langs = await ad4m.runtime.knownLinkLanguageTemplates();
  // This function will take the template Language, insert the given parameters,
  // publish the result to the network and return the new Language's address.
  const linkLanguage = await ad4m.languages.applyTemplateAndPublish(
    langs[0],
    JSON.stringify({
      uuid: perspective.uuid,
      name: `${perspective.name}-link-language`,
    })
  );

  // This will setup our local Perspective with the new Link Language 
  // such that any change to the Perspective will be automatically 
  // published to Link Language network and any change coming-in 
  // from the Link Language will affect our local Perspective.
  // It will also create an Expression in the built-in Neighbourhood Language,
  // including the Link Language's address, and return the URL of this
  // Neighbourhood Expression.
  const sharedUrl = await ad4m.neighbourhood.publishFromPerspective(
    perspective.uuid, // The UUID of the Perspective to publish
    linkLanguage.address,  // Address of the Link Language to use
    new Perspective() // Optional meta-information about the Neighbourhood
  );

  console.log("Neighbourhood created with URL:", sharedUrl);

  // This URL can be shared with others to allow them to join the Neighbourhood
  return sharedUrl;
}

export default makeNeighbourhood;