import { Router } from 'https://deno.land/x/oak/mod.ts';
import { getDb } from "../helpers/db";
import { ObjectId } from "https://deno.land/x/mongo@v0.21.0/mod.ts";

const router = new Router();

interface Todo {
    id?: string;
    text: string;
}

type Data = {value: {text: string}}

let todos: Todo[] = [];

router.get('/todos', async (ctx) => {
    const todos = await getDb().collection('deno').find(); // {_id: ObjectId(), text: ..}
    const transformedTodos = todos.map(
        (todo: {_id: ObjectId, text: string}) => {
        return {id: todo._id.$oid, text: todo.text};
    });
    ctx.response.body = {todos: transformedTodos};
});

router.post('/todos', async (ctx) => {
    const data = await ctx.request.body()!;
    const newTodo: Todo = {
        text: data.value.text!,
    };


    const id = await getDb().collection('todos').insertOne(newTodo);

    newTodo.id = id.$oid;

    ctx.response.body = {message: 'Created todo!', todo: newTodo};
});

router.put('/todos/:todoId', async (ctx) => {
    const tid = ctx.params.todoId!;
    const data = await ctx.request.body();

    await getDb().collection('deno').updateOne({_id: ObjectId(tid)}, {$set: {
        text: data.value.text!
        }});

    ctx.response.body = {message: 'Updated todo'};
});

router.delete('/todos/:todoId', async(ctx) => {
    const tid = ctx.params.todoId;

    await getDb().collection('deno').deleteOne({_id: ObjectId(tid)});


    ctx.response.body = {message: 'Deleted todo'};
});

export default router;
