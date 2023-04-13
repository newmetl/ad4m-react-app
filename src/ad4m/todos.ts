import { Literal, PerspectiveProxy, LinkQuery, Link, LinkExpressionInput, LinkExpression } from "@perspect3vism/ad4m";
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

export async function updateTodo(perspective: PerspectiveProxy, todo: Todo): Promise<Todo> {
    const queryResults = await perspective.get(new LinkQuery({ source: todo.id }));

    let linkPromises: (Promise<LinkExpression> | undefined)[] = queryResults.map((linkExpression) => {
        const attrName = linkExpression.data.predicate.substring(7);

        if (attrName == "title") {

            const updateLink = new Link({
                source: todo.id,
                predicate: "todo://title",
                target: Literal.from(todo.title).toUrl()
            });

            return perspective.update(linkExpression, updateLink);
        }

        if (attrName == "state") {

            const updateLink = new Link({
                source: todo.id,
                predicate: "todo://state",
                target: `todo://${(!!todo.state).toString()}`
            });

            return perspective.update(linkExpression, updateLink);
        }

    });

    linkPromises = linkPromises.filter((promise) => promise !== undefined);

    // return todo after all links were updated
    return new Promise((resolve) => {
        Promise.all(linkPromises).then(() => {
            resolve(todo);
        });

    });
}

export async function deleteTodo(perspective: PerspectiveProxy, projectId: string, todo: Todo): Promise<Todo> {
    const promises: Promise<LinkExpression[]>[] = [];

    let queryResults = await perspective.get(new LinkQuery({ source: todo.id}));
    promises.push(perspective.removeLinks(queryResults));

    queryResults = await perspective.get(new LinkQuery({ source: projectId, target: todo.id}));
    promises.push(perspective.removeLinks(queryResults));
            
    // return todo after all links are removed
    return new Promise((resolve) => {
        Promise.all(promises).then(() => resolve(todo));
    });

}