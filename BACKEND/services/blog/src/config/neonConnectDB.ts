import { neon } from "@neondatabase/serverless";

//npm i @neondatabase/serverless


const sql = neon(process.env.DB_URL as string);
export default sql;
