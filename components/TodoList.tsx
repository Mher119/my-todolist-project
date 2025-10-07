'use client';

import { useEffect, useRef, useState } from "react";

type Todo = {
    id: number;
    title: string;
    completed: boolean;
};

type Props = {
    todos: Todo[];
    loading: boolean;
    onEdit: (id: number, text: string) => void;
    onToggle: (id: number, completed: boolean) => void;
    onDelete: (id: number) => void;
    
}

export default function TodoList({todos, loading, onEdit, onToggle, onDelete}: Props) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(()=> {

        if(editingId !== null && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingId]);

    if(loading) return <p>Loading...</p>

    const startEditing = (todo: Todo) => {
        setEditingId(todo.id);
        setEditValue(todo.title);
    }

    const finishEditing = (id: number) =>{
        if(editValue.trim()) {
            onEdit(id, editValue);
        }
        setEditingId(null);
    }



    
  return (
    <ul className="">
      {todos.map((todo) => <li key={todo.id} className=" border-gray-500 border-2 p-4 m-2 text-xl flex justify-between items-center">
          <div>
            {editingId === todo.id ? <>
              
              <input 
                  className=" outline-0 border-2 border-gray-400"
                  ref={inputRef}
                  type="text" 
                  value={editValue}
                  onChange={(e)=> setEditValue(e.target.value)}
                  onBlur={()=> finishEditing(todo.id)}
                  onKeyDown={e=>{
                    if(e.key === 'Enter') finishEditing(todo.id);
                    if(e.key === 'Escape') setEditingId(null);
                  }}
              />
              
            </> : <>
                <input type="checkbox" checked={todo.completed} onChange={()=> onToggle(todo.id, !todo.completed)} />
                <span 
                  onDoubleClick={()=> startEditing(todo)}
                  className={todo.completed ? 'line-through text-gray-500 cursor-pointer' : 'cursor-pointer'}
                >
                    {todo.title}
                </span>
            
            </>}
          </div>
          <div className=" text-red-500">
                  <button onClick={()=> onDelete(todo.id)}>Delete</button>
          </div>
      </li>
      )}
    </ul>
  )
}

