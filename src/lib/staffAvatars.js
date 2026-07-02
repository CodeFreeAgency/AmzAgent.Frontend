/** Bundled staff images from src/assets/ (any subfolder) */
const bundledImages = import.meta.glob(
  "../assets/**/*.{png,jpg,jpeg,webp,svg,PNG,JPG,JPEG,WEBP,SVG}",
  { eager: true, import: "default" }
);

function slugify(value) {
  return value?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "";
}

function fileSlugFromPath(path) {
  const file = path.split("/").pop() || "";
  return file.replace(/\.[^.]+$/, "").toLowerCase();
}

/**
 * Resolve a staff avatar URL.
 * - data: URLs pass through (uploaded in CRUD)
 * - avatarKey matches filename slug in src/assets (e.g. "alex-morgan" → alex-morgan.jpg)
 */
export function getStaffAvatarUrl(avatar) {
  if (!avatar) return null;
  if (typeof avatar === "string" && avatar.startsWith("data:")) return avatar;

  const slug = slugify(avatar);

  for (const [path, url] of Object.entries(bundledImages)) {
    const fileSlug = fileSlugFromPath(path);
    if (fileSlug === slug || fileSlug.includes(slug) || slug.includes(fileSlug)) {
      return url;
    }
  }

  return null;
}

export function getBundledStaffAvatarOptions() {
  return Object.entries(bundledImages).map(([path, url]) => {
    const slug = fileSlugFromPath(path);
    const label = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return { slug, label, url };
  });
}
