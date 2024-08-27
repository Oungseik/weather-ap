import { MongoClient } from "mongodb";

import { config } from "@/config.js";

const client = new MongoClient(config.mongoURL);
const db = client.db(config.db);

export async function setupMongodb() {
	await client.connect();
}

interface User {
	username: string;
	email: string;
	password: string;
	role: "ADMIN" | "USER";
}

export const User = db.collection<User>("users");
User.createIndex(["username", "email"]);
