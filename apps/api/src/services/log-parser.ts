import type { LogCategory, LogEntry } from '@fernn/domains/server-log';
import type { DiscordEmbed, DiscordMessage } from './discord.js';

/** Fernn log embeds use `colors.info` from the bot (`0x121f4e`). */
export const FERNN_LOG_EMBED_COLOR = 0x121f4e;

const CATEGORY_RULES: { category: LogCategory; patterns: RegExp[] }[] = [
  {
    category: 'voice',
    patterns: [
      /^Voice\s*[—–-]/i,
      /^Voz\s*[—–-]/i,
      /joined.*channel|left.*channel|moved from/i,
    ],
  },
  {
    category: 'members',
    patterns: [
      /^Member joined$/i,
      /^Member left$/i,
      /^Member updated$/i,
      /^Miembro\b/i,
      /^Membro\b/i,
      /joined the server|left the server/i,
    ],
  },
  {
    category: 'moderation',
    patterns: [
      /^Member kicked$/i,
      /^Member banned$/i,
      /^Ban removed$/i,
      /^Timeout updated$/i,
      /was kicked by|was banned by|was unbanned by|timeout until/i,
    ],
  },
  {
    category: 'messages',
    patterns: [
      /^Message deleted$/i,
      /^Messages bulk deleted$/i,
      /message\(s\) removed/i,
      /Message ID:/i,
    ],
  },
];

export function inferLogCategory(title: string): LogCategory | null {
  const trimmed = title.trim();
  for (const rule of CATEGORY_RULES) {
    if (rule.patterns.some((p) => p.test(trimmed))) {
      return rule.category;
    }
  }
  return null;
}

function isFernnLogEmbed(embed: DiscordEmbed): boolean {
  if (embed.color === FERNN_LOG_EMBED_COLOR) return true;
  if (!embed.title) return false;
  return inferLogCategory(embed.title) !== null;
}

export function parseMessageToLogEntries(
  message: DiscordMessage,
  guildId: string,
): LogEntry[] {
  const entries: LogEntry[] = [];

  for (const embed of message.embeds) {
    if (!isFernnLogEmbed(embed) || !embed.title) continue;

    const category = inferLogCategory(embed.title);
    if (!category) continue;

    entries.push({
      id: `${message.id}:${embed.title}`,
      messageId: message.id,
      guildId,
      channelId: message.channel_id,
      category,
      title: embed.title,
      description: embed.description,
      color: embed.color,
      timestamp: embed.timestamp ?? message.timestamp,
    });
  }

  return entries;
}

export function matchesLogQuery(entry: LogEntry, q: string): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [entry.title, entry.description ?? '']
    .join(' ')
    .toLowerCase();
  return haystack.includes(needle);
}
