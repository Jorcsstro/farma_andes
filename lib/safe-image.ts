const LOCAL_IMAGE_FALLBACK = "/products/receta.svg";
const SAFE_LOCAL_IMAGE_PREFIXES = [
  "/identidad-visual/",
  "/icons/",
  "/images/",
  "/products/",
  "/sections/"
];
const SAFE_LOCAL_IMAGE_EXTENSIONS = [".avif", ".gif", ".jpg", ".jpeg", ".png", ".svg", ".webp"];
const SAFE_REMOTE_IMAGE_EXTENSIONS = [".avif", ".gif", ".jpg", ".jpeg", ".png", ".webp"];

function getSupabaseImageHostname() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    return "";
  }

  try {
    return new URL(supabaseUrl).hostname;
  } catch {
    return "";
  }
}

const SUPABASE_IMAGE_HOSTNAME = getSupabaseImageHostname();

export function isSafeImageUrl(value: string) {
  const imageUrl = value.trim();

  if (!imageUrl) {
    return false;
  }

  const lowerImageUrl = imageUrl.toLowerCase();
  const hasSafeLocalExtension = SAFE_LOCAL_IMAGE_EXTENSIONS.some((extension) => lowerImageUrl.includes(extension));
  const hasSafeRemoteExtension = SAFE_REMOTE_IMAGE_EXTENSIONS.some((extension) => lowerImageUrl.includes(extension));

  if (imageUrl.startsWith("/")) {
    return (
      !imageUrl.startsWith("//") &&
      !imageUrl.includes("..") &&
      SAFE_LOCAL_IMAGE_PREFIXES.some((prefix) => imageUrl.startsWith(prefix)) &&
      hasSafeLocalExtension
    );
  }

  try {
    const parsedUrl = new URL(imageUrl);
    return (
      parsedUrl.protocol === "https:" &&
      parsedUrl.hostname === SUPABASE_IMAGE_HOSTNAME &&
      hasSafeRemoteExtension
    );
  } catch {
    return false;
  }
}

export function getSafeImageUrl(value: string, fallback = LOCAL_IMAGE_FALLBACK) {
  return isSafeImageUrl(value) ? value.trim() : fallback;
}
