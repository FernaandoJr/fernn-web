import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { createAuthMiddleware } from 'better-auth/api';
import { bearer } from 'better-auth/plugins';
import { ObjectId } from 'mongodb';
import { env } from './constants/envs.js';
import { client, db } from './db/mongo.js';

type DiscordProfile = {
  id: string;
  username: string;
  avatar?: string | null;
};

export const auth = betterAuth({
  basePath: '/api/v1/auth',
  baseURL: env.API_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, { client }),
  emailAndPassword: { enabled: true },
  trustedOrigins: [env.WEB_APP_ORIGIN],
  user: {
    additionalFields: {
      discordId: {
        type: 'string',
        required: false,
        input: false,
      },
      discordUsername: {
        type: 'string',
        required: false,
        input: false,
      },
      discordAvatar: {
        type: 'string',
        required: false,
        input: false,
      },
      signUpProvider: {
        type: 'string',
        required: false,
        input: false,
      },
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const newSession = ctx.context.newSession;
      if (!newSession?.user?.id) return;

      const userId = new ObjectId(newSession.user.id);
      const user = newSession.user as { signUpProvider?: string | null };

      if (user.signUpProvider == null || user.signUpProvider === '') {
        const account = await db
          .collection('account')
          .findOne(
            { userId },
            { sort: { createdAt: 1 }, projection: { providerId: 1 } },
          );

        if (account?.providerId) {
          await db
            .collection('user')
            .updateOne(
              { _id: userId },
              { $set: { signUpProvider: account.providerId } },
            );
        }
      }

      const discordAccount = await db.collection('account').findOne({
        userId,
        providerId: 'discord',
      });

      if (!discordAccount) return;

      const profile = discordAccount as {
        accountId?: string;
        providerUserId?: string;
      };

      const discordId = profile.providerUserId ?? profile.accountId;
      if (!discordId) return;

      const discordUser = await fetch(
        `https://discord.com/api/v10/users/${discordId}`,
        {
          headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` },
        },
      )
        .then((r) => (r.ok ? (r.json() as Promise<DiscordProfile>) : null))
        .catch(() => null);

      await db.collection('user').updateOne(
        { _id: userId },
        {
          $set: {
            discordId,
            discordUsername: discordUser?.username ?? undefined,
            discordAvatar: discordUser?.avatar ?? undefined,
          },
        },
      );
    }),
  },
  socialProviders: {
    discord: {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      scope: ['identify', 'guilds'],
      mapProfileToUser: (profile) => ({
        discordId: profile.id,
        discordUsername: profile.username,
        discordAvatar: profile.avatar ?? undefined,
        name: profile.global_name ?? profile.username,
        image: profile.avatar
          ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
          : undefined,
      }),
    },
  },
  plugins: [bearer()],
});
