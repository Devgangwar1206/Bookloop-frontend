import ClientApp from './ClientApp';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export function generateStaticParams() {
  return [{ slug: [] }];
}

export default function Page() {
  return <ClientApp />;
}
