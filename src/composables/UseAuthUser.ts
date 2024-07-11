import useSupabase from "@/composables/UseSupabase";
import type { User } from "@supabase/supabase-js";
import { computed, ref } from "vue";

// user is set outside of the useAuthUser function
// so that it will act as global state and always refer to a single user
const user = ref<null | User>(null);

export default function useAuthUser() {
  const { supabase } = useSupabase();

  const signIn = async (credentials: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) throw error;
    return data.user;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const isSignedIn = computed(() => !!user.value);
  const id = computed(() => user.value?.id);

  const register = async (credentials: {
    email: string;
    password: string;
    username: string;
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          username: credentials.username,
        },
      },
    });
    if (error) {
      throw error;
    } else {
      if (data?.user?.identities?.length === 0) {
        throw new Error("User with email already exists");
      }
    }
    return data.user;
  };

  /**
   * Update user email or password
   */
  const update = async (updates: {
    password?: string;
    email?: string;
    data?: Record<string, any>;
  }) => {
    const { data, error } = await supabase.auth.updateUser(updates);
    if (error) throw error;
    return data.user;
  };

  const sendPasswordRestEmail = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/password-reset?fromEmail=registrationConfirmation`,
    });
    if (error) throw error;
  };

  return {
    user,
    id,
    signIn,
    isSignedIn,
    signOut,
    register,
    update,
    sendPasswordRestEmail,
  };
}
