import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';

interface TodoListProps {
  data: Todo[];
  disabled: boolean;
  onTodoItemClick(text: string): void;
  onRemove(id: string): void;
}

function TodoList({ data, disabled, onTodoItemClick, onRemove }: TodoListProps) {

  return (
    <>
      <div>TodoList</div>
      <ul className={ disabled ? 'todo-list disabled' : 'todo-list' }>
        { data ?
          
          data.map((todo) => <TodoItem
            key={todo.id}
            clickHandler={onTodoItemClick}
            onRemove={onRemove}
            id={todo.id}
            text={todo.title}
            checked={todo.state} /> )
        
          : <div>No data</div>
        }
      </ul>
    </>
  )
}

export default TodoList;