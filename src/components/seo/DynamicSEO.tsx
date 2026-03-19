'use client';

import { useEffect } from 'react';
import { Game } from '@/lib/games-data';
import { gamePublicUrl } from '@/lib/game-routes';

interface SEOHeadProps {
  game?: Game | null;
  view?: string;
}

export function SEOHead({ game, view }: SEOHeadProps) {
  useEffect(() => {
    const baseUrl = 'https://apkgaminghub.com';
    
    if (game) {
      const pageUrl = gamePublicUrl(game, baseUrl);
      // Game page SEO
      const title = `${game.name} - Download & Game Guide | APKgaminghub`;
      const description = game.description || `Download ${game.name} and read our comprehensive game guide with tips, strategies, and how to play instructions.`;
      const keywords = [
        game.name,
        `${game.name} download`,
        `${game.name} game guide`,
        `${game.name} tips`,
        `${game.name} strategies`,
        `${game.name} APK`,
        game.category,
        game.provider,
        'free game download',
        'APKgaminghub'
      ].join(', ');
      
      // Update document title
      document.title = title;
      
      // Update or create meta tags
      updateMetaTag('description', description);
      updateMetaTag('keywords', keywords);
      updateMetaTag('author', 'APKgaminghub');
      
      // Open Graph
      updateMetaTag('og:title', title, 'property');
      updateMetaTag('og:description', description, 'property');
      updateMetaTag('og:type', 'article', 'property');
      updateMetaTag('og:url', pageUrl, 'property');
      updateMetaTag('og:image', game.thumbnail, 'property');
      updateMetaTag('og:site_name', 'APKgaminghub', 'property');
      
      // Twitter Card
      updateMetaTag('twitter:card', 'summary_large_image', 'name');
      updateMetaTag('twitter:title', title, 'name');
      updateMetaTag('twitter:description', description, 'name');
      updateMetaTag('twitter:image', game.thumbnail, 'name');
      updateMetaTag('twitter:site', '@apkgaminghub', 'name');
      
      // Canonical URL
      updateCanonicalUrl(pageUrl);
      
      // Add game structured data
      const gameStructuredData = {
        "@context": "https://schema.org",
        "@type": "VideoGame",
        "name": game.name,
        "description": description,
        "genre": game.category,
        "gamePlatform": "Android",
        "applicationCategory": "Game",
        "operatingSystem": "Android",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "aggregateRating": game.rtp ? {
          "@type": "AggregateRating",
          "ratingValue": String(game.rtp / 20),
          "bestRating": "5",
          "worstRating": "1",
          "ratingCount": "1000"
        } : undefined,
        "image": game.thumbnail,
        "url": pageUrl,
        "publisher": {
          "@type": "Organization",
          "name": game.provider || "APKgaminghub"
        }
      };
      
      updateStructuredData(gameStructuredData, 'game-schema');
      
    } else if (view) {
      // Category page SEO
      const categoryNames: Record<string, string> = {
        slots: 'Slot Games',
        casino: 'Casino Games',
        poker: 'Poker Games',
        skill: 'Skill Games',
        bingo: 'Bingo Games',
        promotions: 'Promotions & Bonuses',
        vip: 'VIP Program',
        profile: 'My Profile'
      };
      
      const categoryName = categoryNames[view] || 'Games';
      const title = `${categoryName} | APKgaminghub`;
      const description = `Explore the best ${categoryName.toLowerCase()} on APKgaminghub. Download free games, read guides, and discover tips and strategies.`;
      
      document.title = title;
      updateMetaTag('description', description);
      updateMetaTag('og:title', title, 'property');
      updateMetaTag('og:description', description, 'property');
      updateMetaTag('og:type', 'website', 'property');
      updateMetaTag('og:url', `${baseUrl}/?view=${view}`, 'property');
      updateMetaTag('twitter:title', title, 'name');
      updateMetaTag('twitter:description', description, 'name');
      
      updateCanonicalUrl(`${baseUrl}/?view=${view}`);
      removeStructuredData('game-schema');
      
    } else {
      // Reset to default
      document.title = 'APKgaminghub - Download Free Games, APK Mods & Gaming Guides';
      updateMetaTag('description', 'Download free games, APK mods, and discover the best gaming content. Your ultimate gaming destination with game guides, tips, strategies, and free downloads.');
      updateMetaTag('og:title', 'APKgaminghub - Download Free Games, APK Mods & Gaming Guides', 'property');
      updateMetaTag('og:description', 'Download free games, APK mods, and discover the best gaming content. Your ultimate gaming destination.', 'property');
      updateCanonicalUrl(baseUrl);
      removeStructuredData('game-schema');
    }
  }, [game, view]);
  
  return null;
}

// Helper function to update meta tags
function updateMetaTag(name: string, content: string, attributeName: string = 'name') {
  let element = document.querySelector(`meta[${attributeName}="${name}"]`);
  
  if (element) {
    element.setAttribute('content', content);
  } else {
    element = document.createElement('meta');
    element.setAttribute(attributeName, name);
    element.setAttribute('content', content);
    document.head.appendChild(element);
  }
}

// Helper function to update canonical URL
function updateCanonicalUrl(url: string) {
  let element = document.querySelector('link[rel="canonical"]');
  
  if (element) {
    element.setAttribute('href', url);
  } else {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    element.setAttribute('href', url);
    document.head.appendChild(element);
  }
}

// Helper function to add/update structured data
function updateStructuredData(data: object, id: string) {
  let element = document.getElementById(id) as HTMLScriptElement;
  
  if (element) {
    element.textContent = JSON.stringify(data);
  } else {
    element = document.createElement('script');
    element.type = 'application/ld+json';
    element.id = id;
    element.textContent = JSON.stringify(data);
    document.head.appendChild(element);
  }
}

// Helper function to remove structured data
function removeStructuredData(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.remove();
  }
}
