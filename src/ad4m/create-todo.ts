import { Literal, PerspectiveProxy } from "@perspect3vism/ad4m";

async function createTodo(perspective: PerspectiveProxy, projectId: string, title: string, state: boolean) {
  const todoId = "todo://" + Math.random().toString(36).substr(2, 9);

  // Asssociate TODO item with previously created project
  await perspective.add({
    source: projectId,
    predicate: "project://has_todo",
    target: todoId,
  });

  // Add title to the todo item
  await perspective.add({
    source: todoId,
    predicate: "todo://title",
    target: Literal.from(title).toUrl(),
  });

  // Add state to the todo item
  await perspective.add({
    source: todoId, 
    predicate: "todo://state", 
    target: `todo://${state.toString()}`
  });
}

export default createTodo;