import { Redis } from "@upstash/redis";

/**
 * The pageview counter is optional. When the Upstash credentials are missing
 * (local dev, a fork, a preview deploy without secrets) every helper here
 * degrades to "no data" instead of throwing at module scope and taking the
 * whole build down with it.
 */

let client: Redis | null | undefined;

export function getRedis(): Redis | null {
	if (client !== undefined) {
		return client;
	}

	const url = process.env.UPSTASH_REDIS_REST_URL;
	const token = process.env.UPSTASH_REDIS_REST_TOKEN;

	client = url && token ? new Redis({ url, token }) : null;
	return client;
}

export async function getViews(slugs: string[]): Promise<Record<string, number>> {
	const empty = Object.fromEntries(slugs.map((slug) => [slug, 0]));

	const redis = getRedis();
	if (!redis || slugs.length === 0) {
		return empty;
	}

	try {
		const counts = await redis.mget<number[]>(
			...slugs.map((slug) => ["pageviews", "projects", slug].join(":")),
		);
		return slugs.reduce<Record<string, number>>((acc, slug, i) => {
			acc[slug] = counts[i] ?? 0;
			return acc;
		}, {});
	} catch {
		return empty;
	}
}

export async function getView(slug: string): Promise<number> {
	const redis = getRedis();
	if (!redis) {
		return 0;
	}

	try {
		return (await redis.get<number>(["pageviews", "projects", slug].join(":"))) ?? 0;
	} catch {
		return 0;
	}
}
