import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://apkgaminghub.com';

  // Fetch games from database for dynamic URLs
  let games: { slug: string; updatedAt: string }[] = [];
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || baseUrl}/api/games?limit=1000`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    const data = await response.json();
    games = (data.games || []).map((game: { slug: string; updatedAt: string }) => ({
      slug: game.slug,
      updatedAt: game.updatedAt
    }));
  } catch (error) {
    console.error('Error fetching games for sitemap:', error);
  }

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/admin`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];

  // Game category pages
  const categoryPages = [
    'slots',
    'casino',
    'poker',
    'skill',
    'bingo',
  ].map(category => ({
    url: `${baseUrl}/?view=${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // Dynamic game pages
  const gamePages = games.map(game => ({
    url: `${baseUrl}/?game=${game.slug}`,
    lastModified: game.updatedAt ? new Date(game.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...gamePages];
}
