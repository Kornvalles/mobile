export const ENV = {
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL!,
  SUPABASE_ANON: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  ORG_ID: process.env.EXPO_PUBLIC_ORG_ID || "", // set after sign-in in real app
};
