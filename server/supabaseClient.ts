import * as supabase from "@supabase/supabase-js";
import dotenv from "dotenv";

/**
 * The `env` constant holds the parsed environment variables from the `.env` file.
 * It uses the `dotenv` library to load the environment variables and parse them into an object.
 * If the `.env` file is not found or cannot be parsed, `env` will be `undefined`.
 *
 * @type {dotenv.DotenvParseOutput | undefined}
 */
const env: dotenv.DotenvParseOutput | undefined = dotenv.config().parsed;

if (!env) {
  throw new Error("Environment variables are not defined"); // This error will be thrown if the `.env` file is not found or cannot be parsed.
}

/**
 * The `supabase` constant is an instance of the Supabase client.
 * It is created using the `createClient` function from the `@supabase/supabase-js` library.
 * The Supabase client is configured with the URL and key from the environment variables.
 *
 * @type {supabase.SupabaseClient<any, "public", any>}
 * @throws {Error} Throws an error if the environment variables are not defined.
 */
const supabaseClient: supabase.SupabaseClient<any, "public", any> =
  supabase.createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

export { supabaseClient as supabase };
