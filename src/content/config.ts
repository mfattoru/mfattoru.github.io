import { defineCollection, z } from 'astro:content';

const solutionSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  order: z.number(),
  image: z.string().optional(),
});

const newsSchema = z.object({
  title: z.string(),
  date: z.date(),
  description: z.string(),
  image: z.string().optional(),
});

export const collections = {
  'solutions-it': defineCollection({ type: 'content', schema: solutionSchema }),
  'solutions-en': defineCollection({ type: 'content', schema: solutionSchema }),
  'news-it': defineCollection({ type: 'content', schema: newsSchema }),
  'news-en': defineCollection({ type: 'content', schema: newsSchema }),
};
