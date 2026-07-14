import type { Category, HotelTable, MenuItem } from "./types";

export const CATEGORIES: Category[] = [
  { id: "soft", label: "SOFTDRINKS" },
  { id: "starters", label: "STARTERS" },
  { id: "hot", label: "HOTDRINK" },
  { id: "breads", label: "BREADS" },
  { id: "biriyani", label: "BIRIYANI" },
  { id: "rices", label: "RICES" },
  { id: "mandi", label: "MANDI" },
  { id: "chicken", label: "CHICKEN" },
];

export const ITEMS: MenuItem[] = [
  { id: "s1", cat: "soft", name: "Water 2L", price: 60 },
  { id: "s2", cat: "soft", name: "7UP 320ML", price: 40 },
  { id: "s3", cat: "soft", name: "Pepsi 320ML", price: 40 },
  { id: "s4", cat: "soft", name: "Mirinda 320ML", price: 40 },
  { id: "s5", cat: "soft", name: "Sting 320ML", price: 40 },
  { id: "s6", cat: "soft", name: "Cola 250ML", price: 35 },
  { id: "s7", cat: "soft", name: "Sprite 185ML", price: 30 },
  { id: "s8", cat: "soft", name: "Badam Milk", price: 50 },
  { id: "st1", cat: "starters", name: "Chicken 65", price: 180 },
  { id: "st2", cat: "starters", name: "Paneer Tikka", price: 200 },
  { id: "st3", cat: "starters", name: "Chilli Chicken", price: 220 },
  { id: "st4", cat: "starters", name: "Gobi Manchurian", price: 170 },
  { id: "h1", cat: "hot", name: "Filter Coffee", price: 40 },
  { id: "h2", cat: "hot", name: "Masala Chai", price: 30 },
  { id: "h3", cat: "hot", name: "Green Tea", price: 35 },
  { id: "b1", cat: "breads", name: "Butter Naan", price: 40 },
  { id: "b2", cat: "breads", name: "Tandoori Roti", price: 20 },
  { id: "b3", cat: "breads", name: "Garlic Naan", price: 50 },
  { id: "b4", cat: "breads", name: "Kulcha", price: 45 },
  { id: "br1", cat: "biriyani", name: "Hyderabadi Chicken Biryani", price: 250 },
  { id: "br2", cat: "biriyani", name: "Kerala Biryani", price: 230 },
  { id: "br3", cat: "biriyani", name: "Mutton Biryani", price: 350 },
  { id: "br4", cat: "biriyani", name: "Ambur Biryani", price: 200 },
  { id: "br5", cat: "biriyani", name: "Fish Biryani", price: 250 },
  { id: "br6", cat: "biriyani", name: "Veg Biryani", price: 180 },
  { id: "r1", cat: "rices", name: "Ghee Rice", price: 90 },
  { id: "r2", cat: "rices", name: "Jeera Rice", price: 100 },
  { id: "r3", cat: "rices", name: "Fried Rice", price: 120 },
  { id: "r4", cat: "rices", name: "Curd Rice", price: 80 },
  { id: "m1", cat: "mandi", name: "Chicken Mandi", price: 300 },
  { id: "m2", cat: "mandi", name: "Mutton Mandi", price: 450 },
  { id: "m3", cat: "mandi", name: "Veg Mandi", price: 220 },
  { id: "c1", cat: "chicken", name: "Chicken Roast", price: 220 },
  { id: "c2", cat: "chicken", name: "Chicken Chilli", price: 240 },
  { id: "c3", cat: "chicken", name: "Butter Chicken", price: 260 },
  { id: "c4", cat: "chicken", name: "Tandoori Chicken", price: 280 },
];

export const SECTIONS = ["Dine In Hall", "AC Family", "Non-AC", "Outdoor"];
const STATUSES: HotelTable["status"][] = ["free", "occupied", "billing", "free", "free", "occupied"];

function buildTables(): HotelTable[] {
  const tables: HotelTable[] = [];
  let n = 1;
  const seatsPattern = [2, 4, 4, 6, 4, 2];
  SECTIONS.forEach((section, si) => {
    for (let i = 0; i < 6; i++) {
      const status = STATUSES[(n + si) % STATUSES.length];
      tables.push({
        id: "T" + n,
        num: n,
        section,
        seats: seatsPattern[i % 6],
        status,
        occupiedSince: status !== "free" ? Date.now() - (((n * 13) % 90) + 5) * 60 * 1000 : undefined,
      });
      n++;
    }
  });
  return tables;
}

export const TABLES: HotelTable[] = buildTables();

export const NOTE_CHIPS = ["Extra Spicy", "Less Spicy", "No Onion", "Extra Sugar", "Less Sugar", "Extra Gravy"];
