import fs from 'node:fs';
import path from 'node:path';

export interface CodeSnippet {
  code: string;
  html: string;
}

export interface ProblemPageData {
  code: string;
  status: number;
  title: string;
  summary: string;
  client_action: string;
  operator_action: string;
  retry_policy: string;
  related_routes: string[];
  example: string;
  body: string;
  category: string;
  category_title: string;
  category_title_vi: string;
  cluster: string;
  domain: string;
  snippets: {
    exampleHtml: string;
    curl: CodeSnippet;
    go: CodeSnippet;
    typescript: CodeSnippet;
  };
}

export interface CategoryGroup {
  id: string;
  title: string;
  title_vi?: string;
  items: Array<{
    code: string;
    title: string;
    status: number;
  }>;
}

export interface ClusterGroup {
  id: string;
  title: string;
  title_vi: string;
  categories: CategoryGroup[];
  totalCodes: number;
}

interface CatalogFileContent {
  pages: ProblemPageData[];
  clusters: ClusterGroup[];
  categories: CategoryGroup[];
}

let cachedCatalog: CatalogFileContent | null = null;

export function getCatalog(): CatalogFileContent {
  if (!cachedCatalog) {
    const catalogPath = path.resolve(process.cwd(), 'content/catalog-data.json');
    if (!fs.existsSync(catalogPath)) {
      throw new Error(`Catalog data not found at ${catalogPath}. Did you run "bun run sync"?`);
    }
    const raw = fs.readFileSync(catalogPath, 'utf8');
    cachedCatalog = JSON.parse(raw);
  }
  return cachedCatalog!;
}

export function getAllProblems(): ProblemPageData[] {
  return getCatalog().pages;
}

export function getAllClusters(): ClusterGroup[] {
  return getCatalog().clusters || [];
}

export function getAllCategories(): CategoryGroup[] {
  return getCatalog().categories;
}

export function getProblemByCode(code: string): ProblemPageData | undefined {
  return getCatalog().pages.find((p) => p.code === code);
}

