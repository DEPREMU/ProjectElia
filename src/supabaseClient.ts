import { createClient } from "@supabase/supabase-js";
import dotenv, { DotenvParseOutput } from "dotenv";

const env: DotenvParseOutput | undefined = dotenv.config().parsed;

if (!env) {
  throw new Error("Environment variables are not defined");
}

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

export { supabase };
