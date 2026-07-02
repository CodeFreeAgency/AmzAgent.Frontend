/** Brand name → expected filename slug (without extension) */
export const BRAND_LOGO_SLUGS = {
  Nike: "nike",
  Adidas: "adidas",
  Puma: "puma",
  Reebok: "reebok",
  "New Balance": "new-balance",
  "Under Armour": "under-armour",
};

const EXTENSIONS = ["png", "svg", "jpg", "jpeg", "webp"];

/** Bundled logos from src/assets/brands/ and src/assets/ */
const bundledModules = {
  ...import.meta.glob("../../assets/brands/*.{png,jpg,jpeg,svg,webp,PNG,JPG,JPEG,SVG,WEBP}", {
    eager: true,
    import: "default",
  }),
  ...import.meta.glob("../../assets/*.{png,jpg,jpeg,svg,webp,PNG,JPG,JPEG,SVG,WEBP}", {
    eager: true,
    import: "default",
  }),
};

function normalizeKey(str) {
  return str.toLowerCase().replace(/[\s_'-]+/g, "");
}

function slugForBrand(brand) {
  if (BRAND_LOGO_SLUGS[brand]) return BRAND_LOGO_SLUGS[brand];
  return brand.toLowerCase().replace(/\s+/g, "-").replace(/'/g, "");
}

function matchBundledLogo(brand) {
  const slug = slugForBrand(brand);
  const normBrand = normalizeKey(brand);
  const normSlug = normalizeKey(slug);

  for (const [path, url] of Object.entries(bundledModules)) {
    const file = path.split("/").pop() || "";
    const name = file.replace(/\.[^.]+$/i, "");
    const normName = normalizeKey(name);
    if (normName === normSlug || normName === normBrand || name.toLowerCase() === slug) {
      return url;
    }
  }
  return null;
}

/** Public folder: public/img/brands/{slug}.{ext} */
export function getPublicBrandLogoCandidates(brand) {
  const slug = slugForBrand(brand);
  const base = `${import.meta.env.BASE_URL}img/brands/${slug}`;
  return EXTENSIONS.map((ext) => `${base}.${ext}`);
}

/**
 * Resolve brand logo URL.
 * 1. src/assets/brands/ (bundled)
 * 2. public/img/brands/ (first matching extension tried by component onError)
 */
export function getBrandLogo(brand) {
  const bundled = matchBundledLogo(brand);
  if (bundled) return bundled;
  return getPublicBrandLogoCandidates(brand)[0] || null;
}

export function getAllBrandLogoSources(brand) {
  const bundled = matchBundledLogo(brand);
  const publicUrls = getPublicBrandLogoCandidates(brand);
  if (bundled) return [bundled, ...publicUrls];
  return publicUrls;
}
