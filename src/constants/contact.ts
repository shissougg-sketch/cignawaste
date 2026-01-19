// Centralized contact information for the entire site
// Update these values in one place to change them everywhere

export const PHONE = "631-855-5502";
export const PHONE_LINK = "tel:+16318555502";
export const TEXT_LINK = "sms:+16318555502?body=Hi,%20I'd%20like%20a%20quote%20for%20a%20dumpster%20rental.";
export const PHONE_FORMATTED = "+1-631-855-5502";

export const SITE_URL = "https://cignadumpsters.com";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/dumpster-rentals", label: "Dumpster Rentals" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
] as const;

export const SERVICE_AREAS = {
  nassau: [
    "Elmont", "Franklin Square", "Freeport", "Garden City",
    "Glen Cove", "Great Neck", "Hempstead", "Hicksville",
    "Levittown", "Long Beach", "Lynbrook", "Massapequa",
    "Merrick", "Mineola", "New Hyde Park", "Oceanside",
    "Oyster Bay", "Plainview", "Port Washington", "Rockville Centre",
    "Roosevelt", "Seaford", "Valley Stream", "Wantagh", "Westbury"
  ],
  suffolk: [
    "Amityville", "Babylon", "Bay Shore", "Brentwood",
    "Brookhaven", "Commack", "Copiague", "Deer Park",
    "East Islip", "Huntington", "Islip", "Lake Ronkonkoma",
    "Lindenhurst", "Northport", "Patchogue", "Port Jefferson",
    "Riverhead", "Sayville", "Smithtown", "West Babylon", "West Islip"
  ]
} as const;
