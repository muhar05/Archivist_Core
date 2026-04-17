import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  const isInvalid = (val: string | undefined) => 
    !val || val === "undefined" || val === "null" || val.trim() === "";

  if (isInvalid(supabaseUrl) || isInvalid(supabaseKey)) {
    // During build/prerender, these might be missing or set as "undefined" strings.
    return createBrowserClient(
      "https://placeholder.supabase.co",
      "placeholder-key"
    );
  }

  return createBrowserClient(supabaseUrl!, supabaseKey!);
};