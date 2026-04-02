import { defineCollection, z } from 'astro:content';

const siteSettingsSchema = z.object({
  cvFile: z.string(),
  theme: z.string().optional().default('steel'),
  email: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  phoneMobile: z.string().optional().default(''),
  address: z.string().optional().default(''),
  vatNumber: z.string().optional().default(''),
  hoursIt: z.string().optional().default(''),
  hoursEn: z.string().optional().default(''),
  linkedinUrl: z.string().optional().default(''),
  siteLanguage: z.enum(['both', 'it', 'en']).optional().default('both'),
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

const pageContentSchema = z.object({
  // About
  firmHeadingIt: z.string().optional().default(''),
  firmHeadingEn: z.string().optional().default(''),
  firmBodyIt: z.string().optional().default(''),
  firmBodyEn: z.string().optional().default(''),
  missionHeadingIt: z.string().optional().default(''),
  missionHeadingEn: z.string().optional().default(''),
  missionBodyIt: z.string().optional().default(''),
  missionBodyEn: z.string().optional().default(''),
  // Pricing
  introParagraphIt: z.string().optional().default(''),
  introParagraphEn: z.string().optional().default(''),
  complianceParagraphIt: z.string().optional().default(''),
  complianceParagraphEn: z.string().optional().default(''),
  // Stats
  stat1Value: z.string().optional().default(''),
  stat1LabelIt: z.string().optional().default(''),
  stat1LabelEn: z.string().optional().default(''),
  stat2Value: z.string().optional().default(''),
  stat2LabelIt: z.string().optional().default(''),
  stat2LabelEn: z.string().optional().default(''),
  stat3Value: z.string().optional().default(''),
  stat3LabelIt: z.string().optional().default(''),
  stat3LabelEn: z.string().optional().default(''),
  stat4Value: z.string().optional().default(''),
  stat4LabelIt: z.string().optional().default(''),
  stat4LabelEn: z.string().optional().default(''),
});

export const collections = {
  'solutions-it': defineCollection({ type: 'content', schema: solutionSchema }),
  'solutions-en': defineCollection({ type: 'content', schema: solutionSchema }),
  'solutions': defineCollection({ type: 'content', schema: solutionBilingualSchema }),
  'news': defineCollection({ type: 'content', schema: newsSchema }),
  'projects': defineCollection({ type: 'content', schema: projectSchema }),
  'site-settings': defineCollection({ type: 'content', schema: siteSettingsSchema }),
  'page-content': defineCollection({ type: 'content', schema: pageContentSchema }),
};
