import type { Ad4mClient, PerspectiveProxy } from "@perspect3vism/ad4m";
import { LinkQuery } from "@perspect3vism/ad4m";
import Ad4mConnectUI from '@perspect3vism/ad4m-connect';

import {
  APP_DESCRIPTION,
  APP_DOMAIN,
  APP_ICON_PATH,
  APP_NAME,
  PERSPECTIVE_NAME,
  PROJECT_ID,
  PROJECT_NAME } from "../constants";

export async function connectToAd4m(): Promise<Ad4mClient> {
  const ui = Ad4mConnectUI({
    appName: APP_NAME,
    appDesc: APP_DESCRIPTION,
    appDomain: APP_DOMAIN,
    capabilities: [{ with: { domain: "*", pointers: ["*"] }, can: ["*"] }],
    appIconPath: APP_ICON_PATH,
  });

  return ui.connect();
}

export async function ensurePerspectiveAndProject(ad4mClient: Ad4mClient): Promise<PerspectiveProxy> {

  // ensure perspective
  const perspectives = await ad4mClient?.perspective.all();
  let perspective = perspectives.find(p => p.name === PERSPECTIVE_NAME)

  if (!perspective) {
    perspective = await ad4mClient.perspective.add(PERSPECTIVE_NAME);
  }

  // ensure project
  const queryResults = await perspective.get(new LinkQuery({ source: PROJECT_ID }));
  if (!queryResults.length) {
    const link = await perspective.add({
      source: PROJECT_ID,
      predicate: "project://has_name",
      target: `literal://string:${encodeURI(PROJECT_NAME)}`,
    });
  }

  return perspective;
}
