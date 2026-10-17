import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { dummyContacts, Contact } from "@/data/contacts";

export interface VectorDocument {
  pageContent: string;
  metadata: Contact;
  embedding?: number[];
}

export class SimpleVectorStore {
  documents: VectorDocument[] = [];
  embeddings: GoogleGenerativeAIEmbeddings;

  constructor(embeddings: GoogleGenerativeAIEmbeddings) {
    this.embeddings = embeddings;
  }

  async addDocuments(docs: { pageContent: string; metadata: Contact }[]) {
    const contents = docs.map(d => d.pageContent);
    const vectors = await this.embeddings.embedDocuments(contents);
    this.documents = docs.map((doc, i) => ({
      ...doc,
      embedding: vectors[i]
    }));
  }

  async similaritySearchWithScore(query: string, k: number = 1): Promise<[VectorDocument, number][]> {
    const queryVector = await this.embeddings.embedQuery(query);
    
    const scored = this.documents.map(doc => {
      if (!doc.embedding) return { doc, similarity: 0 };
      let dotProduct = 0;
      let normA = 0;
      let normB = 0;
      for (let i = 0; i < queryVector.length; i++) {
        dotProduct += queryVector[i] * doc.embedding[i];
        normA += queryVector[i] * queryVector[i];
        normB += doc.embedding[i] * doc.embedding[i];
      }
      const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
      return { doc, similarity };
    });

    scored.sort((a, b) => b.similarity - a.similarity);
    
    return scored.slice(0, k).map(s => [s.doc, s.similarity]);
  }
}

// Global cache for development to prevent re-embedding on every API call
let vectorStoreCache: SimpleVectorStore | null = null;

export async function getVectorStore(): Promise<SimpleVectorStore | null> {
  // Check if Google key is configured
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes("your-gemini-key") || apiKey.includes("INSERT_YOUR")) {
    console.log("No valid GOOGLE_API_KEY found. Falling back to mock data.");
    return null;
  }

  // Return cached instance if available
  if (vectorStoreCache) {
    return vectorStoreCache;
  }

  try {
    const embeddings = new GoogleGenerativeAIEmbeddings({
      modelName: "gemini-embedding-2", // Standard Gemini embedding model
    });
    
    // Format contacts into searchable string documents
    const documents = dummyContacts.map(contact => {
      const pageContent = `
        Entity Name: ${contact.name}
        Sinhala Name: ${contact.nameSinhala || ''}
        Tamil Name: ${contact.nameTamil || ''}
        Department: ${contact.department}
        Type: ${contact.type}
        Location: ${contact.location}
        Keywords: ${contact.keywords.join(', ')}
      `;

      return {
        pageContent,
        metadata: { ...contact }
      };
    });

    console.log("Initializing in-memory Vector Store with Gemini Embeddings...");
    const store = new SimpleVectorStore(embeddings);
    await store.addDocuments(documents);
    vectorStoreCache = store;
    console.log("Vector Store successfully initialized!");
    
    return vectorStoreCache;
  } catch (error) {
    console.error("Failed to initialize Vector Store:", error);
    return null;
  }
}
