'use client';
import NewTodo from "@/components/NewTodo";
import TodoList from "@/components/TodoList";
import useTodos from "@/hooks/useTodos";


export default function TodoApp() {

    const {todos, isPending, loading, addTodo, updateTodo, toggleTodo, deleteTodo}  = useTodos();

  return (
    <div className="TodoApp mx-auto w-[600px] mt-10 p-4 rounded-xl bg-white">
        <NewTodo onAdd={addTodo} loading={isPending} />
        <TodoList 
            todos={todos} 
            loading={loading} 
            onEdit={updateTodo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}  
      />      
    </div>
  )
}
