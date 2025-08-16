'use client';

import { useState } from "react";

type Props = {
  onAdd: (title:string)=>void;
  loading: boolean;
};

export default function NewTodo({onAdd, loading}: Props) {
  const [title, setTitle] = useState('');
  
  const submit = (e: React.FormEvent)=>{
    e.preventDefault();
    const t = title.trim();
    if(!t) return;
    onAdd(t);
    setTitle('');
  }
  
  return (
    <form onSubmit={submit} className=" flex">
      <input 
        className=" w-full outline-0 border-green-700 border-b-2 text-2xl text-gray-500"
        type="text" 
        placeholder="Add New Todo..." 
        value={title}
        onChange={e=> setTitle(e.target.value)}
      />
      <button className=" bg-green-600 text-white pt-2 pb-2 pl-4 pr-4 ml-2 cursor-pointer">
         {loading ? ' Adding...': 'Add'}
      </button>
    </form>
  )
}
