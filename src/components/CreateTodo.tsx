import React, { useState, FormEvent, KeyboardEvent, ChangeEvent } from 'react';
import { Todo } from '../types/Todo';

interface CreateTodoProps {
    onSubmit(text: string): void;
}

function TodoItem({ onSubmit }: CreateTodoProps) {
    const [text, setText] = useState('');
    const onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(event.currentTarget.value);
    }

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