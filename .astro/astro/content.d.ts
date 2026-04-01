declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"news": {
"benvenuto.md": {
	id: "benvenuto.md";
  slug: "benvenuto";
  body: string;
  collection: "news";
  data: InferEntrySchema<"news">
} & { render(): Render[".md"] };
};
"news-en": {
"welcome.md": {
	id: "welcome.md";
  slug: "welcome";
  body: string;
  collection: "news-en";
  data: any
} & { render(): Render[".md"] };
};
"news-it": {
"benvenuto.md": {
	id: "benvenuto.md";
  slug: "benvenuto";
  body: string;
  collection: "news-it";
  data: any
} & { render(): Render[".md"] };
};
"page-content": {
"about.md": {
	id: "about.md";
  slug: "about";
  body: string;
  collection: "page-content";
  data: InferEntrySchema<"page-content">
} & { render(): Render[".md"] };
"homepage.md": {
	id: "homepage.md";
  slug: "homepage";
  body: string;
  collection: "page-content";
  data: InferEntrySchema<"page-content">
} & { render(): Render[".md"] };
"pricing.md": {
	id: "pricing.md";
  slug: "pricing";
  body: string;
  collection: "page-content";
  data: InferEntrySchema<"page-content">
} & { render(): Render[".md"] };
};
"projects": {
"campo-sportivo.md": {
	id: "campo-sportivo.md";
  slug: "campo-sportivo";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
"ristrutturazione-stradale.md": {
	id: "ristrutturazione-stradale.md";
  slug: "ristrutturazione-stradale";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
};
"site-settings": {
"general.md": {
	id: "general.md";
  slug: "general";
  body: string;
  collection: "site-settings";
  data: InferEntrySchema<"site-settings">
} & { render(): Render[".md"] };
};
"solutions": {
"acustica-edilizia.md": {
	id: "acustica-edilizia.md";
  slug: "acustica-edilizia";
  body: string;
  collection: "solutions";
  data: InferEntrySchema<"solutions">
} & { render(): Render[".md"] };
"direzione-lavori.md": {
	id: "direzione-lavori.md";
  slug: "direzione-lavori";
  body: string;
  collection: "solutions";
  data: InferEntrySchema<"solutions">
} & { render(): Render[".md"] };
"edilizia.md": {
	id: "edilizia.md";
  slug: "edilizia";
  body: string;
  collection: "solutions";
  data: InferEntrySchema<"solutions">
} & { render(): Render[".md"] };
"estimo-immobiliare.md": {
	id: "estimo-immobiliare.md";
  slug: "estimo-immobiliare";
  body: string;
  collection: "solutions";
  data: InferEntrySchema<"solutions">
} & { render(): Render[".md"] };
"formazione-sicurezza.md": {
	id: "formazione-sicurezza.md";
  slug: "formazione-sicurezza";
  body: string;
  collection: "solutions";
  data: InferEntrySchema<"solutions">
} & { render(): Render[".md"] };
"progettazione-architettonica.md": {
	id: "progettazione-architettonica.md";
  slug: "progettazione-architettonica";
  body: string;
  collection: "solutions";
  data: InferEntrySchema<"solutions">
} & { render(): Render[".md"] };
"sicurezza-sul-lavoro.md": {
	id: "sicurezza-sul-lavoro.md";
  slug: "sicurezza-sul-lavoro";
  body: string;
  collection: "solutions";
  data: InferEntrySchema<"solutions">
} & { render(): Render[".md"] };
"sostenibilita-energetica.md": {
	id: "sostenibilita-energetica.md";
  slug: "sostenibilita-energetica";
  body: string;
  collection: "solutions";
  data: InferEntrySchema<"solutions">
} & { render(): Render[".md"] };
"superbonus-110.md": {
	id: "superbonus-110.md";
  slug: "superbonus-110";
  body: string;
  collection: "solutions";
  data: InferEntrySchema<"solutions">
} & { render(): Render[".md"] };
};
"solutions-en": {
"acoustic-engineering.md": {
	id: "acoustic-engineering.md";
  slug: "acoustic-engineering";
  body: string;
  collection: "solutions-en";
  data: InferEntrySchema<"solutions-en">
} & { render(): Render[".md"] };
"architectural-design.md": {
	id: "architectural-design.md";
  slug: "architectural-design";
  body: string;
  collection: "solutions-en";
  data: InferEntrySchema<"solutions-en">
} & { render(): Render[".md"] };
"construction-management.md": {
	id: "construction-management.md";
  slug: "construction-management";
  body: string;
  collection: "solutions-en";
  data: InferEntrySchema<"solutions-en">
} & { render(): Render[".md"] };
"construction.md": {
	id: "construction.md";
  slug: "construction";
  body: string;
  collection: "solutions-en";
  data: InferEntrySchema<"solutions-en">
} & { render(): Render[".md"] };
"real-estate-appraisal.md": {
	id: "real-estate-appraisal.md";
  slug: "real-estate-appraisal";
  body: string;
  collection: "solutions-en";
  data: InferEntrySchema<"solutions-en">
} & { render(): Render[".md"] };
"safety-training.md": {
	id: "safety-training.md";
  slug: "safety-training";
  body: string;
  collection: "solutions-en";
  data: InferEntrySchema<"solutions-en">
} & { render(): Render[".md"] };
"superbonus-110.md": {
	id: "superbonus-110.md";
  slug: "superbonus-110";
  body: string;
  collection: "solutions-en";
  data: InferEntrySchema<"solutions-en">
} & { render(): Render[".md"] };
"sustainability-energy.md": {
	id: "sustainability-energy.md";
  slug: "sustainability-energy";
  body: string;
  collection: "solutions-en";
  data: InferEntrySchema<"solutions-en">
} & { render(): Render[".md"] };
"workplace-safety.md": {
	id: "workplace-safety.md";
  slug: "workplace-safety";
  body: string;
  collection: "solutions-en";
  data: InferEntrySchema<"solutions-en">
} & { render(): Render[".md"] };
};
"solutions-it": {
"acustica-edilizia.md": {
	id: "acustica-edilizia.md";
  slug: "acustica-edilizia";
  body: string;
  collection: "solutions-it";
  data: InferEntrySchema<"solutions-it">
} & { render(): Render[".md"] };
"direzione-lavori.md": {
	id: "direzione-lavori.md";
  slug: "direzione-lavori";
  body: string;
  collection: "solutions-it";
  data: InferEntrySchema<"solutions-it">
} & { render(): Render[".md"] };
"edilizia.md": {
	id: "edilizia.md";
  slug: "edilizia";
  body: string;
  collection: "solutions-it";
  data: InferEntrySchema<"solutions-it">
} & { render(): Render[".md"] };
"estimo-immobiliare.md": {
	id: "estimo-immobiliare.md";
  slug: "estimo-immobiliare";
  body: string;
  collection: "solutions-it";
  data: InferEntrySchema<"solutions-it">
} & { render(): Render[".md"] };
"formazione-sicurezza.md": {
	id: "formazione-sicurezza.md";
  slug: "formazione-sicurezza";
  body: string;
  collection: "solutions-it";
  data: InferEntrySchema<"solutions-it">
} & { render(): Render[".md"] };
"progettazione-architettonica.md": {
	id: "progettazione-architettonica.md";
  slug: "progettazione-architettonica";
  body: string;
  collection: "solutions-it";
  data: InferEntrySchema<"solutions-it">
} & { render(): Render[".md"] };
"sicurezza-sul-lavoro.md": {
	id: "sicurezza-sul-lavoro.md";
  slug: "sicurezza-sul-lavoro";
  body: string;
  collection: "solutions-it";
  data: InferEntrySchema<"solutions-it">
} & { render(): Render[".md"] };
"sostenibilita-energetica.md": {
	id: "sostenibilita-energetica.md";
  slug: "sostenibilita-energetica";
  body: string;
  collection: "solutions-it";
  data: InferEntrySchema<"solutions-it">
} & { render(): Render[".md"] };
"superbonus-110.md": {
	id: "superbonus-110.md";
  slug: "superbonus-110";
  body: string;
  collection: "solutions-it";
  data: InferEntrySchema<"solutions-it">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../../src/content/config.js");
}
