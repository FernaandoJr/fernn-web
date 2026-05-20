import type { auth } from '../auth.js';

export type SessionUser = (typeof auth.$Infer)['Session']['user'];
export type SessionSession = (typeof auth.$Infer)['Session']['session'];

export type AppVariables = {
  user: SessionUser | null;
  session: SessionSession | null;
};
