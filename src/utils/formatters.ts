// პროდუქტისა და შეკვეთის თანხას ყოველთვის სტანდარტულ აშშ დოლარად აჩვენებს.
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// თარიღს მომხმარებლისთვის წაკითხვად ფორმატში აბრუნებს.
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString();
}
