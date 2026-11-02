import { notFound } from 'next/navigation';
import { sections, findSection } from '@/lib/navigation.mjs';
import { Dashboard } from '@/features/dashboard/dashboard';
import { SectionPage } from '@/features/workspace/section-page';
export function generateStaticParams() {
  return sections.map((s) => ({ section: s.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ section: string }> }) {
  return { title: findSection((await params).section)?.label ?? 'Not found' };
}
export default async function Page({ params }: { params: Promise<{ section: string }> }) {
  const section = findSection((await params).section);
  if (!section) notFound();
  return section.slug === 'dashboard' ? <Dashboard /> : <SectionPage section={section} />;
}
