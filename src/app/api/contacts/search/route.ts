import { NextResponse } from 'next/server';
import { dummyContacts } from '@/data/contacts';
import { getVectorStore } from '@/lib/vectorStore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';

    if (!query) {
      // Return all without scores if no query
      const formatted = dummyContacts.map(c => ({ contact: c, score: 0 }));
      return NextResponse.json({ results: formatted });
    }

    const vectorStore = await getVectorStore();

    // ----------------------------------------------------------------------
    // PHASE 2: REAL VECTOR SEARCH (Executes if API Key is configured)
    // ----------------------------------------------------------------------
    if (vectorStore) {
      console.log(`Directory Search using Vector API for: "${query}"`);
      const results = await vectorStore.similaritySearchWithScore(query, 10);
      
      const formattedResults = results.map(([doc, score]) => ({
        contact: doc.metadata,
        score: score // Closer to 1.0 is better in our cosine similarity
      }));

      return NextResponse.json({ results: formattedResults });
    }

    // ----------------------------------------------------------------------
    // PHASE 1: FALLBACK MOCK MATCHING (Executes if no API Key is found)
    // ----------------------------------------------------------------------
    console.log("Directory Search using fallback keyword matcher...");
    const queryTerms = query.split(' ').filter(t => t.length > 0);

    const scoredContacts = dummyContacts.map(contact => {
      const searchableString = [
        contact.name,
        contact.nameSinhala,
        contact.nameTamil,
        contact.department,
        contact.location,
        contact.type,
        ...contact.keywords
      ].join(' ').toLowerCase();

      let matchCount = 0;
      queryTerms.forEach(term => {
        if (searchableString.includes(term)) {
          matchCount += 1;
        }
      });

      // Normalize mock score roughly between 0 and 1
      const score = matchCount > 0 ? matchCount / queryTerms.length : 0;
      return { contact, score };
    })
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score);

    return NextResponse.json({ results: scoredContacts.slice(0, 10) });

  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
