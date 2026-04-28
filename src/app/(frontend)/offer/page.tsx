// src/app/(frontend)/offer/page.tsx
export const metadata = {
  title: 'Договор-оферта — Content Hunter',
  description: 'Публичный договор-оферта Content Hunter',
};

export default function OfferPage() {
  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      margin: 0, 
      padding: 0,
      background: '#0b1220' 
    }}>
      <iframe
        src="/docs/offer.pdf"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        title="Договор-оферта"
      />
    </div>
  );
}
