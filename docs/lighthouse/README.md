# Lighthouse-ის ანგარიშები

## შემოწმების პირობები

- თარიღი: 2026-11-05
- ინსტრუმენტი: Chrome DevTools Lighthouse 13.5.0
- რეჟიმი: Navigation, Mobile, Performance / Accessibility / Best Practices / SEO
- გვერდი: `http://127.0.0.1:4173/?page=1` — ლოკალური production preview; ეს Vercel-ის შემოწმება არ არის.
- `before` ანგარიშში მთავარი hero-სურათის preload არ იყო დამატებული. `after` ანგარიშში იგივე build-ს დაემატა საწყისი hero-სურათის მაღალი პრიორიტეტის preload (`index.html`).

## შედეგები

| მეტრიკა | მანამდე | შემდეგ | ცვლილება |
| --- | ---: | ---: | ---: |
| Performance | 65 | 67 | +2 |
| Accessibility | 100 | 100 | უცვლელი |
| Best Practices | 100 | 100 | უცვლელი |
| SEO | 83 | 83 | უცვლელი |
| First Contentful Paint | 2.2 წმ | 2.2 წმ | უცვლელი |
| Largest Contentful Paint | 7.4 წმ | 7.1 წმ | 0.3 წმ-ით სწრაფი |
| Speed Index | 5.3 წმ | 2.5 წმ | 2.8 წმ-ით სწრაფი |
| Total Blocking Time | 250 მწმ | 330 მწმ | 80 მწმ-ით ნელი |
| Cumulative Layout Shift | 0.01 | 0.009 | 0.001-ით ნაკლები |

Lighthouse-ის შედეგები გაშვებებს შორის იცვლება. Preload-მა ამ გაზომვაში Speed Index და LCP გააუმჯობესა, თუმცა Performance 67 დარჩა, ხოლო Total Blocking Time გაიზარდა. ამიტომ ეს შედეგი არ უნდა ჩაითვალოს performance მიზნების სრულად დაკმაყოფილების მტკიცებულებად; საჭიროა JavaScript-ის შესრულებისა და LCP-ის შემდგომი ოპტიმიზაცია და განმეორებითი გაზომვა.

## ფაილები

- [`before.html`](./before.html) და [`after.html`](./after.html) — Chrome Lighthouse-ის სრული ანგარიშები.
- [`before.json`](./before.json) და [`after.json`](./after.json) — იმავე გაშვებების მანქანით წასაკითხი თავდაპირველი მონაცემები.
- [`before.jpg`](./before.jpg) და [`after.jpg`](./after.jpg) — ანგარიშებში ჩაშენებული საბოლოო გვერდის კადრები.

## შეზღუდვები

ეს ანგარიშები ლოკალურ production build-ზეა მიღებული და არა გამოქვეყნებულ Vercel მისამართზე. ამიტომ deploy-ის მუშაობას, გარე ქსელის/CDN-ის შედეგებს ან Vercel rewrite-ს არ ადასტურებს. Vercel-ის ანგარიში უნდა განმეორდეს რეალურ deployment-ზე, როცა ის ხელმისაწვდომი იქნება.
