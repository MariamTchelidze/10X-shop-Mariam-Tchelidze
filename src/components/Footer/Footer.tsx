import { Link } from "react-router-dom";
import type { ReactNode } from "react";

const helpLinks = [
  ["SHOP ONLINE", "/help/shop-online"],
  ["PAYMENTS", "/help/payments"],
  ["DELIVERIES AND ORDER TRACKING", "/help/deliveries"],
  ["RETURNS", "/help/returns"],
  ["RETURN AS A GUEST", "/help/return-guest"],
  ["GIFT CARD", "/help/gift-card"],
  ["SEARCH FOR RECEIPT", "/help/search-receipt"],
  ["GUEST PURCHASE", "/help/guest-purchase"],
  ["GIFT TICKET", "/help/gift-ticket"],
  ["IN-STORE WIFI CONNECTION", "/help/wifi-connection"],
  ["CANCEL MY SUBSCRIPTION", "/help/cancel-subscription"],
] as const;

const companyLinks = [
  ["ABOUT MIDDLE MARKET", "/about/about-us"],
  ["WORK WITH US", "/about/work-with-us"],
  ["OUR STORES", "/about/our-stores"],
] as const;

const interestLinks = [
  ["APPAREL", "womens-dresses", "category"],
  ["ACCESSORIES", "womens-bags", "category"],
  ["HOME & LIVING", "home-decoration", "category"],
  ["COLLECTIBLES", "watch", "search"],
] as const;

const socials = ["Instagram", "Facebook", "Twitter", "TikTok", "Snapchat", "YouTube", "Pinterest", "Spotify"] as const;
type SocialName = (typeof socials)[number];

const socialUrls: Record<SocialName, string> = {
  Instagram: "https://www.instagram.com/",
  Facebook: "https://www.facebook.com/",
  Twitter: "https://www.twitter.com/",
  TikTok: "https://www.tiktok.com/",
  Snapchat: "https://www.snapchat.com/",
  YouTube: "https://www.youtube.com/",
  Pinterest: "https://www.pinterest.com/",
  Spotify: "https://open.spotify.com/",
};

const linkClass = "text-[10px] leading-5 text-market-muted transition-colors hover:text-market-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-market-ink sm:text-[11px]";

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.12em] text-market-ink">{title}</h2>
      {children}
    </section>
  );
}

function SocialIcon({ name }: { name: SocialName }) {
  const iconClass = "h-4 w-4 fill-current";
  switch (name) {
    case "Instagram": return <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClass}><path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm4.5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-3.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" /></svg>;
    case "Facebook": return <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClass}><path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.5 1.6-1.5h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8V21h3.4Z" /></svg>;
    case "Twitter": return <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClass}><path d="M22 5.9a8 8 0 0 1-2.4.7 4.2 4.2 0 0 0 1.8-2.3 8.3 8.3 0 0 1-2.7 1 4.1 4.1 0 0 0-7 3.7 11.7 11.7 0 0 1-8.5-4.3 4.1 4.1 0 0 0 1.3 5.5 4.1 4.1 0 0 1-1.9-.5v.1a4.1 4.1 0 0 0 3.3 4 4.2 4.2 0 0 1-1.9.1 4.1 4.1 0 0 0 3.8 2.9A8.3 8.3 0 0 1 2 18.5a11.7 11.7 0 0 0 18-9.9v-.5A8.4 8.4 0 0 0 22 5.9Z" /></svg>;
    case "TikTok": return <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClass}><path d="M19.6 7.2a6.9 6.9 0 0 1-4.2-1.4v8.1a5.6 5.6 0 1 1-4.8-5.5v3a2.6 2.6 0 1 0 1.8 2.5V2.5h3a4 4 0 0 0 4.2 3.8v.9Z" /></svg>;
    case "Snapchat": return <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClass}><path d="M12 2.2c-3 0-4.8 2.1-4.8 5.3 0 .8.1 1.7.2 2.5-.4.3-1 .4-1.5.3-.4-.1-.8.1-.9.5-.1.4.2.8.6.9.7.2 1.4.1 2.1-.2-.7 1.5-1.7 2.7-3.3 3.5-.4.2-.5.6-.3 1 .2.3.6.4.9.3.7-.3 1.2-.2 1.4.1.3.4.1 1.1 1.1 1.2.6 0 1.1-.2 1.7 0 .8.2 1.7 1.7 2.8 1.7s2-1.5 2.8-1.7c.6-.2 1.1 0 1.7 0 1-.1.8-.8 1.1-1.2.2-.3.7-.4 1.4-.1.3.1.7 0 .9-.3.2-.4.1-.8-.3-1-1.6-.8-2.6-2-3.3-3.5.7.3 1.4.4 2.1.2.4-.1.7-.5.6-.9-.1-.4-.5-.6-.9-.5-.5.1-1.1 0-1.5-.3.1-.8.2-1.7.2-2.5 0-3.2-1.8-5.3-4.8-5.3Z" /></svg>;
    case "YouTube": return <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClass}><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z" /></svg>;
    case "Pinterest": return <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClass}><path d="M12 2a10 10 0 0 0-3.6 19.3c0-.8 0-1.8.2-2.7l1.3-5.5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.8 0 1.2.6 1.2 1.4 0 .8-.5 2-.8 3.1-.2.9.5 1.6 1.4 1.6 1.7 0 3-1.8 3-4.4 0-2.3-1.7-3.8-4-3.8-2.8 0-4.4 2.1-4.4 4.3 0 .9.3 1.9.8 2.4.1.2.2.4.1.6l-.3 1.1c-.1.4-.3.5-.7.3-1.2-.6-1.9-2.4-1.9-3.9 0-3.2 2.3-6.2 6.7-6.2 3.5 0 6.2 2.5 6.2 5.8 0 3.5-2.2 6.4-5.2 6.4-1 0-2-.6-2.4-1.2l-.7 2.7c-.3 1-.9 2-1.3 2.8A10 10 0 1 0 12 2Z" /></svg>;
    case "Spotify": return <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClass}><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 14.4a.8.8 0 0 1-1.1.3 9.8 9.8 0 0 0-7.7-.9.8.8 0 1 1-.5-1.5 11.4 11.4 0 0 1 9 1.1.8.8 0 0 1 .3 1Zm1.2-2.7a1 1 0 0 1-1.3.3 12 12 0 0 0-9.3-1.1 1 1 0 1 1-.6-1.8 14 14 0 0 1 10.9 1.3 1 1 0 0 1 .3 1.3Zm.1-2.8a1.2 1.2 0 0 1-1.6.4 14.5 14.5 0 0 0-10.9-1.2 1.2 1.2 0 1 1-.7-2.3 17 17 0 0 1 12.8 1.4 1.2 1.2 0 0 1 .4 1.7Z" /></svg>;
  }
}

export function Footer() {
  return (
    <footer className="border-t border-market-border bg-market-paper text-market-ink">
      <div className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-[1.1fr_1.5fr_1fr_1.25fr_auto] lg:gap-8">
          <FooterColumn title="CAN WE HELP YOU?">
            <ul className="space-y-3">
              <li><span className="block text-[10px] font-medium tracking-wide">START CHAT</span><span className="mt-1 block text-[9px] leading-4 text-market-muted">(OUT OF SERVICE, MON-FRI 10:00AM - 06:30PM)</span></li>
              <li><a href="tel:00800341207" className={linkClass}>CALL 0 0800 341 207</a><span className="mt-1 block text-[9px] leading-4 text-market-muted">(OUT OF SERVICE, MON-FRI 10:00 - 19:00)</span></li>
              <li><a href="tel:+302242200756" className={linkClass}>CALL +302242200756</a><span className="mt-1 block text-[9px] leading-4 text-market-muted">(OUT OF SERVICE, MON-FRI 10:00 - 19:00)</span></li>
            </ul>
          </FooterColumn>
          <FooterColumn title="HELP">
            <ul className="space-y-1">{helpLinks.map(([label, href]) => <li key={href}><Link to={href} className={linkClass}>{label}</Link></li>)}</ul>
          </FooterColumn>
          <FooterColumn title="WE ARE MIDDLE MARKET">
            <ul className="space-y-1">{companyLinks.map(([label, href]) => <li key={href}><Link to={href} className={linkClass}>{label}</Link></li>)}</ul>
          </FooterColumn>
          <FooterColumn title="YOU MIGHT BE INTERESTED IN">
            <ul className="space-y-1">{interestLinks.map(([label, value, kind]) => <li key={label}><Link to={kind === "category" ? `/?category=${value}&page=1` : `/?q=${encodeURIComponent(value)}&page=1`} className={linkClass}>{label}</Link></li>)}</ul>
          </FooterColumn>
          <nav aria-label="Social media" className="sm:col-span-2 lg:col-span-1">
            <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.12em] text-market-ink lg:sr-only">Follow us</h2>
            <ul className="flex flex-wrap gap-2 lg:w-9 lg:flex-col">
              {socials.map((name) => <li key={name}><a href={socialUrls[name]} target="_blank" rel="noreferrer" aria-label={name} title={name} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-market-ink text-market-paper transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-market-ink"><SocialIcon name={name} /></a></li>)}
            </ul>
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-market-border pt-6 text-[10px] uppercase tracking-[0.12em] text-market-muted sm:flex-row sm:items-center sm:justify-between">
          <span>GEORGIA <span aria-hidden="true">|</span> GEORGIAN</span>
          <span>© 2026 MIDDLE MARKET</span>
        </div>
      </div>
    </footer>
  );
}
