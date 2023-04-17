import { useEffect, useState } from 'react';

import { getAd4mClient } from '@perspect3vism/ad4m-connect';

import { connectToAd4m, ensurePerspectiveAndProject } from './ad4m/setup';
import { deleteTodo, fetchTodos, updateTodo, createTodo } from './ad4m/todos';
import { resetAd4m } from './ad4m/reset';

import { PROJECT_ID } from './constants';
import { Todo } from './types/Todo';

import TodoList from './components/TodoList';
import CreateTodo from './components/CreateTodo';
import ResetAd4mButton from './components/ResetAd4mButton';

import './App.css';
import { PerspectiveProxy } from '@perspect3vism/ad4m';

function usingAd4m(): Promise<PerspectiveProxy> {
  return getAd4mClient().then((client) => ensurePerspectiveAndProject(client));
}

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);

  const loadTodosFromPerspective = () => {
    setIsLoadingState(true);

    usingAd4m().then((perspective) => {
      fetchTodos(perspective, PROJECT_ID)
      .then((todos) => {
        setTodos(todos);
        setIsLoadingState(false);
      });
    });
  }

  // Initial side effect. Connect to AD4M, ensure perspective and project, load todos from ad4m.
  useEffect(() => {
    if (!isConnected) {
      connectToAd4m().then((client) => {
        ensurePerspectiveAndProject(client).then(() => {
          loadTodosFromPerspective();
        });
        setIsConnected(true);
      });
    }

	}, []);

  const handleClickTodoItem = (todoId: string) => {
    setIsLoadingState(true);

    usingAd4m().then((perspective) => {
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
  }

  const handleCreateNewTodo = (text: string) => {
    setIsLoadingState(true);

    usingAd4m().then((perspective) => {
      createTodo(perspective, PROJECT_ID, text, false).then(() => {
        loadTodosFromPerspective();
      });
    });
  }

  const handleRemoveTodo = (todoId: string) => {
    setIsLoadingState(true);

    const todo: Todo | undefined = todos.find((item) => item.id === todoId);

    if (todo) {
      usingAd4m().then((perspective) => {
        deleteTodo(perspective, PROJECT_ID, todo).then(() => {
          loadTodosFromPerspective();
        });
      });
    } else {
      console.error('Delete failed. Cannot find todo with id:', todoId);
    }

  }

  const onResetButton = () => {
    getAd4mClient()
      .then((client) => resetAd4m(client))
      .then(() => {
        window.alert('AD4M was reset. Reloading now.');
        window.location.reload();
      });
  }

  return (
    <div className="App">
      <header className="App-header">
        <TodoList
          disabled={isLoadingState}
          onTodoItemClick={handleClickTodoItem}
          onRemove={handleRemoveTodo}
          data={todos} />
        <CreateTodo onSubmit={handleCreateNewTodo} />
        <ResetAd4mButton clickHandler={onResetButton} />
      </header>
    </div>
  );
}

export default App;
