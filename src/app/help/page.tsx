'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/DynamicSEO';

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950">
      <SEOHead />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-white mb-4">Help</h1>
        <p className="text-purple-200 leading-relaxed">
          This is a placeholder help page. Update this content with your FAQs, support contacts, and usage
          information.
        </p>
      </main>
      <Footer />
    </div>
  );
}

