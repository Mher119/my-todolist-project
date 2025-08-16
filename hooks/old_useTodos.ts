'use client';

import { useEffect, useState } from "react";

type Todo = {id: number, title: string, completed: boolean};

export default function useTodos(){
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        
        fetch('/api/todos')
        .then(res=> res.json())
        .then( (data: Todo[])=> {setTodos(data); setLoading(false)});

    }, []);

    const addTodo = async (title: string)=>{
        const res = await fetch('/api/todos', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({title})
        });

        const todo = await res.json();
        setTodos(prev => [todo, ...prev]);
    };
    
    const updateTodo = async(id:number, title: string)=>{
        const res = await fetch('/api/todos', {
            method:'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id, title})
        });
        const updated = await res.json();
        setTodos(prev => prev.map(t=> t.id === id ? updated : t));
    };

    const toggleTodo = async(id: number, completed: boolean)=>{
        const res = await fetch('/api/todos', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id, completed})
        });
        const updated = await res.json();
        setTodos(prev => prev.map(t=> t.id === id ? updated : t));
    };

   const deleteTodo = async (id: number) => {
    try {
        const res = await fetch('/api/todos', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id})
        });

        if (!res.ok) {
            throw new Error('Failed to delete todo');
        }

        setTodos(prev => prev.filter(t => t.id !== id));
    } catch (error) {
        console.error(error);
    }
};

    return {todos, loading, addTodo, updateTodo, toggleTodo, deleteTodo};
}