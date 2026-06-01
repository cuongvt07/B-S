export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorName: string;
  categoryTag: string;
  tags: string[];
  readingMinutes: number;
  publishedAt: string;
  updatedAt: string;
}
