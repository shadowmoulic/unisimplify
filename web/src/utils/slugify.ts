export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove special characters
    .replace(/[\s_-]+/g, '-') // replace spaces, underscores, and hyphens with a single hyphen
    .replace(/^-+|-+$/g, ''); // trim starting/ending hyphens
}
