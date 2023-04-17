import React from 'react';
import { Todo } from '../types/Todo';

interface ResetAd4mButtonProps {
    clickHandler(): void;
}

function ResetAd4mButton({ clickHandler }: ResetAd4mButtonProps) {
    return <button onClick={clickHandler}>Reset AD4M</button>;
}

export default ResetAd4mButton;