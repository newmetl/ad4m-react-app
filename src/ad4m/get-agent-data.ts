import { getAd4mClient } from "@perspect3vism/ad4m-connect";
import type { Ad4mClient, Agent } from "@perspect3vism/ad4m";

/*
 * Function to retrieve and display the user's DID and public perspective.
 */
export default async function getAgentData() {
  // Once conneced, we can get the client using getAd4mClient()
  const ad4m: Ad4mClient = await getAd4mClient();

  // The me() function returns the agent object of the current user
  const me: Agent = await ad4m.agent.me();

  // Now we can access your did
  console.log("Your did is: " + me.did);

  // We can also get the contents of your public agent profile
  console.log(me.perspective);
}