import { getAd4mClient } from "@perspect3vism/ad4m-connect";
import type { Ad4mClient, LanguageHandle } from "@perspect3vism/ad4m";

/*
 * Function to show installed languages
 */
export default async function languages() {
  const ad4m: Ad4mClient = await getAd4mClient();

  // We retrieve all installed languages
  const installedLanguages: LanguageHandle[] = await ad4m.languages.all();
  console.log(installedLanguages);

  // And ask for the meta info of one of them
  const metaInfo = await ad4m.languages.meta(installedLanguages[1].address);
  console.log(metaInfo);
}