"use client";

import { useMemo, useState, useEffect } from "react";

type Dish = {
  id: number;
  name: string;
  desc: string;
  longDesc: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  time: string;
  category: string;
  img: string;
  tags: string[];
  popular?: boolean;
  spicy?: boolean;
  veg?: boolean;
  calories: number;
  serves: string;
  ingredients: string[];
};

const CATEGORIES = [
  { id: "all", label: "All", icon: "🍽️" },
  { id: "burgers", label: "Burgers", icon: "🍔" },
  { id: "pizza", label: "Pizza", icon: "🍕" },
  { id: "sushi", label: "Sushi", icon: "🍣" },
  { id: "pasta", label: "Pasta", icon: "🍝" },
  { id: "desserts", label: "Desserts", icon: "🍰" },
  { id: "drinks", label: "Drinks", icon: "🥤" },
  { id: "salads", label: "Salads", icon: "🥗" },
];

const DISHES: Dish[] = [
  {
    id: 1,
    name: "Double Cheeseburger",
    desc: "Two juicy beef patties, melted cheddar, lettuce, tomato, special sauce",
    longDesc:
      "Our signature double cheeseburger features two hand-pressed 100% Angus beef patties, flame-grilled to perfection. Layered with aged cheddar cheese, crisp lettuce, ripe tomatoes, and our secret house sauce, all nestled in a toasted brioche bun. A true classic that never disappoints.",
    price: 1299,
    oldPrice: 1699,
    rating: 4.9,
    reviews: 342,
    time: "25 min",
    category: "burgers",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    tags: ["Popular", "Best Seller"],
    popular: true,
    calories: 850,
    serves: "1 person",
    ingredients: ["Angus Beef", "Cheddar", "Lettuce", "Tomato", "Brioche Bun", "House Sauce"],
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    desc: "Wood-fired crust, premium pepperoni, mozzarella, tomato sauce",
    longDesc:
      "A wood-fired masterpiece topped with premium pepperoni, fresh mozzarella, and our signature San Marzano tomato sauce. Baked in a traditional stone oven for that perfect crispy-yet-chewy crust with smoky charred edges.",
    price: 1599,
    oldPrice: 1999,
    rating: 4.8,
    reviews: 289,
    time: "30 min",
    category: "pizza",
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
    tags: ["Hot 🔥"],
    spicy: true,
    popular: true,
    calories: 1100,
    serves: "2-3 people",
    ingredients: ["Pizza Dough", "Pepperoni", "Mozzarella", "Tomato Sauce", "Oregano"],
  },
  {
    id: 3,
    name: "Salmon Sushi Set",
    desc: "Fresh salmon nigiri, maki rolls, wasabi, pickled ginger",
    longDesc:
      "An exquisite assortment of fresh Norwegian salmon nigiri and maki rolls, handcrafted by our sushi masters. Served with wasabi, pickled ginger, and premium soy sauce. A taste of authentic Japan in every bite.",
    price: 2299,
    oldPrice: 2899,
    rating: 4.9,
    reviews: 198,
    time: "35 min",
    category: "sushi",
    img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
    tags: ["Chef's Pick"],
    popular: true,
    calories: 620,
    serves: "1-2 people",
    ingredients: ["Fresh Salmon", "Sushi Rice", "Nori", "Wasabi", "Ginger", "Soy Sauce"],
  },
  {
    id: 4,
    name: "Chocolate Lava Cake",
    desc: "Warm molten chocolate center, vanilla ice cream, berries",
    longDesc:
      "Indulge in our decadent chocolate lava cake with a warm molten center that flows beautifully when cut. Served with a scoop of premium vanilla bean ice cream and fresh seasonal berries. The perfect ending to any meal.",
    price: 899,
    oldPrice: 1199,
    rating: 5.0,
    reviews: 421,
    time: "20 min",
    category: "desserts",
    img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80",
    tags: ["New"],
    popular: true,
    calories: 480,
    serves: "1 person",
    ingredients: ["Dark Chocolate", "Butter", "Eggs", "Flour", "Vanilla Ice Cream", "Berries"],
  },
  {
    id: 5,
    name: "Fresh Berry Smoothie",
    desc: "Mixed berries, banana, Greek yogurt, honey",
    longDesc:
      "A refreshing blend of fresh strawberries, blueberries, raspberries, and banana, mixed with creamy Greek yogurt and a touch of natural honey. Packed with antioxidants and vitamins — a delicious way to stay healthy.",
    price: 699,
    oldPrice: 899,
    rating: 4.7,
    reviews: 156,
    time: "15 min",
    category: "drinks",
    img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80",
    tags: ["Healthy"],
    veg: true,
    calories: 250,
    serves: "1 person",
    ingredients: ["Strawberries", "Blueberries", "Banana", "Greek Yogurt", "Honey"],
  },
  {
    id: 6,
    name: "Caesar Salad Bowl",
    desc: "Crisp romaine, parmesan, grilled chicken, croutons",
    longDesc:
      "Fresh crisp romaine lettuce tossed in our creamy Caesar dressing, topped with grilled chicken breast, shaved parmesan, and crunchy croutons. A perfect balance of flavors and textures for a light yet satisfying meal.",
    price: 1099,
    oldPrice: 1399,
    rating: 4.6,
    reviews: 132,
    time: "20 min",
    category: "salads",
    img: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80",
    tags: ["Light"],
    calories: 380,
    serves: "1 person",
    ingredients: ["Romaine Lettuce", "Grilled Chicken", "Parmesan", "Croutons", "Caesar Dressing"],
  },
  {
    id: 7,
    name: "Truffle Mushroom Pasta",
    desc: "Creamy truffle sauce, wild mushrooms, parmesan, fresh basil",
    longDesc:
      "Al dente fettuccine tossed in a rich, creamy black truffle sauce with sautéed wild mushrooms and finished with freshly grated parmesan and basil. An elegant, aromatic dish that's pure comfort in every forkful.",
    price: 1899,
    oldPrice: 2399,
    rating: 4.9,
    reviews: 267,
    time: "30 min",
    category: "pasta",
    img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
    tags: ["Premium"],
    veg: true,
    calories: 720,
    serves: "1-2 people",
    ingredients: ["Fettuccine", "Black Truffle", "Wild Mushrooms", "Parmesan", "Cream", "Basil"],
  },
  {
    id: 8,
    name: "BBQ Bacon Burger",
    desc: "Smoky BBQ sauce, crispy bacon, onion rings, cheddar",
    longDesc:
      "A smoky sensation featuring a juicy beef patty topped with crispy bacon, golden onion rings, melted cheddar, and our signature smoky BBQ sauce. Served on a toasted sesame bun for the ultimate BBQ experience.",
    price: 1499,
    oldPrice: 1899,
    rating: 4.8,
    reviews: 305,
    time: "28 min",
    category: "burgers",
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",
    tags: ["Popular"],
    popular: true,
    calories: 920,
    serves: "1 person",
    ingredients: ["Beef Patty", "Bacon", "Onion Rings", "Cheddar", "BBQ Sauce", "Sesame Bun"],
  },
  {
    id: 9,
    name: "Margherita Pizza",
    desc: "San Marzano tomatoes, fresh mozzarella, basil, olive oil",
    longDesc:
      "The timeless Italian classic made with San Marzano tomatoes, fresh buffalo mozzarella, hand-picked basil leaves, and a drizzle of extra virgin olive oil. Simple, fresh, and absolutely perfect.",
    price: 1399,
    oldPrice: 1799,
    rating: 4.7,
    reviews: 234,
    time: "28 min",
    category: "pizza",
    img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
    tags: ["Classic"],
    veg: true,
    calories: 850,
    serves: "2-3 people",
    ingredients: ["Pizza Dough", "San Marzano Tomatoes", "Mozzarella", "Basil", "Olive Oil"],
  },
  {
    id: 10,
    name: "Dragon Roll Sushi",
    desc: "Shrimp tempura, avocado, eel sauce, tobiko",
    longDesc:
      "A spectacular signature roll featuring crispy shrimp tempura and creamy avocado, topped with eel sauce, tobiko, and microgreens. A visual and flavor masterpiece that's as beautiful as it is delicious.",
    price: 2499,
    oldPrice: 2999,
    rating: 4.9,
    reviews: 178,
    time: "40 min",
    category: "sushi",
    img: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&q=80",
    tags: ["Signature"],
    spicy: true,
    calories: 540,
    serves: "1-2 people",
    ingredients: ["Shrimp Tempura", "Avocado", "Eel Sauce", "Tobiko", "Sushi Rice", "Nori"],
  },
  {
    id: 11,
    name: "Tiramisu",
    desc: "Espresso-soaked ladyfingers, mascarpone, cocoa",
    longDesc:
      "Authentic Italian tiramisu made with espresso-soaked ladyfingers layered with creamy mascarpone cheese and dusted with premium cocoa powder. A classic dessert that melts in your mouth.",
    price: 999,
    oldPrice: 1299,
    rating: 4.9,
    reviews: 289,
    time: "15 min",
    category: "desserts",
    img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
    tags: ["Italian"],
    veg: true,
    calories: 420,
    serves: "1 person",
    ingredients: ["Ladyfingers", "Espresso", "Mascarpone", "Cocoa", "Eggs", "Sugar"],
  },
  {
    id: 12,
    name: "Iced Caramel Latte",
    desc: "Double espresso, caramel, milk, ice",
    longDesc:
      "A refreshing iced latte made with a double shot of premium espresso, velvety steamed milk, rich caramel syrup, and served over ice. Sweet, smooth, and perfect for any time of day.",
    price: 599,
    oldPrice: 799,
    rating: 4.6,
    reviews: 145,
    time: "10 min",
    category: "drinks",
    img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80",
    tags: ["Cold"],
    veg: true,
    calories: 180,
    serves: "1 person",
    ingredients: ["Espresso", "Milk", "Caramel Syrup", "Ice"],
  },
];

/* Format number as PKR */
const formatPKR = (n: number) => `Rs ${n.toLocaleString("en-PK")}`;

export default function MenuContent() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<
    "popular" | "price-low" | "price-high" | "rating"
  >("popular");
  const [onlyVeg, setOnlyVeg] = useState(false);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [cart, setCart] = useState<number[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Reset quantity when opening a new dish
  useEffect(() => {
    setQuantity(1);
  }, [selectedDish]);

  // Lock scroll when modal is open
  useEffect(() => {
    if (selectedDish) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedDish]);

  // Close modal on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedDish(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    let list = DISHES.filter((d) => {
      if (activeCategory !== "all" && d.category !== activeCategory) return false;
      if (onlyVeg && !d.veg) return false;
      if (d.price > maxPrice) return false;
      if (
        search &&
        !d.name.toLowerCase().includes(search.toLowerCase()) &&
        !d.desc.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });

    switch (sortBy) {
      case "price-low":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      default:
        list = [...list].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    }
    return list;
  }, [activeCategory, search, sortBy, onlyVeg, maxPrice]);

  const addToCart = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCart([...cart, id]);
  };

  const addMultipleToCart = (id: number, qty: number) => {
    setCart([...cart, ...Array(qty).fill(id)]);
    setSelectedDish(null);
  };

  const cartTotal = DISHES.filter((d) => cart.includes(d.id)).reduce(
    (s, d) => s + d.price,
    0
  );

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ============ MENU HERO ============ */}
      <section className="relative overflow-hidden pt-40 pb-16">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-orange-500/20 blur-[120px]" />
          <div className="absolute top-20 -right-40 h-[500px] w-[500px] rounded-full bg-red-500/20 blur-[120px]" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-300 backdrop-blur">
            <span className="animate-pulse">🔥</span> 200+ Dishes Available
          </div>
          <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Explore Our{" "}
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Delicious
            </span>{" "}
            Menu
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            Handcrafted dishes from world-class chefs, made with the freshest
            ingredients and delivered to your door.
          </p>

          <div className="mx-auto mt-10 max-w-2xl">
            <div className="group relative">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 opacity-30 blur transition group-focus-within:opacity-60" />
              <div className="relative flex items-center gap-3 rounded-full border border-white/10 bg-black/60 px-6 py-4 backdrop-blur-xl">
                <span className="text-xl">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for burgers, pizza, sushi..."
                  className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FILTERS + GRID ============ */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-6">
          {/* Category pills */}
          <div className="scrollbar-hide -mx-6 mb-8 flex gap-3 overflow-x-auto px-6 pb-2">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`group flex shrink-0 items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition ${
                    active
                      ? "border-orange-500 bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/30"
                      : "border-white/10 bg-white/5 hover:border-orange-500/50 hover:bg-white/10"
                  }`}
                >
                  <span className="text-lg transition group-hover:scale-110">
                    {cat.icon}
                  </span>
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Toolbar */}
          <div className="mb-10 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span className="font-semibold text-white">
                {filtered.length}
              </span>{" "}
              dishes found
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setOnlyVeg(!onlyVeg)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  onlyVeg
                    ? "border-green-500 bg-green-500/20 text-green-300"
                    : "border-white/10 hover:bg-white/10"
                }`}
              >
                <span className="text-base">🌱</span> Veg Only
              </button>

              <div className="flex items-center gap-3 rounded-full border border-white/10 px-4 py-2 text-sm">
                <span className="text-gray-400">Max</span>
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-white/20 accent-orange-500"
                />
                <span className="w-20 font-bold text-orange-400">
                  {formatPKR(maxPrice)}
                </span>
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="cursor-pointer appearance-none rounded-full border border-white/10 bg-black/60 px-5 py-2 pr-10 text-sm font-medium text-white outline-none transition hover:bg-white/10"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Top Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  ▼
                </span>
              </div>
            </div>
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-16 text-center">
              <div className="text-6xl">🍽️</div>
              <h3 className="mt-4 text-2xl font-bold">No dishes found</h3>
              <p className="mt-2 text-gray-400">
                Try adjusting your filters or search term.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setSearch("");
                  setOnlyVeg(false);
                  setMaxPrice(3000);
                }}
                className="mt-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-semibold transition hover:scale-105"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((dish, i) => (
              <div
                key={dish.id}
                onClick={() => setSelectedDish(dish)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent transition-all duration-300 hover:-translate-y-2 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/20"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={dish.img}
                    alt={dish.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 text-xs font-bold shadow-lg">
                    {dish.tags[0]}
                  </span>

                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur transition hover:bg-red-500 hover:scale-110"
                  >
                    ♡
                  </button>

                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="rounded-full bg-black/60 px-3 py-1 text-xs backdrop-blur">
                      ⏱ {dish.time}
                    </span>
                    {dish.spicy && (
                      <span className="rounded-full bg-red-500/80 px-2 py-1 text-xs backdrop-blur">
                        🌶️
                      </span>
                    )}
                    {dish.veg && (
                      <span className="rounded-full bg-green-500/80 px-2 py-1 text-xs backdrop-blur">
                        🌱
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold leading-tight">
                      {dish.name}
                    </h3>
                    <div className="flex shrink-0 items-center gap-1 text-sm">
                      <span className="text-yellow-400">★</span>
                      <span className="font-semibold">{dish.rating}</span>
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                    {dish.desc}
                  </p>

                  <div className="mt-3 text-xs text-gray-500">
                    {dish.reviews} reviews
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-orange-400">
                          {formatPKR(dish.price)}
                        </span>
                      </div>
                      {dish.oldPrice && (
                        <span className="text-xs text-gray-500 line-through">
                          {formatPKR(dish.oldPrice)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => addToCart(dish.id, e)}
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold transition hover:scale-110 ${
                        cart.includes(dish.id)
                          ? "bg-green-500 shadow-lg shadow-green-500/30"
                          : "bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/30"
                      }`}
                      aria-label="Add to cart"
                    >
                      {cart.includes(dish.id) ? "✓" : "+"}
                    </button>
                  </div>
                </div>

                <div className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition group-hover:opacity-100">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/10 to-red-500/10" />
                </div>
              </div>
            ))}
          </div>

          {filtered.length > 0 && (
            <div className="mt-16 text-center">
              <button className="group relative inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-4 font-semibold backdrop-blur transition hover:bg-white/10">
                Load More Dishes
                <span className="transition-transform group-hover:translate-y-0.5">
                  ↓
                </span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ============ PRODUCT DETAIL MODAL ============ */}
      {selectedDish && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedDish(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]" />

          {/* Modal */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#111] shadow-2xl animate-[scaleIn_0.25s_ease-out]"
          >
            {/* Close */}
            <button
              onClick={() => setSelectedDish(null)}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-lg backdrop-blur transition hover:bg-red-500 hover:scale-110"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="grid max-h-[92vh] grid-cols-1 overflow-y-auto lg:grid-cols-2 lg:overflow-hidden">
              {/* Left — Image */}
              <div className="relative h-72 lg:h-auto">
                <img
                  src={selectedDish.img}
                  alt={selectedDish.name}
                  className="h-full w-full object-cover lg:absolute lg:inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#111]/80" />

                {/* Tags on image */}
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  {selectedDish.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 text-xs font-bold shadow-lg"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Bottom info overlay */}
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-black/60 px-3 py-1.5 text-xs backdrop-blur">
                    ⏱ {selectedDish.time}
                  </span>
                  <span className="rounded-full bg-black/60 px-3 py-1.5 text-xs backdrop-blur">
                    🔥 {selectedDish.calories} cal
                  </span>
                  <span className="rounded-full bg-black/60 px-3 py-1.5 text-xs backdrop-blur">
                    👥 {selectedDish.serves}
                  </span>
                </div>
              </div>

              {/* Right — Details */}
              <div className="overflow-y-auto p-6 sm:p-8 lg:max-h-[92vh]">
                {/* Category + rating */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-widest text-orange-400">
                    {selectedDish.category}
                  </span>
                  <div className="flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-sm">
                    <span className="text-yellow-400">★</span>
                    <span className="font-bold">{selectedDish.rating}</span>
                    <span className="text-gray-400">
                      ({selectedDish.reviews})
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
                  {selectedDish.name}
                </h2>

                {/* Badges */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedDish.popular && (
                    <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-300">
                      🔥 Popular
                    </span>
                  )}
                  {selectedDish.spicy && (
                    <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-300">
                      🌶️ Spicy
                    </span>
                  )}
                  {selectedDish.veg && (
                    <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-300">
                      🌱 Vegetarian
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="text-4xl font-black text-orange-400">
                    {formatPKR(selectedDish.price)}
                  </span>
                  {selectedDish.oldPrice && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        {formatPKR(selectedDish.oldPrice)}
                      </span>
                      <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-bold text-green-300">
                        Save{" "}
                        {formatPKR(selectedDish.oldPrice - selectedDish.price)}
                      </span>
                    </>
                  )}
                </div>

                {/* Description */}
                <div className="mt-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                    Description
                  </h3>
                  <p className="mt-2 text-gray-300 leading-relaxed">
                    {selectedDish.longDesc}
                  </p>
                </div>

                {/* Ingredients */}
                <div className="mt-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                    Ingredients
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedDish.ingredients.map((ing) => (
                      <span
                        key={ing}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quantity + Add to cart */}
                <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold transition hover:bg-white/10"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-lg font-bold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold transition hover:bg-white/10"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      addMultipleToCart(selectedDish.id, quantity)
                    }
                    className="group flex flex-1 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 font-bold shadow-2xl shadow-orange-500/30 transition hover:scale-[1.02]"
                  >
                    <span>🛒 Add to Cart</span>
                    <span className="h-4 w-px bg-white/30" />
                    <span>{formatPKR(selectedDish.price * quantity)}</span>
                  </button>
                </div>

                {/* Extras */}
                <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-2xl">🚚</div>
                    <div className="mt-1 text-gray-400">Free delivery</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-2xl">🔄</div>
                    <div className="mt-1 text-gray-400">Easy returns</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-2xl">✅</div>
                    <div className="mt-1 text-gray-400">Fresh guarantee</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ CART FLOATING BUTTON ============ */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 animate-[slideUp_0.3s_ease-out]">
          <button className="group flex items-center gap-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 font-bold shadow-2xl shadow-orange-500/50 transition hover:scale-105">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/30">
              🛒
            </span>
            <span>{cart.length} items</span>
            <span className="h-4 w-px bg-white/30" />
            <span>{formatPKR(cartTotal)}</span>
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      )}
    </main>
  );
}