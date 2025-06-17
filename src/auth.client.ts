import { createAuthClient } from "better-auth/solid";
import { genericOAuthClient } from "better-auth/client/plugins";

export const { signIn, signOut, useSession, ...client } = createAuthClient({
  plugins: [genericOAuthClient()],
});