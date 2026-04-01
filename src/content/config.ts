import { defineCollection, z } from 'astro:content';

const siteSettingsSchema = z.object({
  cvFile: z.string(),
  theme: z.string().optional().default('steel'),
});

const solutionSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  order: z.number(),
  image: z.string().optional(),
});

const solutionBilingualSchema = z.object({
  titleIt: z.string(),
  titleEn: z.string().optional().default(''),
  descriptionIt: z.string(),
  descriptionEn: z.string().optional().default(''),
  bodyEn: z.string().optional().default(''),
  icon: z.string(),
  order: z.number(),
  image: z.string().optional(),
});

const newsSchema = z.object({
  titleIt: z.string(),
  titleEn: z.string().optional().default(''),
  date: z.string().or(z.date()),
  descriptionIt: z.string(),
  descriptionEn: z.string().optional().default(''),
  bodyEn: z.string().optional().default(''),
  image: z.string().optional(),
});

const projectSchema = z.object({
  titleIt: z.string(),
  titleEn: z.string(),
  locationIt: z.string(),
  locationEn: z.string(),
  year: z.string(),
  roleIt: z.string(),
  roleEn: z.string(),
  statusIt: z.string(),
  statusEn: z.string(),
  categoryIt: z.string(),
  categoryEn: z.string(),
  summaryIt: z.string(),
  summaryEn: z.string(),
  resultIt: z.string(),
  resultEn: z.string(),
  thumbnail: z.string(),
  gallery: z.array(z.union([z.string(), z.array(z.string())])).transform(a => a.flat()),
});

export const collections = {
  'solutions-it': defineCollection({ type: 'content', schema: solutionSchema }),
  'solutions-en': defineCollection({ type: 'content', schema: solutionSchema }),
  'solutions': defineCollection({ type: 'content', schema: solutionBilingualSchema }),
  'news': defineCollection({ type: 'content', schema: newsSchema }),
  'projects': defineCollection({ type: 'content', schema: projectSchema }),
  'site-settings': defineCollection({ type: 'content', schema: siteSettingsSchema }),
};
