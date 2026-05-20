import { Hono } from 'hono';
import { auth } from '../auth.js';
import { env } from '../constants/envs.js';
import type { AppVariables } from '../types/session.js';

const authRoutes = new Hono<{ Variables: AppVariables }>()
  .get('/auth/oauth-redirect', async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    const origin = env.WEB_APP_ORIGIN.replace(/\/$/, '');
    const token = session?.session?.token ?? session?.session?.id;
    if (!token) {
      return c.redirect(`${origin}/auth?error=session`);
    }
    return c.redirect(`${origin}/auth/callback#token=${encodeURIComponent(token)}`);
  })
  .on(['POST', 'GET'], '/auth/*', (c) => auth.handler(c.req.raw))
  .get('/me', (c) => {
    const user = c.get('user');
    const session = c.get('session');
    if (!user) return c.json({ error: 'Unauthorized' }, 401);
    return c.json({ user, session });
  });

export default authRoutes;
