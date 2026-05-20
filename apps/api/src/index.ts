import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { auth } from './auth.js';
import { env } from './constants/envs.js';
import authRoutes from './routes/auth.js';
import guildsRoutes from './routes/guilds.js';
import type { AppVariables } from './types/session.js';

const app = new Hono<{ Variables: AppVariables }>();

app.use('/*', cors({ origin: env.WEB_APP_ORIGIN, credentials: true }));

app.use('*', async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    c.set('user', null);
    c.set('session', null);
  } else {
    c.set('user', session.user);
    c.set('session', session.session);
  }
  await next();
});

app.route('/api/v1', authRoutes);
app.route('/api/v1', guildsRoutes);

app.get('/', (c) => c.text('OK'));

export default app;
