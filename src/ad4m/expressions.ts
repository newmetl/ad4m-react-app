import { getAd4mClient } from "@perspect3vism/ad4m-connect";
import type { Ad4mClient, Expression } from "@perspect3vism/ad4m";

const NOTE_IPFS_LANGUAGE = "QmbWg5VBFB1Zzce8X33GiGpMDXFPQjFQKS2T2rJtSYt7TJ";

export default async function expression() {
  const ad4m: Ad4mClient = await getAd4mClient();

  // Let's prove that the NOTE_IPFS_LANGUAGE exists
  const metaInfo = await ad4m.languages.meta(NOTE_IPFS_LANGUAGE);
  console.log(metaInfo);

  /*
   *  ad4m.expression.create() takes a content parameter that will be
   *  passed over to the language, which is identified by its address.
   *  Here we create a new expression in NOTE_IPFS_LANGUAGE
   */
  const newExprAddr = await ad4m.expression.create(
    "Hello World",
    NOTE_IPFS_LANGUAGE
  );

  /*
   *  The return value is the (global) URI of the newly created Expression
   *  in the fromat: <language address>://<expression address>.
   */
  console.log("Created new public expression: ", newExprAddr);

  /*
   *  This URI can be used (by all AD4M users) to retrieve the Expression's
   *  data from the Language, potentially installing the language if it is
   *  not already installed.
   */
  const retrievedExpression: Expression = await ad4m.expression.get(
    newExprAddr
  );

  /*
   *  In the output you can see that the expression is wrapped in an
   *  Expression object, containing author, timestamp, and signature
   */
  console.log("Retrieved expression: ", retrievedExpression);
}