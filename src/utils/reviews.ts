// პროდუქტის მიხედვით შენახულ ადგილობრივ შეფასებებს ასუფთავებს.
export const REVIEW_STORAGE_PREFIX = "10x-shop-reviews-";

export function clearSavedReviews(): boolean {
  try {
    const reviewKeys: string[] = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key?.startsWith(REVIEW_STORAGE_PREFIX)) reviewKeys.push(key);
    }
    reviewKeys.forEach((key) => localStorage.removeItem(key));
    return true;
  } catch {
    return false;
  }
}
