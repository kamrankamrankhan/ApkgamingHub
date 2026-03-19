import type { Game } from '@/lib/games-data';

const CATEGORY_HREF: Partial<Record<Game['category'], string>> = {
  slots: '/slots',
  casino: '/casino',
  poker: '/poker',
  skill: '/skill-games',
  bingo: '/bingo',
  novoline: '/slots',
};

export function gamesListHrefForCategory(category: Game['category']): string {
  return CATEGORY_HREF[category] ?? '/slots';
}

/** URL path segment for game detail (slug preferred for SEO). */
export function getGameDetailHref(game: { id: string; slug?: string }): string {
  const segment = encodeURIComponent(game.slug || game.id);
  return `/games/${segment}`;
}

export function gamePublicUrl(game: { id: string; slug?: string }, baseUrl = 'https://apkgaminghub.com'): string {
  return `${baseUrl}${getGameDetailHref(game)}`;
}
