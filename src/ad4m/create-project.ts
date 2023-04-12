import { LinkQuery, PerspectiveProxy } from "@perspect3vism/ad4m";

// We receive the perspective proxy from last step as function parameter
async function getOrCreateProject(perspective: PerspectiveProxy, projectName: string) {
  const PROJECT_ID = 'project://vypu5nacq';

  // Let's create a (fake) base expression that acts as a virtual ID
  // and root node for the project data
  // const projectId = "project://" + Math.random().toString(36).substr(2, 9);

  const queryResults = await perspective.get(new LinkQuery({ source: PROJECT_ID }));

  if (!queryResults.length) {
    // We create a Link, i.e. a triple of source, predicate, target,
    // that represents a meaningful statement about the project.
    const link = await perspective.add({
      source: PROJECT_ID,
      // We assume a "project" language with a "has_name" expression
      // and we use it here just to tag this Link
      predicate: "project://has_name",
      // The target is a literal string (more on this in a bit)
      target: `literal://string:${encodeURI(projectName)}`,
    });
  }
      
  // // Note that the link was signed by the users agent keys and turned
  // // into a Link Expression (so it can be shared with others once we
  // // upgrade this Perspective to a Neighbourhood)
  // console.log(link);
  // console.log(`User ${link.author} created a link at ${link.timestamp}: 
  // ${link.data.source} --${link.data.predicate}--> ${link.data.target}
  // Signature: ${link.proof.signature} ${link.proof.valid ? "valid" : "invalid"}
  // `);

  return PROJECT_ID;
}

export default getOrCreateProject;