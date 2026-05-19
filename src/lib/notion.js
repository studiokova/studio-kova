import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

function getDatabaseId() {
  return process.env.NODE_ENV === 'production'
    ? process.env.NOTION_DATABASE_ID
    : process.env.NOTION_DATABASE_ID_TEST;
}

export async function saveBrief({ nom, email, montant, sessionId, pieces, photosLink, style, budget }) {
  await notion.pages.create({
    parent: { database_id: getDatabaseId() },
    properties: {
      Nom: { title: [{ text: { content: nom || '' } }] },
      Email: { email: email || null },
      Montant: { number: montant || 0 },
      'Session ID': { rich_text: [{ text: { content: sessionId || '' } }] },
      Pièces: { rich_text: [{ text: { content: pieces || '' } }] },
      Photos: { rich_text: [{ text: { content: photosLink || '' } }] },
      Style: { rich_text: [{ text: { content: style || '' } }] },
      Budget: { rich_text: [{ text: { content: budget || '' } }] },
      Statut: { select: { name: 'Nouveau' } },
    },
  });
}
