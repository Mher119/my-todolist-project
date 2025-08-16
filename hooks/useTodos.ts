'use client';

import { useEffect, useState, useTransition, useOptimistic } from "react";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export default function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await fetch('/api/todos');
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = (await res.json()) as Todo[];
        setTodos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const [optimizedTodos, applyOptimistic] = useOptimistic(
    todos,
    (prev, newTodo: Todo) => [newTodo, ...prev]
  );

  const addTodo = async (title: string) => {
    startTransition(async () => {
      const temp: Todo = { id: Date.now(), title, completed: false };
      applyOptimistic(temp);

      try {
        const res = await fetch('/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title }),
        });
        if (!res.ok) throw new Error(`Add failed: ${res.status}`);
        const newTodo = (await res.json()) as Todo;
        setTodos(prev => [newTodo, ...prev.filter(t => t.id !== temp.id)]);
      } catch (err) {
        console.error(err);
        setTodos(prev => prev.filter(t => t.id !== temp.id));
      }
    });
  };

  const updateTodo = (id: number, title: string) => {
    startTransition(async () => {
      try {
        const res = await fetch('/api/todos', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, title }),
        });
        if (!res.ok) throw new Error(`Update failed: ${res.status}`);
        const updated = (await res.json()) as Todo;
        setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
      } catch (err) {
        console.error(err);
      }
    });
  };

  const toggleTodo = (id: number, completed: boolean) => {
    startTransition(async () => {
      try {
        const todo = todos.find(t => t.id === id);
        if (!todo) {
          console.error('❌ Todo not found!');
          return;
        }

        const res = await fetch('/api/todos', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, completed, title: todo.title }), // պարտադիր title
        });
        if (!res.ok) throw new Error(`Toggle failed: ${res.status}`);
        const updated = (await res.json()) as Todo;
        setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
      } catch (err) {
        console.error(err);
      }
    });
  };

  const deleteTodo = (id: number) => {
    startTransition(async () => {
      try {
        const res = await fetch('/api/todos', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) throw new Error(`Delete failed ${res.status}`);
        setTodos(prev => prev.filter(t => t.id !== id));
      } catch (err) {
        console.error(err);
      }
    });
  };

  return {
    // todos,
    todos: optimizedTodos,
    isPending,
    loading,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
  };
}

















































