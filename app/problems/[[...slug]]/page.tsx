import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllProblems, getProblemByCode } from '@/lib/catalog';
import { ProblemProse } from '@/components/problem-prose';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function ProblemPage({ params }: PageProps) {
  const { slug } = await params;

  // If visiting /problems or /problems/ directly, redirect to first problem code
  if (!slug || slug.length === 0 || slug[0] === 'index') {
    return (
      <div className="flex-1 p-8 text-center text-muted-foreground font-sans text-sm">
        <meta httpEquiv="refresh" content="0; url=/problems/auth.error.unauthorized/" />
        <script
          dangerouslySetInnerHTML={{
            __html: "window.location.replace('/problems/auth.error.unauthorized/');",
          }}
        />
        <p>
          Redirecting to{' '}
          <a href="/problems/auth.error.unauthorized/" className="text-primary underline font-mono">
            /problems/auth.error.unauthorized/
          </a>
          ...
        </p>
      </div>
    );
  }

  const code = slug[0];
  const problem = getProblemByCode(code);

  if (!problem) {
    notFound();
  }

  return <ProblemProse problem={problem} />;
}

export async function generateStaticParams() {
  const problems = getAllProblems();
  const params = problems.map((p) => ({
    slug: [p.code],
  }));

  // Also export root /problems/
  return [...params, { slug: [] }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!slug || slug.length === 0 || slug[0] === 'index') {
    return {
      title: 'Problem Catalog - Arda Docs',
      description: 'Standardized RFC 7807 problem specifications and error diagnostic catalog for Arda Core Banking.',
    };
  }

  const problem = getProblemByCode(slug[0]);
  if (!problem) return {};

  return {
    title: `${problem.title} (${problem.code}) - Arda Docs`,
    description: problem.summary,
  };
}
