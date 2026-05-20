import { db } from './mongo.js';

export async function upsertByGuildId(
  collectionName: string,
  guildId: string,
  update: Record<string, unknown>,
): Promise<void> {
  const existing = await db.collection(collectionName).findOne({ guildId });

  if (!existing) {
    await db.collection(collectionName).insertOne({
      ...update,
      guildId,
      createdAt: new Date(),
    });
    return;
  }

  await db
    .collection(collectionName)
    .updateOne({ guildId }, { $set: update });
}
