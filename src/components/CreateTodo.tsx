import { useState, KeyboardEvent, ChangeEvent } from 'react';

interface CreateTodoProps {
  onSubmit(text: string): void;
}

function TodoItem({ onSubmit }: CreateTodoProps) {
  const [text, setText] = useState('');

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSubmit(text);
      setText('');
    }
  }

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  }

  return (
    <input type='text' value={text} onChange={handleOnChange} onKeyDown={handleKeyDown} />
  );
}

export default TodoItem;