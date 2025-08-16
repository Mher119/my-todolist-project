import { NextResponse } from "next/server";
import {prisma} from '../../../lib/prisma';


export async function GET(){
    try{    
        const todos = await prisma.todo.findMany({orderBy: {createdAt: 'desc'}});
        return NextResponse.json(todos, {status: 200});
    }catch(err){
        console.error('❌ Prisma GET error:', err);
        
        return NextResponse.json(
            {error: 'Failed to fetch todos'},
            {status: 500}
        )
    }
}

export async function POST(request: Request){
    const {title} = await request.json();
    try{
        const todo = await prisma.todo.create({data: {title}});
        return NextResponse.json(todo, {status: 201});
        }catch(err){
            return NextResponse.json(
                {error: 'Failed to create todo', err},
                {status: 500}
         )
     }
}  

export async function PUT(request: Request){
    const {id, title, completed} = await request.json();
    try{
        const updated = await prisma.todo.update({ where:{id}, data: {title, completed} })
        return NextResponse.json(updated, {status: 200});
    }catch(err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
}

}

export async function DELETE(request: Request){
    const {id} = await request.json();
    try{
        await prisma.todo.delete({where: {id}});
        return NextResponse.json({message: 'Todo deleted'}, {status: 200});
    }catch(err){
        return NextResponse.json(
            {'error': 'Failed to delete todo', err},
            {status: 500}
        );
    }
}