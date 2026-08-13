export async function GET(request: Request) {
  const title = new URL(request.url).searchParams.get("title")?.trim();
  if (!title) return new Response("Missing title", { status: 400 });

  try {
    const api = new URL("https://en.wikipedia.org/w/api.php");
    api.searchParams.set("action", "query");
    api.searchParams.set("prop", "pageimages");
    api.searchParams.set("format", "json");
    api.searchParams.set("piprop", "thumbnail|original");
    api.searchParams.set("pithumbsize", "600");
    api.searchParams.set("redirects", "1");
    api.searchParams.set("titles", title);

    const lookup = await fetch(api, { headers: { "User-Agent": "StudioAtlas/1.0" } });
    if (!lookup.ok) return new Response("Artwork unavailable", { status: 404 });
    const data = await lookup.json() as { query?: { pages?: Record<string, { original?: { source?: string }, thumbnail?: { source?: string } }> } };
    const page = data.query?.pages && Object.values(data.query.pages)[0];
    const source = page?.original?.source || page?.thumbnail?.source;
    if (!source) return new Response("Artwork unavailable", { status: 404 });

    const image = await fetch(source, { headers: { "User-Agent": "StudioAtlas/1.0" } });
    if (!image.ok || !image.body) return new Response("Artwork unavailable", { status: 404 });
    return new Response(image.body, {
      headers: {
        "Content-Type": image.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=604800",
      },
    });
  } catch {
    return new Response("Artwork unavailable", { status: 404 });
  }
}
