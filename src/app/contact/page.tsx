'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/DynamicSEO';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950">
      <SEOHead />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-white mb-4">Contact</h1>
        <p className="text-purple-200 leading-relaxed">
          This is a placeholder contact page. Update this with your support email, contact form, and
          social links.
        </p>
      </main>
      <Footer />
    </div>
  );
}

