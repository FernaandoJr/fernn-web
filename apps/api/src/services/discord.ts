import { ObjectId } from 'mongodb';
import { env } from '../constants/envs.js';
import { ACCOUNT_COLLECTION } from '../db/collections.js';
import { db } from '../db/mongo.js';

const DISCORD_API = 'https://discord.com/api/v10';
const MANAGE_GUILD = 0x20n;
const ADMINISTRATOR = 0x8n;

export type DiscordGuildSummary = {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
};

export type DiscordMessage = {
  id: string;
  channel_id: string;
  timestamp: string;
  embeds: DiscordEmbed[];
  author?: { bot?: boolean; id?: string };
};

export type DiscordEmbed = {
  title?: string;
  description?: string;
  color?: number;
  timestamp?: string;
  fields?: { name: string; value: string; inline?: boolean }[];
};

async function discordFetch<T>(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${DISCORD_API}${path}`, {
    ...init,
    headers: {
      Authorization: token.startsWith('Bot ') ? token : `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(
      `Discord API ${path} failed (${res.status}): ${body.slice(0, 200)}`,
    );
  }

  return res.json() as Promise<T>;
}

export function canManageGuild(permissions: string): boolean {
  const perms = BigInt(permissions);
  return (perms & ADMINISTRATOR) !== 0n || (perms & MANAGE_GUILD) !== 0n;
}

export async function getDiscordAccessToken(
  userId: string,
): Promise<string | null> {
  const account = await db.collection(ACCOUNT_COLLECTION).findOne({
    userId: new ObjectId(userId),
    providerId: 'discord',
  });

  const token = account?.accessToken;
  return typeof token === 'string' && token.length > 0 ? token : null;
}

export async function fetchUserGuilds(
  accessToken: string,
): Promise<DiscordGuildSummary[]> {
  return discordFetch<DiscordGuildSummary[]>(
    '/users/@me/guilds',
    accessToken,
  );
}

export async function fetchBotGuilds(): Promise<DiscordGuildSummary[]> {
  return discordFetch<DiscordGuildSummary[]>(
    '/users/@me/guilds',
    `Bot ${env.DISCORD_BOT_TOKEN}`,
  );
}

export async function assertUserManagesGuild(
  userId: string,
  guildId: string,
  accessToken?: string,
): Promise<void> {
  const token = accessToken ?? (await getDiscordAccessToken(userId));
  if (!token) {
    throw new Error('DISCORD_NOT_LINKED');
  }

  const guilds = await fetchUserGuilds(token);
  const guild = guilds.find((g) => g.id === guildId);
  if (!guild || !canManageGuild(guild.permissions)) {
    throw new Error('FORBIDDEN_GUILD');
  }

  const botGuilds = await fetchBotGuilds();
  if (!botGuilds.some((g) => g.id === guildId)) {
    throw new Error('BOT_NOT_IN_GUILD');
  }
}

export async function fetchChannelMessages(
  channelId: string,
  options: { before?: string; limit?: number },
): Promise<DiscordMessage[]> {
  const params = new URLSearchParams();
  if (options.before) params.set('before', options.before);
  params.set('limit', String(options.limit ?? 50));

  return discordFetch<DiscordMessage[]>(
    `/channels/${channelId}/messages?${params}`,
    `Bot ${env.DISCORD_BOT_TOKEN}`,
  );
}

export function guildIconUrl(
  guildId: string,
  icon: string | null,
): string | null {
  if (!icon) return null;
  const ext = icon.startsWith('a_') ? 'gif' : 'png';
  return `https://cdn.discordapp.com/icons/${guildId}/${icon}.${ext}`;
}

export type DiscordChannel = {
  id: string;
  name: string;
  type: number;
};

export type GuildChannelKind = 'text' | 'voice';

export async function fetchGuildChannels(
  guildId: string,
  kind: GuildChannelKind,
): Promise<DiscordChannel[]> {
  // Guild channel list requires a bot token; user OAuth (guilds scope) cannot call this route.
  const channels = await discordFetch<DiscordChannel[]>(
    `/guilds/${guildId}/channels`,
    `Bot ${env.DISCORD_BOT_TOKEN}`,
  );
  if (kind === 'voice') {
    return channels.filter((c) => c.type === 2);
  }
  return channels.filter((c) => c.type === 0 || c.type === 5);
}
