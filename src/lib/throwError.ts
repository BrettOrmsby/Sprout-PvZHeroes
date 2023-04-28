import app from "@/main";
import type { PostgrestError } from "@supabase/supabase-js";

export default function throwError(error: PostgrestError) {
  app.config.globalProperties.$toast.add({
    severity: "error",
    summary: error.message,
    detail: error.hint,
    life: 3000,
  });
}
