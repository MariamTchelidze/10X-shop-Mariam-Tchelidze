// ქვედა მენიუს საინფორმაციო ბმულებისთვის საერთო გვერდის შაბლონს იძლევა.
import type { ReactNode } from "react";
import { Link } from "react-router";

interface FooterInfoPageProps {
  title: string;
  intro: string;
  details: ReactNode;
}

function FooterInfoPage({ title, intro, details }: FooterInfoPageProps) {
  // ყველა საინფორმაციო მარშრუტი ამ საერთო ჩარჩოს იყენებს, შიგთავსი კი გვერდების მიხედვით იცვლება.
  return (
    <main className="mx-auto min-h-[60vh] w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <p className="text-[10px] uppercase tracking-[0.18em] text-market-muted">10X Shop · Customer care</p>
      <h1 className="mt-4 border-b border-market-border pb-6 font-display text-3xl text-market-ink sm:text-4xl">{title}</h1>
      <p className="mt-8 max-w-2xl text-sm leading-7 text-market-muted">{intro}</p>
      <div className="mt-5 max-w-2xl space-y-4 text-sm leading-7 text-market-muted">{details}</div>
      <Link to="/" className="mt-10 inline-flex min-h-12 items-center bg-market-ink px-7 text-xs font-medium uppercase tracking-[0.14em] text-market-paper transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink">Back to catalog</Link>
    </main>
  );
}

export function ShopOnlinePage() { return <FooterInfoPage title="Shop the realm" intro="Explore keepsakes inspired by the lands, legends, and craftsmanship of Middle-earth." details={<><p>Browse apparel, accessories, home and living, and collectibles. Open any listing for its details and availability.</p><p>From a One Ring replica to a Mordor mug, every treasure deserves a place in your collection.</p></>} />; }
export function PaymentsPage() { return <FooterInfoPage title="Payments" intro="Payment information for your 10X Shop order." details={<p>This graduation project provides a local checkout simulation. No payment details are requested or processed, and no payment is collected.</p>} />; }
export function DeliveriesPage() { return <FooterInfoPage title="Deliveries and order tracking" intro="Keep track of your order from your account." details={<p>Placed orders are saved in My Orders with their order date, item summary, total, and current status. Delivery tracking is not connected in this demo.</p>} />; }
export function ReturnsPage() { return <FooterInfoPage title="Returns" intro="Need help with a return? Our customer-care channels are currently out of service." details={<p>This demo does not process returns or create return labels. Please keep your order details available if you are contacting the store team.</p>} />; }
export function ReturnGuestPage() { return <FooterInfoPage title="Return as a guest" intro="Guest return tools are not available in this project demo." details={<p>Orders placed through 10X Shop are associated with the signed-in account used at checkout. Sign in and visit My Orders to review your order details.</p>} />; }
export function GiftCardPage() { return <FooterInfoPage title="Gift card" intro="Gift cards are not currently available for purchase or redemption in 10X Shop." details={<p>Explore the catalog to find a gift from the current collection.</p>} />; }
export function SearchReceiptPage() { return <FooterInfoPage title="Search for receipt" intro="Your order history keeps a summary of purchases made in this demo." details={<p>Open My Account and choose My Orders to review saved order IDs and totals. Store receipt lookup is not connected.</p>} />; }
export function GuestPurchasePage() { return <FooterInfoPage title="Guest purchase" intro="A 10X Shop account is required to add products to your bag and complete checkout." details={<p>Create an account or log in to keep your bag and order history connected to your profile.</p>} />; }
export function GiftTicketPage() { return <FooterInfoPage title="Gift ticket" intro="Gift ticket services are not available in this project demo." details={<p>For product information, return to the catalog and open an item from the collection.</p>} />; }
export function WifiConnectionPage() { return <FooterInfoPage title="In-store Wi-Fi connection" intro="In-store Wi-Fi is not provided by this online shop demo." details={<p>10X Shop is a browser-based project. Store network access is outside the scope of this experience.</p>} />; }
export function CancelSubscriptionPage() { return <FooterInfoPage title="Cancel my subscription" intro="10X Shop does not currently offer a paid subscription." details={<p>No recurring billing or subscription cancellation is required for this demo.</p>} />; }
export function AboutUsPage() { return <FooterInfoPage title="About 10X Shop" intro="10X Shop is a high-fantasy editorial shop inspired by the landscapes, artifacts, and textures of Middle-earth." details={<p>Discover a carefully imagined collection of cloaks, keepsakes, rings, and home treasures, presented in a calm, timeless storefront.</p>} />; }
export function WorkWithUsPage() { return <FooterInfoPage title="Work with us" intro="There are no open roles listed for this student project." details={<p>Thank you for your interest in 10X Shop.</p>} />; }
export function OurStoresPage() { return <FooterInfoPage title="Our stores" intro="10X Shop is an online project and does not currently operate physical stores." details={<p>Browse the online catalog to explore the available products.</p>} />; }
