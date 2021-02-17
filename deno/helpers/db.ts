import { MongoClient, Database } from "https://deno.land/x/mongo@v0.21.0/mod.ts";

let db: Database

export function connect() {
    const client = new MongoClient();
    await client.connect("mongodb://localhost:27017");

    db = client.database("deno");
}

export function getDb() {
    return db;
}
