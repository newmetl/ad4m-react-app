import React, { useEffect, useState } from 'react';

import { LinkQuery, Ad4mClient, Link, LinkExpressionInput } from "@perspect3vism/ad4m";
import Ad4mConnectUI from '@perspect3vism/ad4m-connect';

import getOrCreateProject from './ad4m/create-project';
import { PERSPECTIVE_NAME, ensurePerspective } from './ad4m/perspectives';

import TodoList from './TodoList';
import CreateTodo from './CreateTodo';
import { Todo } from './Todo';

import './App.css';

import createTodo from './ad4m/create-todo';

const PROJECT_NAME = 'My todos project';
const PROJECT_ID = 'project://vypu5nacq';


function App() {

  const [ad4mClient, setAd4mClient] = useState<Ad4mClient | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState(false);

  const [todos, setTodos] = useState<Todo[]>([]);


  const loadTodosFromPerspective = () => {
    console.log('Loading todos from perspective');

    setIsLoadingState(true);

    if (!ad4mClient) {
      console.error('Cannot load todos. AD4M client not found.');
      return
    }

    ensurePerspective(ad4mClient).then((perspective) => {
      console.log('Perspective ensured.', perspective);
    });
    

    ad4mClient?.perspective.all().then((perspectives) => {
      const perspective = perspectives.find(p => p.name === PERSPECTIVE_NAME)
      if (!perspective) {
        console.log('Creating perspective');
        ad4mClient.perspective.add(PERSPECTIVE_NAME).then((result) => console.log(result));
      } else {
        console.log('Perspective found', perspective.name, perspective);
      }
      if (perspective) {
        perspective.get(new LinkQuery({ source: PROJECT_ID }))
          .then((queryResults) => {
            console.log('queryResults', queryResults);
            const queryTodos: { [key: string]: Todo } = {};
            const todoIds: string[] = [];

            queryResults.map((result) => {
              if (result.data.predicate == "project://has_todo") {
                const newTodo: Todo = { id: result.data.target };
                queryTodos[newTodo.id] = newTodo;
                todoIds.push(newTodo.id);
              }
            });

            todoIds.map((todoId) => {
              perspective.get(new LinkQuery({ source: todoId})).then((queryResults) => {
                // building a new todo
                const todo: Todo = { id: todoId };
                queryResults.map((result) => {
                  const attrName = result.data.predicate.substring(7);
                  if (attrName == "title")
                    todo.title = decodeURIComponent(result.data.target.substring(17));
                  if (attrName == "state") {
                    todo.state = result.data.target.substring(7) == 'true';
                  }
                  queryTodos[todo.id] = todo;
                });
                console.log('queryTodos', queryTodos);
                setTodos(Object.values(queryTodos));
                setIsLoadingState(false);
              });
            });
          })
      } else
        console.log('No perspective found');
    });
  }

  useEffect(() => {
    setIsConnecting(true);

    /*
     * Connect to AD4M
     */
    console.log('Connecting to AD4M');
    const ui = Ad4mConnectUI({
			appName: "AD4M React",
			appDesc: "AD4M - React Test App",
			appDomain: "dev.ad4m.react-test-app",
			capabilities: [{ with: { domain: "*", pointers: ["*"] }, can: ["*"] }],
			appIconPath: "https://i.ibb.co/GnqjPJP/icon.png",
		});
		
		/*
		* Display the UI, asking the user to approve and grant these capabilities.
		*/
		ui.connect().then((client: Ad4mClient) => {
                                                               
      // Find or create perspective
      client.perspective.all().then((perspectives) => {
        const perspective = perspectives.find(p => p.name === PERSPECTIVE_NAME)
        if (!perspective) {
          console.log('Creating new perspective for app');
          client.perspective.add(PERSPECTIVE_NAME).then((result) => console.log(result));
        } else {
          console.log('App perspective found', perspective.name, perspective);
        }
        
        if (perspective) {
          getOrCreateProject(perspective, PROJECT_NAME)
            // .then((projectId) => console.log('Project id:', projectId));

          // perspective.get(new LinkQuery({})).then((allLinks) => {
          //   allLinks.map((link) => {
          //     const data = link.data;
          //     console.log([data.source, data.predicate, data.target].join(' -> '));
          //   })
          // });

          perspective.get(new LinkQuery({ source: PROJECT_ID }))
            .then((queryResults) => {
              // get project name
              if (queryResults.length) {
                // console.log(queryResults[0].data.target);
                let projectName = queryResults[0].data.target;
                projectName = projectName.substring(17);
                // console.log('Project Name:', decodeURIComponent(projectName));
              }
            });
        }
                                                                                                                                   

        // const findProject = (projectId: string) => {
        //   // perspective?.links;
        // }
        
        // // Find or create project
        // const projectId = findProject(PROJECT_ID);
        
        
        setAd4mClient(client);
        setIsConnecting(false);
      });  
    });
    
    /* So, this function is not finished when LinkExpressionList gets rendered.                                                                           
    * This leads to getAd4mClient to fail cause connection is not ready.
    * There needs to be some mechanism to make sure, that the list does not get
     * rendered before connection is not ready.
     */

    // getAgentData();

	}, []);

  useEffect(() => {
    loadTodosFromPerspective();
  }, []);
  
  const onClickTodoItem = (todoId: string) => {
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
    console.log('creating new todo', text);
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
    setIsLoadingState(true);
    console.log('Removing todo:', todoId);
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
