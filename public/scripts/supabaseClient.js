import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
const env = dotenv.config().parsed;
if (!env) {
    throw new Error("Environment variables are not defined");
}
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
export { supabase };
