import fs from 'node:fs';
import path from 'node:path';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface InternalLinkItem {
  title: string;
  url: string;
  description: string;
}

export interface OfficialSourceItem {
  title: string;
  authority: string;
  url: string;
}

export interface H2Section {
  h2: string;
  h3?: string;
  content: string[]; // array of paragraphs or HTML-safe markdown strings
  checklist?: string[];
  table?: {
    headers: string[];
    rows: string[][];
  };
  callout?: {
    type: 'note' | 'warning' | 'tip';
    title: string;
    text: string;
  };
}

export interface ArticleData {
  id: string; // e.g. "KL-001"
  status: 'draft' | 'published';
  published: boolean;
  district: string;
  town?: string;
  category?: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  relatedKeywords: string[];
  searchIntent: string;
  intendedAudience: string;
  quickAnswer: string;
  h2Sections: H2Section[];
  faqs: FAQItem[];
  internalLinks: InternalLinkItem[];
  officialSources: OfficialSourceItem[];
  cta: {
    heading: string;
    description: string;
    buttonText: string;
    whatsappUrl: string;
  };
  imageConcept: {
    description: string;
    altText: string;
  };
  reviewFlags: string[];
  wordCount?: number;
  author?: string;
  datePublished?: string;
  dateModified?: string;
}

const BLOG_DIR = path.resolve('content/blog');

export function getAllArticles(): ArticleData[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR);
  const articles: ArticleData[] = [];

  for (const file of files) {
    if (file.startsWith('KL-') && file.endsWith('.json')) {
      try {
        const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
        const data = JSON.parse(raw) as ArticleData;
        articles.push(data);
      } catch (err) {
        console.error(`Error parsing article ${file}:`, err);
      }
    }
  }

  return articles.sort((a, b) => a.id.localeCompare(b.id));
}

export function getArticleBySlug(slug: string): ArticleData | undefined {
  const articles = getAllArticles();
  return articles.find(a => a.slug === slug);
}

export function getArticleById(id: string): ArticleData | undefined {
  const articles = getAllArticles();
  return articles.find(a => a.id === id);
}
