import { PlaceItem } from "../types";

/**
 * Curated Database of Verified Masajid and Halal-Certified Dining
 */
export const PLACES_DATABASE: PlaceItem[] = [
  {
    id: "m-1",
    name: "Islamic Cultural Center & Central Mosque",
    category: "mosque",
    address: "146 Park Road, Regent's Park",
    city: "London",
    distanceKm: 0.8,
    rating: 4.9,
    reviewsCount: 1420,
    facilities: ["Jummah Prayer", "Women's Area", "Wudu Facilities", "Wheelchair Accessible", "Library"],
    phone: "+44 20 7724 3363",
    coordinates: { lat: 51.5303, lng: -0.1652 },
  },
  {
    id: "m-2",
    name: "East London Mosque & London Muslim Centre",
    category: "mosque",
    address: "82-92 Whitechapel Rd",
    city: "London",
    distanceKm: 2.3,
    rating: 4.8,
    reviewsCount: 2850,
    facilities: ["Jummah Prayer", "Women's Area", "Mortuary", "Imam Consultation", "Islamic School"],
    phone: "+44 20 7650 3000",
    coordinates: { lat: 51.5186, lng: -0.0658 },
  },
  {
    id: "m-3",
    name: "Masjid Al-Farooq",
    category: "mosque",
    address: "4424 S King Dr",
    city: "Chicago",
    distanceKm: 1.5,
    rating: 4.8,
    reviewsCount: 420,
    facilities: ["Jummah Prayer", "Daily 5 Prayers", "Taraweeh", "Women Section", "Parking"],
    phone: "+1 773 924 1333",
    coordinates: { lat: 41.8145, lng: -87.6163 },
  },
  {
    id: "m-4",
    name: "Islamic Center of America",
    category: "mosque",
    address: "19500 Ford Rd",
    city: "Dearborn",
    distanceKm: 3.1,
    rating: 4.9,
    reviewsCount: 1890,
    facilities: ["Jummah Prayer", "Banquet Hall", "Library", "Women's Prayer Hall", "Museum"],
    phone: "+1 313 593 0000",
    coordinates: { lat: 42.3351, lng: -83.2324 },
  },
  {
    id: "h-1",
    name: "Saffron Halal Mediterranean Grill",
    category: "restaurant",
    cuisine: "Mediterranean & Middle Eastern",
    address: "52 Baker Street",
    city: "London",
    distanceKm: 0.9,
    rating: 4.7,
    reviewsCount: 680,
    halalCertification: "HMC Certified 100% Halal",
    priceRange: "$$",
    features: ["Prayer Space Available", "No Alcohol Served", "Family Seating", "Takeaway"],
    phone: "+44 20 7486 9912",
    coordinates: { lat: 51.5198, lng: -0.1568 },
  },
  {
    id: "h-2",
    name: "Bosphorus Ottoman Kebabs & Steaks",
    category: "restaurant",
    cuisine: "Turkish & Grills",
    address: "108 Edgware Rd",
    city: "London",
    distanceKm: 1.1,
    rating: 4.6,
    reviewsCount: 1120,
    halalCertification: "Hand-Slaughtered Halal Certified",
    priceRange: "$$$",
    features: ["Halal Certified", "No Alcohol", "Private Rooms", "Delivery"],
    phone: "+44 20 7262 8844",
    coordinates: { lat: 51.5167, lng: -0.1633 },
  },
  {
    id: "h-3",
    name: "Al-Madina Gourmet Grill & Shawarma",
    category: "restaurant",
    cuisine: "Arabic & Yemeni Mandi",
    address: "241 Michigan Ave",
    city: "Chicago",
    distanceKm: 1.8,
    rating: 4.8,
    reviewsCount: 940,
    halalCertification: "Zabihah Halal Verified",
    priceRange: "$$",
    features: ["Full Halal Kitchen", "Prayer Room", "Family Friendly"],
    phone: "+1 312 443 1200",
    coordinates: { lat: 41.8819, lng: -87.6238 },
  },
  {
    id: "h-4",
    name: "Medina Halal Artisan Supermarket & Deli",
    category: "grocery",
    cuisine: "Halal Butcher & Fresh Bakery",
    address: "88 Queensway",
    city: "London",
    distanceKm: 1.4,
    rating: 4.9,
    reviewsCount: 530,
    halalCertification: "100% Certified Zabihah Halal Meat",
    priceRange: "$$",
    features: ["Fresh Halal Meat", "Organic Dates & Honey", "Imported Spices", "Prepared Meals"],
    phone: "+44 20 7229 5543",
    coordinates: { lat: 51.5134, lng: -0.1887 },
  },
];

export class PlacesService {
  /**
   * Search and filter places by category, search query keyword, or location
   */
  public static findPlaces(options: {
    category?: string;
    query?: string;
    city?: string;
  }): PlaceItem[] {
    const { category, query, city } = options;
    let results = [...PLACES_DATABASE];

    if (category && category !== "all") {
      results = results.filter((p) => p.category === category);
    }

    if (city && typeof city === "string" && city.trim() !== "") {
      const c = city.toLowerCase().trim();
      results = results.filter((p) => p.city.toLowerCase().includes(c));
    }

    if (query && typeof query === "string" && query.trim() !== "") {
      const q = query.toLowerCase().trim();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          (p.cuisine && p.cuisine.toLowerCase().includes(q)) ||
          (p.facilities && p.facilities.some((f) => f.toLowerCase().includes(q))) ||
          (p.features && p.features.some((f) => f.toLowerCase().includes(q)))
      );
    }

    return results;
  }
}
