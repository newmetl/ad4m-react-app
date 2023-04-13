import React, { useEffect, useState } from 'react';

import { LinkQuery, Ad4mClient, Link, LinkExpressionInput, Perspective } from "@perspect3vism/ad4m";
import { getAd4mClient } from '@perspect3vism/ad4m-connect';

import { connectToAd4m, ensurePerspectiveAndProject } from './ad4m/setup';

import TodoList from './components/TodoList';
import CreateTodo from './components/CreateTodo';
import { Todo } from './types/Todo';

import { fetchTodos, updateTodo } from './ad4m/todos';

import { PROJECT_ID, PERSPECTIVE_NAME } from './constants';

import './App.css';

import createTodo from './ad4m/create-todo';

function App() {
  console.log('--> render()');

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

	}, []);

  const onClickTodoItem = (todoId: string) => {
    console.log('--> onClickTodoItem');
    setIsLoadingState(true);
    getAd4mClient().then((client) => {
      ensurePerspectiveAndProject(client).then((perspective) => {
        const todo = todos.find((todo) => todo.id === todoId);
        if (todo) {
          const newTodo = {
            ...todo,
            state: !todo.state
          }
          updateTodo(perspective, newTodo).then(() => {
            loadTodosFromPerspective();
          });
        }
      });
    });
  }

  const onCreateNewTodo = (text: string) => {
    console.log('--> onCreateNewTodo()', text);
    setIsLoadingState(true);

    getAd4mClient().then((client) => {
      ensurePerspectiveAndProject(client).then((perspective) => {
        createTodo(perspective, PROJECT_ID, text, false).then(() => {
          loadTodosFromPerspective();
        });
      });
    });

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
