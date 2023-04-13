import React, { useEffect, useState } from 'react';

import { LinkQuery, Ad4mClient, Link, LinkExpressionInput } from "@perspect3vism/ad4m";
import { getAd4mClient } from '@perspect3vism/ad4m-connect';

import { connectToAd4m, ensurePerspectiveAndProject } from './ad4m/setup';

import TodoList from './TodoList';
import CreateTodo from './CreateTodo';
import { Todo } from './types/Todo';

import { fetchTodos } from './ad4m/todos';

import { PROJECT_ID, PERSPECTIVE_NAME } from './constants';

import './App.css';

import createTodo from './ad4m/create-todo';


function App() {
  console.log('--> render()');

  const [ad4mClient, setAd4mClient] = useState<Ad4mClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState(false);

  const [todos, setTodos] = useState<Todo[]>([]);

  const loadTodosFromPerspective = () => {
    console.log('--> loadTodosFromPerspective()');

    setIsLoadingState(true);

    getAd4mClient().then((client) => {
      ensurePerspectiveAndProject(client).then((perspective) => {
        fetchTodos(perspective, PROJECT_ID)
          .then((todos) => {
            setTodos(todos);
            setIsLoadingState(false);
          });
      });
    });
  }

  useEffect(() => {
    console.log('--> useEffect()');

    if (!isConnected) {
      console.log('-- --> ad4m not connected. Connecting now ...');
      connectToAd4m().then((client: Ad4mClient) => {
        ensurePerspectiveAndProject(client).then(() => {
          loadTodosFromPerspective();
        });
        setIsConnected(true);
      });
    }
		
		/*
		* Display the UI, asking the user to approve and grant these capabilities.
		*/
    
	}, []);

  const onClickTodoItem = (todoId: string) => {
    console.log('--> onClickTodoItem');
    setIsLoadingState(true);
    ad4mClient?.perspective.all().then((perspectives) => {
      const perspective = perspectives.find(p => p.name === PERSPECTIVE_NAME)
      if (!perspective) {
        // console.log('Creating perspective');
        // ad4mClient.perspective.add(PERSPECTIVE_NAME).then((result) => console.log(result));
      } else {
        console.log('Perspective found', perspective.name, perspective);
      }
      if (perspective) {
        // console.log('Getting clicked link');
        perspective.get(new LinkQuery({ source: todoId})).then((queryResults) => {
          // console.log('Found all links for todo:', todoId, queryResults);
          // building a new todo
          const todo: Todo = { id: todoId };
          queryResults.map((result) => {
            // console.log('Todo link result', result.data);
            const attrName = result.data.predicate.substring(7);
            // console.log('attrName', attrName);
            // if (attrName == "title")
            //   todo.title = decodeURIComponent(result.data.target.substring(17));
            if (attrName == "state") {
              // console.log('result.data.target', result.data.target);
              const checked = result.data.target.substring(7) === 'true';
              // console.log('passed check state', checked);
              const newTarget = `todo://${!checked ? 'true' : 'false'}`;
              // console.log('new checked state', newTarget);
              const newLink = new Link({
                source: todoId,
                predicate: "todo://state",
                target: newTarget
              });
              // console.log('Updating link', result, newLink);
              const linkExpressionInput = new LinkExpressionInput();
              perspective.update(result, newLink).then(() => {
                // console.log('After update link');
                loadTodosFromPerspective();
              });
            }
            
            // queryTodos[todo.id] = todo;
          });
          // console.log('queryTodos', queryTodos);
          // setTodos(Object.values(queryTodos));
        });
      } else
        console.log('No perspective found');
    });
  }

  const onCreateNewTodo = (text: string) => {
    console.log('--> onCreateNewTodo()', text);
    setIsLoadingState(true);
    
    ad4mClient?.perspective.all().then((perspectives) => {
      const perspective = perspectives.find(p => p.name === PERSPECTIVE_NAME)
      if (!perspective) {
        // console.log('Creating perspective');
        // ad4mClient.perspective.add(PERSPECTIVE_NAME).then((result) => console.log(result));
      } else {
        console.log('Perspective found', perspective.name, perspective);
      }
      if (perspective)
        createTodo(perspective, PROJECT_ID, text, false);
      else
        console.log('No perspective found');

    });

    loadTodosFromPerspective();
  }

  const onRemoveTodo = (todoId: string) => {
    console.log('--> onRemoveTodo()', todoId);
    setIsLoadingState(true);
    ad4mClient?.perspective.all().then((perspectives) => {
      const perspective = perspectives.find(p => p.name === PERSPECTIVE_NAME)
      if (!perspective) {
        // console.log('Creating perspective');
        // ad4mClient.perspective.add(PERSPECTIVE_NAME).then((result) => console.log(result));
      } else {
        console.log('Perspective found', perspective.name, perspective);
      }
      if (perspective) {
        // console.log('Getting clicked link');
        perspective.get(new LinkQuery({ source: todoId})).then((queryResults) => {
          perspective.removeLinks(queryResults)
            .then(() => loadTodosFromPerspective());
        });

        perspective.get(new LinkQuery({ source: PROJECT_ID, target: todoId})).then((queryResults) => {
          perspective.removeLinks(queryResults)
            .then(() => loadTodosFromPerspective());
        });

      }
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <TodoList
          disabled={isLoadingState}
          onTodoItemClick={onClickTodoItem}
          onRemove={onRemoveTodo}
          data={todos} />
        <CreateTodo onSubmit={onCreateNewTodo} />
      </header>
    </div>
  );
}

export default App;
