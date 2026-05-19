const DEFAULT_DISCORD_INVITE_URL =
  "https://discord.com/oauth2/authorize?client_id=1490027184947986472&permissions=8&integration_type=0&scope=bot"

export function getDiscordInviteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL?.trim()
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_DISCORD_INVITE_URL
}

export const FERNN_GITHUB_REPO_URL = "https://github.com/FernaandoJr/fernn" as const
