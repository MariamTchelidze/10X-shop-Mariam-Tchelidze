// საერთო გამოყენების თარიღის ფორმატირების ფუნქციას იძლევა.
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString();
}
