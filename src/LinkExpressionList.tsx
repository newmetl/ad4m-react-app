import Ad4mConnectUI from '@perspect3vism/ad4m-connect';
import React, { useEffect, useCallback, useState } from 'react';

import { getAd4mClient } from "@perspect3vism/ad4m-connect";
import type { Ad4mClient, Agent, Perspective, LinkExpression } from "@perspect3vism/ad4m";
import LinkExpressionItem from './LinkExpressionItem';

/*
 * Function to retrieve and display the user's DID and public perspective.
 */
async function getLinkExpressions(): Promise<LinkExpression[]> {
  // Once conneced, we can get the client using getAd4mClient()
  const ad4m: Ad4mClient = await getAd4mClient();

  // The me() function returns the agent object of the current user
  const me: Agent = await ad4m.agent.me();

  // Now we can access your did
  // console.log("Your did is: " + me.did);

  // We can also get the contents of your public agent profile
  // console.log(me.perspective);
  
  const perspective: Perspective | undefined  = me.perspective;
  
  let links: LinkExpression[] = [];

  if (perspective && perspective.links) {
    links = perspective.links;
  }

  return links;
}

function LinkExpressionList() {

  const [links, setLinks] = useState<LinkExpression[]>([]);

  useEffect(() => {
    getLinkExpressions().then((result) => setLinks(result));
	}, []);


  return (
    <ul>
      <li>ListExpressionList says hi!</li>
      {
        links.map((link: LinkExpression, index) => {

          return <LinkExpressionItem hash={() => 123} key={index} link={link} />
        })
        
      }
    </ul>
  );
}

export default LinkExpressionList;
