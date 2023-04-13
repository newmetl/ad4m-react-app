import { Literal, PerspectiveProxy, LinkQuery, LinkExpression } from "@perspect3vism/ad4m";
import { Todo } from "../types/Todo";

export async function fetchTodos(perspective: PerspectiveProxy, projectId: string): Promise<Todo[]> {
    const queryResults = await perspective.get(new LinkQuery({ source: projectId }));

    const queryTodos: { [key: string]: Todo } = {};
    const todoIds: string[] = [];

    queryResults.map((result) => {
        if (result.data.predicate == "project://has_todo") {
        const newTodo: Todo = { id: result.data.target };
        queryTodos[newTodo.id] = newTodo;
        todoIds.push(newTodo.id);
        }
    });

    return new Promise((resolve) => {
        const todoPormises: Promise<Todo>[] = todoIds.map((todoId) => {
            return fetchTodo(perspective, todoId);
        });
    
        Promise.all(todoPormises).then((todos) => {
            resolve(todos);
        });
    });
}

export async function fetchTodo(perspective: PerspectiveProxy, todoId: string): Promise<Todo> {
    const queryResults = await perspective.get(new LinkQuery({ source: todoId}))

    const todo: Todo = { id: todoId };
    queryResults.map((result) => {
        const attrName = result.data.predicate.substring(7);
        if (attrName == "title")
            todo.title = decodeURIComponent(result.data.target.substring(17));
        if (attrName == "state") {
            todo.state = result.data.target.substring(7) == 'true';
        }
    });

    return todo;
}

export async function createTodo(perspective: PerspectiveProxy, projectId: string, title: string, state: boolean) {
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
