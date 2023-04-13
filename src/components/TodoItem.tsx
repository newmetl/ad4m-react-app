import React from 'react';
import { Todo } from '../types/Todo';

interface TodoItemProps {
    id: string;
    text: string | undefined;
    checked: boolean | undefined;
    clickHandler(text: string): void;
    onRemove(id: string): void;
}

function TodoItem({ id, text, checked, clickHandler, onRemove }: TodoItemProps) {

    const onClickHandler = () => clickHandler(id);
    const onRemoveHandler = () => onRemove(id);

    return <li>
        <span
            className={checked ? "TodoItem checked" : "TodoItem"}
            onClick={onClickHandler}>{text}</span>
        <span className={'remove-button'} onClick={onRemoveHandler}>(Remove)</span>
    </li>;
}

export default TodoItem;