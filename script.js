// Global Variables
let currentUser = null;
let cart = [];
let wishlist = [];
let products = [];
let dailyOffers = [];
let currentOfferIndex = 0;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadStoredData();
    generateDailyOffers();
    generateProducts();
    setupEventListeners();
    updateUI();
    startOfferCountdown();
    showNewsletterPopup();
    setupSearch();
}

// Load data from localStorage
function loadStoredData() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
    }
    
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
    
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
        wishlist = JSON.parse(storedWishlist);
    }
}

// Generate 365 daily offers
function generateDailyOffers() {
    dailyOffers = [
        "Day 1: 20% Off Wireless Earbuds - Start the year with premium sound!",
        "Day 2: Free Shipping on Orders Over $50 - No delivery fees!",
        "Day 3: Buy 2 Get 1 Free on Sports Earbuds - Perfect for workouts!",
        "Day 4: 30% Off Noise-Cancelling Collection - Block out the world!",
        "Day 5: Flash Sale: Premium Earbuds $99 (Was $149) - Limited time!",
        "Day 6: Free Wireless Charging Case with Any Purchase Over $75",
        "Day 7: Weekend Special: 25% Off Everything - Don't miss out!",
        "Day 8: Student Discount: Extra 15% Off with Valid ID",
        "Day 9: Trade-In Program: $30 Off When You Trade Your Old Earbuds",
        "Day 10: Bundle Deal: Earbuds + Case + Cable for $89",
        "Day 11: Early Bird Special: 40% Off First 50 Orders Today",
        "Day 12: Loyalty Reward: Free Premium Upgrade for Returning Customers",
        "Day 13: Lucky 13: 13% Off + Free Lucky Charm Keychain",
        "Day 14: Valentine's Special: Buy One, Gift One at 50% Off",
        "Day 15: Mid-Month Madness: Flash 3-Hour Sale - 35% Off",
        "Day 16: Waterproof Collection: 20% Off + Free Swim Pouch",
        "Day 17: Referral Bonus: $20 Off When You Refer a Friend",
        "Day 18: Gaming Earbuds: 25% Off + Free Gaming Mouse Pad",
        "Day 19: Eco-Friendly Friday: 15% Off Sustainable Audio Products",
        "Day 20: Double Points Day: Earn 2x Rewards on Every Purchase",
        "Day 21: Fitness Bundle: Earbuds + Armband + Towel for $79",
        "Day 22: Two's Company: 22% Off When You Buy 2 Items",
        "Day 23: Premium Plus: Free 2-Year Extended Warranty",
        "Day 24: Flash Friday: 4-Hour Lightning Sale - 45% Off",
        "Day 25: Quarter Century: 25% Off + Free Vintage Poster",
        "Day 26: Social Media Special: 20% Off When You Follow Us",
        "Day 27: Mystery Box: Random Premium Earbuds for $59",
        "Day 28: Final Days: 30% Off Select Models - While Stocks Last",
        "Day 29: Leap Day Bonus: Extra Day, Extra 29% Off Everything",
        "Day 30: Month-End Clearance: Up to 50% Off Discontinued Models",
        "Day 31: New Month, New Deals: 31% Off New Arrivals",
        "Day 32: February Fresh: 20% Off + Free Air Freshener",
        "Day 33: Double Trouble: Buy One Premium, Get Basic Free",
        "Day 34: Love is in the Air: Couple's Pack - 2 Earbuds for $99",
        "Day 35: President's Day: 35% Off Patriotic Red, White & Blue Models",
        "Day 36: Spring Preview: 25% Off Pastel Color Collection",
        "Day 37: Lucky Number: 37% Off + Free Lucky Bamboo Plant",
        "Day 38: Women's History: 38% Off Pink & Rose Gold Collection",
        "Day 39: Almost 40: 39% Off Everything - One Day Only",
        "Day 40: Fabulous 40: Premium Earbuds for $40 (Limited Quantity)",
        "Day 41: Spring Training: 25% Off Sports Collection",
        "Day 42: The Answer: 42% Off Everything (Hitchhiker's Guide Special)",
        "Day 43: Hump Day: 30% Off + Free Camel Keychain",
        "Day 44: Double Vision: Buy 2, Save 44%",
        "Day 45: Halfway There: 45% Off Mid-Range Collection",
        "Day 46: Spring Forward: 25% Off + Free Spring Cleaning Kit",
        "Day 47: Lucky 47: 20% Off + Free Lottery Ticket",
        "Day 48: Four Dozen: 48 Hours Only - 30% Off Everything",
        "Day 49: Gold Rush: 49% Off Gold-Colored Earbuds",
        "Day 50: Half Century: 50% Off Select Premium Models",
        "Day 51: Area 51: 30% Off Space Gray Collection + Free UFO Sticker",
        "Day 52: Deck of Cards: 52% Off + Free Playing Cards",
        "Day 53: High Five + 3: 25% Off + Free High-Five Emoji Sticker",
        "Day 54: Studio 54: 35% Off Retro Collection + Free Disco Ball Keychain",
        "Day 55: Double Nickels: 55% Off Silver Collection",
        "Day 56: Lucky 56: 30% Off + Free Fortune Cookie",
        "Day 57: Heinz 57: 25% Off + Free Ketchup Packet (Just Kidding - 25% Off Red Models)",
        "Day 58: Almost 60: 40% Off Senior-Friendly Large Button Models",
        "Day 59: One More: 35% Off + Free 'One More Song' Playlist",
        "Day 60: Diamond Jubilee: 60% Off Diamond White Collection",
        "Day 61: Spring Cleaning: 30% Off + Free Cleaning Kit",
        "Day 62: Leap Forward: 25% Off Future-Tech Collection",
        "Day 63: Lucky 63: 20% Off + Free Rabbit's Foot Keychain",
        "Day 64: Computer Geek: 32% Off (64-bit Special) Tech Collection",
        "Day 65: Retirement Ready: 35% Off Comfort-Fit Collection",
        "Day 66: Route 66: 40% Off Road Trip Essentials Bundle",
        "Day 67: Lucky 67: 25% Off + Free Lucky Penny",
        "Day 68: Almost 70: 30% Off Classic Collection",
        "Day 69: Summer Preview: 35% Off Bright Summer Colors",
        "Day 70: Magnificent 70: 45% Off Vintage Collection",
        "Day 71: Prime Time: 30% Off + Free Prime Number Fact Sheet",
        "Day 72: Six Dozen: 40% Off Bulk Orders (6+ Items)",
        "Day 73: Lucky 73: 25% Off + Free Four-Leaf Clover Sticker",
        "Day 74: Independence Prep: 30% Off Red, White & Blue Collection",
        "Day 75: Three Quarters: 75% Off One Special Model (First Come, First Served)",
        "Day 76: Spirit of '76: 35% Off Patriotic Collection + Free Flag Pin",
        "Day 77: Lucky Sevens: 40% Off + Free Slot Machine Keychain",
        "Day 78: Record Player: 30% Off Vinyl-Inspired Collection",
        "Day 79: Almost 80: 35% Off Retro Collection",
        "Day 80: Around the World: 25% Off + Free World Map Poster",
        "Day 81: Square Root: 30% Off Mathematical Collection (9x9=81)",
        "Day 82: Lucky 82: 20% Off + Free Magic 8-Ball Keychain",
        "Day 83: Prime Number: 35% Off + Free Prime Rib Recipe (Just Kidding - 35% Off Prime Collection)",
        "Day 84: Seven Dozen: 40% Off Weekly Planner Bundle",
        "Day 85: Speed Limit: 30% Off Fast-Charging Collection",
        "Day 86: Lucky 86: 25% Off + Free Horseshoe Keychain",
        "Day 87: Almost 90: 35% Off Senior Collection",
        "Day 88: Double Infinity: 45% Off Endless Play Collection",
        "Day 89: Almost 90: 40% Off Classic Collection",
        "Day 90: Right Angle: 30% Off Perfect Fit Collection",
        "Day 91: Spring Forward: 35% Off Spring Collection",
        "Day 92: Leap Year: 25% Off + Free Calendar",
        "Day 93: Lucky 93: 30% Off + Free Lucky Charm Bracelet",
        "Day 94: Almost Century: 40% Off Premium Collection",
        "Day 95: High Five x19: 35% Off Celebration Collection",
        "Day 96: Almost 100: 45% Off Near-Perfect Collection",
        "Day 97: Prime Time: 30% Off + Free Prime Number Chart",
        "Day 98: Almost There: 40% Off Finish Line Collection",
        "Day 99: So Close: 50% Off Almost Perfect Collection",
        "Day 100: Century Mark: 100% Satisfaction Guarantee + 30% Off Everything",
        // Continue with more creative offers...
        "Day 101: New Century: 35% Off Next-Gen Collection",
        "Day 102: Dalmatians: 25% Off Black & White Spotted Collection",
        "Day 103: Lucky 103: 30% Off + Free Lottery Ticket",
        "Day 104: Marathon: 26.2% Off Running Collection (104/4 = 26)",
        "Day 105: High Five x21: 35% Off Celebration Collection",
        "Day 106: Lucky 106: 25% Off + Free Lucky Coin",
        "Day 107: Prime Number: 30% Off Mathematical Collection",
        "Day 108: Sacred Number: 35% Off Meditation Collection",
        "Day 109: Prime Time: 25% Off + Free Prime Steak Sauce (JK - Prime Collection)",
        "Day 110: Binary: 30% Off Digital Collection (110 in binary = 6)",
        "Day 111: Triple Ones: 40% Off Unity Collection",
        "Day 112: Emergency: 25% Off Safety Collection (Like 911 but 112)",
        "Day 113: Baker's Dozen Squared: 35% Off Bakery-Inspired Collection",
        "Day 114: Double 57: 30% Off Heinz Collection (Just Kidding - Ketchup Red Models)",
        "Day 115: Speed Limit: 25% Off Fast Collection",
        "Day 116: Lucky 116: 30% Off + Free Wishbone Keychain",
        "Day 117: Master Number: 35% Off Spiritual Collection",
        "Day 118: Gold Standard: 40% Off Gold Collection (118 = Gold's atomic number)",
        "Day 119: Almost 120: 35% Off Near-Perfect Collection",
        "Day 120: Perfect Circle: 30% Off Round Collection (120 degrees in triangle)",
        // Adding more offers to reach 365...
        "Day 121: Square Root: 35% Off Perfect Square Collection (11²=121)",
        "Day 122: Palindrome: 25% Off Reversible Collection",
        "Day 123: Easy as ABC: 30% Off Beginner Collection",
        "Day 124: Lucky 124: 25% Off + Free Four-Leaf Clover",
        "Day 125: Perfect Cube: 40% Off Cubic Collection (5³=125)",
        "Day 126: Half Year: 35% Off Mid-Year Collection",
        "Day 127: Prime Number: 30% Off + Free Prime Rib Recipe Card",
        "Day 128: Power of 2: 35% Off Tech Collection (2⁷=128)",
        "Day 129: Lucky 129: 25% Off + Free Lucky Rabbit's Foot",
        "Day 130: Halfway Plus: 30% Off Extended Collection",
        "Day 131: Prime Time: 35% Off Mathematical Collection",
        "Day 132: Dozen Squared: 25% Off Baker's Collection (12²=144, close enough)",
        "Day 133: Lucky 133: 30% Off + Free Lucky Penny Collection",
        "Day 134: Even Steven: 25% Off Balanced Collection",
        "Day 135: Perfect Triangle: 35% Off Geometric Collection",
        "Day 136: Lucky 136: 30% Off + Free Horseshoe Collection",
        "Day 137: Fine Structure: 40% Off Physics Collection (1/137 ≈ fine structure constant)",
        "Day 138: Lucky 138: 25% Off + Free Magic 8-Ball",
        "Day 139: Prime Number: 30% Off + Free Prime Number Poster",
        "Day 140: Double 70: 35% Off Vintage Collection",
        "Day 141: Palindrome: 25% Off Symmetric Collection",
        "Day 142: Lucky 142: 30% Off + Free Lucky Dice",
        "Day 143: Almost Gross: 35% Off Near-Perfect Collection (144=gross)",
        "Day 144: Gross: 40% Off Bulk Collection (144 items = 1 gross)",
        "Day 145: Lucky 145: 25% Off + Free Lucky Charm Necklace",
        "Day 146: Lucky 146: 30% Off + Free Wishbone",
        "Day 147: Three Sevens: 35% Off Triple Lucky Collection",
        "Day 148: Lucky 148: 25% Off + Free Fortune Cookie Collection",
        "Day 149: Prime Number: 30% Off Mathematical Collection",
        "Day 150: Sesquicentennial: 45% Off 150th Anniversary Collection",
        "Day 151: Prime Time: 30% Off + Free Prime Steak Seasoning",
        "Day 152: Lucky 152: 25% Off + Free Lucky Bracelet",
        "Day 153: Triangle Number: 35% Off Geometric Collection",
        "Day 154: Double 77: 30% Off Double Lucky Collection",
        "Day 155: Speed Limit: 25% Off Fast Lane Collection",
        "Day 156: Dozen Plus: 30% Off Baker's Extended Collection",
        "Day 157: Prime Number: 35% Off Mathematical Collection",
        "Day 158: Lucky 158: 25% Off + Free Lucky Ring",
        "Day 159: Almost 160: 30% Off Near-Perfect Collection",
        "Day 160: Perfect 160: 35% Off Ideal Collection",
        "Day 161: Palindrome: 25% Off Reversible Collection",
        "Day 162: Double 81: 30% Off Double Square Collection",
        "Day 163: Prime Number: 35% Off Mathematical Collection",
        "Day 164: Lucky 164: 25% Off + Free Lucky Anklet",
        "Day 165: Half Year Plus: 30% Off Extended Mid-Year Collection",
        "Day 166: Lucky 166: 35% Off + Free Lucky Earrings",
        "Day 167: Prime Number: 30% Off Mathematical Collection",
        "Day 168: Perfect Week: 25% Off Weekly Collection (24×7=168 hours)",
        "Day 169: Perfect Square: 40% Off Square Collection (13²=169)",
        "Day 170: Lucky 170: 30% Off + Free Lucky Necklace Set",
        "Day 171: Triangle Number: 35% Off Geometric Collection",
        "Day 172: Lucky 172: 25% Off + Free Lucky Pin Collection",
        "Day 173: Prime Number: 30% Off Mathematical Collection",
        "Day 174: Lucky 174: 35% Off + Free Lucky Keychain Set",
        "Day 175: Quarter Millennium: 40% Off 1/4 Century Collection",
        "Day 176: Lucky 176: 25% Off + Free Lucky Bookmark",
        "Day 177: Triple Lucky: 35% Off Super Lucky Collection",
        "Day 178: Lucky 178: 30% Off + Free Lucky Wallet",
        "Day 179: Prime Number: 35% Off Mathematical Collection",
        "Day 180: Half Circle: 40% Off Semicircle Collection (180 degrees)",
        "Day 181: Prime Number: 30% Off Mathematical Collection",
        "Day 182: Half Year: 35% Off Mid-Year Finale Collection",
        "Day 183: Lucky 183: 25% Off + Free Lucky Phone Case",
        "Day 184: Lucky 184: 30% Off + Free Lucky Mouse Pad",
        "Day 185: Lucky 185: 35% Off + Free Lucky Sticker Pack",
        "Day 186: Lucky 186: 25% Off + Free Lucky Magnet Set",
        "Day 187: Prime Number: 30% Off Mathematical Collection",
        "Day 188: Lucky 188: 35% Off + Free Lucky Pen Set",
        "Day 189: Triangle Number: 25% Off Geometric Collection",
        "Day 190: Lucky 190: 30% Off + Free Lucky Notebook",
        "Day 191: Prime Number: 35% Off Mathematical Collection",
        "Day 192: Power of 2: 40% Off Tech Collection (2⁶×3=192)",
        "Day 193: Prime Number: 30% Off Mathematical Collection",
        "Day 194: Lucky 194: 25% Off + Free Lucky Calendar",
        "Day 195: Lucky 195: 35% Off + Free Lucky Planner",
        "Day 196: Perfect Square: 40% Off Square Collection (14²=196)",
        "Day 197: Prime Number: 30% Off Mathematical Collection",
        "Day 198: Double 99: 35% Off Double Almost Perfect Collection",
        "Day 199: Prime Number: 25% Off Mathematical Collection",
        "Day 200: Bicentennial: 50% Off 200th Day Celebration Collection",
        "Day 201: New Century Plus: 35% Off Future Collection",
        "Day 202: Palindrome: 30% Off Symmetric Collection",
        "Day 203: Lucky 203: 25% Off + Free Lucky Charm Collection",
        "Day 204: Double 102: 30% Off Double Dalmatian Collection",
        "Day 205: Lucky 205: 35% Off + Free Lucky Ornament",
        "Day 206: Lucky 206: 25% Off + Free Lucky Decoration",
        "Day 207: Lucky 207: 30% Off + Free Lucky Figurine",
        "Day 208: Lucky 208: 35% Off + Free Lucky Sculpture",
        "Day 209: Prime Number: 25% Off Mathematical Collection",
        "Day 210: Lucky 210: 30% Off + Free Lucky Art Print",
        "Day 211: Prime Number: 35% Off Mathematical Collection",
        "Day 212: Lucky 212: 25% Off + Free Lucky Poster",
        "Day 213: Lucky 213: 30% Off + Free Lucky Canvas",
        "Day 214: Valentine's Prep: 35% Off Romance Collection",
        "Day 215: Lucky 215: 25% Off + Free Lucky Frame",
        "Day 216: Perfect Cube: 40% Off Cubic Collection (6³=216)",
        "Day 217: Lucky 217: 30% Off + Free Lucky Album",
        "Day 218: Lucky 218: 35% Off + Free Lucky Scrapbook",
        "Day 219: Lucky 219: 25% Off + Free Lucky Journal",
        "Day 220: Lucky 220: 30% Off + Free Lucky Diary",
        "Day 221: Lucky 221: 35% Off + Free Lucky Memory Book",
        "Day 222: Triple Twos: 40% Off Triple Collection",
        "Day 223: Prime Number: 30% Off Mathematical Collection",
        "Day 224: Lucky 224: 25% Off + Free Lucky Photo Album",
        "Day 225: Perfect Square: 35% Off Square Collection (15²=225)",
        "Day 226: Lucky 226: 30% Off + Free Lucky Picture Frame",
        "Day 227: Prime Number: 35% Off Mathematical Collection",
        "Day 228: Lucky 228: 25% Off + Free Lucky Display Case",
        "Day 229: Prime Number: 30% Off Mathematical Collection",
        "Day 230: Lucky 230: 35% Off + Free Lucky Shadow Box",
        "Day 231: Triangle Number: 25% Off Geometric Collection",
        "Day 232: Lucky 232: 30% Off + Free Lucky Trophy",
        "Day 233: Prime Number: 35% Off Mathematical Collection",
        "Day 234: Lucky 234: 25% Off + Free Lucky Medal",
        "Day 235: Lucky 235: 30% Off + Free Lucky Badge",
        "Day 236: Lucky 236: 35% Off + Free Lucky Certificate",
        "Day 237: Lucky 237: 25% Off + Free Lucky Diploma",
        "Day 238: Double 119: 30% Off Double Master Collection",
        "Day 239: Prime Number: 35% Off Mathematical Collection",
        "Day 240: Lucky 240: 25% Off + Free Lucky Achievement",
        "Day 241: Prime Number: 30% Off Mathematical Collection",
        "Day 242: Palindrome: 35% Off Symmetric Collection",
        "Day 243: Perfect Cube: 40% Off Cubic Collection (3⁵=243)",
        "Day 244: Lucky 244: 25% Off + Free Lucky Ribbon",
        "Day 245: Lucky 245: 30% Off + Free Lucky Rosette",
        "Day 246: Lucky 246: 35% Off + Free Lucky Crown",
        "Day 247: Lucky 247: 25% Off + Free Lucky Tiara",
        "Day 248: Lucky 248: 30% Off + Free Lucky Scepter",
        "Day 249: Lucky 249: 35% Off + Free Lucky Wand",
        "Day 250: Quarter Millennium: 45% Off 1/4 Millennium Collection",
        "Day 251: Prime Number: 30% Off Mathematical Collection",
        "Day 252: Lucky 252: 25% Off + Free Lucky Staff",
        "Day 253: Triangle Number: 35% Off Geometric Collection",
        "Day 254: Lucky 254: 30% Off + Free Lucky Baton",
        "Day 255: Perfect Binary: 40% Off Digital Collection (2⁸-1=255)",
        "Day 256: Power of 2: 45% Off Tech Collection (2⁸=256)",
        "Day 257: Prime Number: 30% Off Mathematical Collection",
        "Day 258: Lucky 258: 25% Off + Free Lucky Torch",
        "Day 259: Prime Number: 35% Off Mathematical Collection",
        "Day 260: Lucky 260: 30% Off + Free Lucky Flame",
        "Day 261: Triangle Number: 25% Off Geometric Collection",
        "Day 262: Lucky 262: 35% Off + Free Lucky Candle",
        "Day 263: Prime Number: 30% Off Mathematical Collection",
        "Day 264: Lucky 264: 25% Off + Free Lucky Lantern",
        "Day 265: Lucky 265: 30% Off + Free Lucky Lamp",
        "Day 266: Lucky 266: 35% Off + Free Lucky Light",
        "Day 267: Lucky 267: 25% Off + Free Lucky Bulb",
        "Day 268: Lucky 268: 30% Off + Free Lucky Beacon",
        "Day 269: Prime Number: 35% Off Mathematical Collection",
        "Day 270: Lucky 270: 25% Off + Free Lucky Signal",
        "Day 271: Prime Number: 30% Off Mathematical Collection",
        "Day 272: Lucky 272: 35% Off + Free Lucky Guide",
        "Day 273: Lucky 273: 25% Off + Free Lucky Compass",
        "Day 274: Lucky 274: 30% Off + Free Lucky Map",
        "Day 275: Lucky 275: 35% Off + Free Lucky GPS",
        "Day 276: Triangle Number: 25% Off Geometric Collection",
        "Day 277: Prime Number: 30% Off Mathematical Collection",
        "Day 278: Lucky 278: 35% Off + Free Lucky Navigator",
        "Day 279: Lucky 279: 25% Off + Free Lucky Explorer",
        "Day 280: Lucky 280: 30% Off + Free Lucky Adventure",
        "Day 281: Prime Number: 35% Off Mathematical Collection",
        "Day 282: Lucky 282: 25% Off + Free Lucky Journey",
        "Day 283: Prime Number: 30% Off Mathematical Collection",
        "Day 284: Lucky 284: 35% Off + Free Lucky Quest",
        "Day 285: Lucky 285: 25% Off + Free Lucky Mission",
        "Day 286: Lucky 286: 30% Off + Free Lucky Expedition",
        "Day 287: Prime Number: 35% Off Mathematical Collection",
        "Day 288: Double 144: 40% Off Double Gross Collection",
        "Day 289: Perfect Square: 45% Off Square Collection (17²=289)",
        "Day 290: Lucky 290: 30% Off + Free Lucky Safari",
        "Day 291: Triangle Number: 25% Off Geometric Collection",
        "Day 292: Lucky 292: 35% Off + Free Lucky Trek",
        "Day 293: Prime Number: 30% Off Mathematical Collection",
        "Day 294: Lucky 294: 25% Off + Free Lucky Hike",
        "Day 295: Lucky 295: 35% Off + Free Lucky Trail",
        "Day 296: Lucky 296: 30% Off + Free Lucky Path",
        "Day 297: Lucky 297: 25% Off + Free Lucky Route",
        "Day 298: Lucky 298: 35% Off + Free Lucky Way",
        "Day 299: Prime Number: 30% Off Mathematical Collection",
        "Day 300: Triple Century: 50% Off 300th Day Spectacular Collection",
        "Day 301: Prime Number: 35% Off Mathematical Collection",
        "Day 302: Lucky 302: 25% Off + Free Lucky Direction",
        "Day 303: Palindrome: 30% Off Symmetric Collection",
        "Day 304: Lucky 304: 35% Off + Free Lucky Course",
        "Day 305: Lucky 305: 25% Off + Free Lucky Track",
        "Day 306: Triangle Number: 30% Off Geometric Collection",
        "Day 307: Prime Number: 35% Off Mathematical Collection",
        "Day 308: Lucky 308: 25% Off + Free Lucky Lane",
        "Day 309: Lucky 309: 30% Off + Free Lucky Street",
        "Day 310: Lucky 310: 35% Off + Free Lucky Avenue",
        "Day 311: Prime Number: 25% Off Mathematical Collection",
        "Day 312: Lucky 312: 30% Off + Free Lucky Boulevard",
        "Day 313: Prime Number: 35% Off Mathematical Collection",
        "Day 314: Pi Day Prep: 40% Off Mathematical Collection (3.14...)",
        "Day 315: Lucky 315: 25% Off + Free Lucky Highway",
        "Day 316: Lucky 316: 30% Off + Free Lucky Freeway",
        "Day 317: Prime Number: 35% Off Mathematical Collection",
        "Day 318: Lucky 318: 25% Off + Free Lucky Expressway",
        "Day 319: Lucky 319: 30% Off + Free Lucky Parkway",
        "Day 320: Lucky 320: 35% Off + Free Lucky Turnpike",
        "Day 321: Triangle Number: 25% Off Geometric Collection",
        "Day 322: Lucky 322: 30% Off + Free Lucky Interstate",
        "Day 323: Prime Number: 35% Off Mathematical Collection",
        "Day 324: Perfect Square: 40% Off Square Collection (18²=324)",
        "Day 325: Lucky 325: 25% Off + Free Lucky Bridge",
        "Day 326: Lucky 326: 30% Off + Free Lucky Tunnel",
        "Day 327: Lucky 327: 35% Off + Free Lucky Overpass",
        "Day 328: Lucky 328: 25% Off + Free Lucky Underpass",
        "Day 329: Prime Number: 30% Off Mathematical Collection",
        "Day 330: Triangle Number: 35% Off Geometric Collection",
        "Day 331: Prime Number: 25% Off Mathematical Collection",
        "Day 332: Lucky 332: 30% Off + Free Lucky Junction",
        "Day 333: Triple Threes: 45% Off Triple Collection",
        "Day 334: Lucky 334: 25% Off + Free Lucky Intersection",
        "Day 335: Lucky 335: 30% Off + Free Lucky Crossroads",
        "Day 336: Triangle Number: 35% Off Geometric Collection",
        "Day 337: Prime Number: 25% Off Mathematical Collection",
        "Day 338: Lucky 338: 30% Off + Free Lucky Corner",
        "Day 339: Lucky 339: 35% Off + Free Lucky Turn",
        "Day 340: Lucky 340: 25% Off + Free Lucky Curve",
        "Day 341: Prime Number: 30% Off Mathematical Collection",
        "Day 342: Lucky 342: 35% Off + Free Lucky Bend",
        "Day 343: Perfect Cube: 40% Off Cubic Collection (7³=343)",
        "Day 344: Lucky 344: 25% Off + Free Lucky Loop",
        "Day 345: Triangle Number: 30% Off Geometric Collection",
        "Day 346: Lucky 346: 35% Off + Free Lucky Circle",
        "Day 347: Prime Number: 25% Off Mathematical Collection",
        "Day 348: Lucky 348: 30% Off + Free Lucky Roundabout",
        "Day 349: Prime Number: 35% Off Mathematical Collection",
        "Day 350: Lucky 350: 25% Off + Free Lucky Spiral",
        "Day 351: Triangle Number: 30% Off Geometric Collection",
        "Day 352: Lucky 352: 35% Off + Free Lucky Helix",
        "Day 353: Prime Number: 25% Off Mathematical Collection",
        "Day 354: Lucky 354: 30% Off + Free Lucky Twist",
        "Day 355: Triangle Number: 35% Off Geometric Collection",
        "Day 356: Lucky 356: 25% Off + Free Lucky Coil",
        "Day 357: Triangle Number: 30% Off Geometric Collection",
        "Day 358: Lucky 358: 35% Off + Free Lucky Spring",
        "Day 359: Prime Number: 25% Off Mathematical Collection",
        "Day 360: Full Circle: 50% Off Complete Circle Collection (360 degrees)",
        "Day 361: Perfect Square: 40% Off Square Collection (19²=361)",
        "Day 362: Lucky 362: 30% Off + Free Lucky Cycle",
        "Day 363: Triangle Number: 35% Off Geometric Collection",
        "Day 364: Lucky 364: 25% Off + Free Lucky Revolution",
        "Day 365: Year Complete: 65% Off Grand Finale Collection - Thank You for a Great Year!"
    ];
    
    // Calculate current day of year
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    currentOfferIndex = Math.floor(diff / oneDay) - 1; // -1 because array is 0-indexed
    
    // Ensure we don't go out of bounds
    if (currentOfferIndex >= dailyOffers.length) {
        currentOfferIndex = dailyOffers.length - 1;
    }
    if (currentOfferIndex < 0) {
        currentOfferIndex = 0;
    }
}

// Generate sample products
function generateProducts() {
    products = [
        {
            id: 1,
            name: "AirPods Pro Max",
            price: 149.99,
            originalPrice: 199.99,
            image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=300&fit=crop",
            category: "Premium",
            description: "Premium wireless earbuds with active noise cancellation",
            rating: 4.8,
            reviews: 1250,
            features: ["Active Noise Cancellation", "20h Battery Life", "Wireless Charging", "IPX4 Water Resistant"],
            badge: "Best Seller"
        },
        {
            id: 2,
            name: "SportBuds Wireless",
            price: 79.99,
            originalPrice: 99.99,
            image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop",
            category: "Sports",
            description: "Perfect for workouts with sweat-proof design",
            rating: 4.6,
            reviews: 890,
            features: ["Sweat Proof", "12h Battery", "Secure Fit", "Quick Charge"],
            badge: "Sale"
        },
        {
            id: 3,
            name: "Studio Sound Pro",
            price: 199.99,
            originalPrice: 249.99,
            image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop",
            category: "Premium",
            description: "Studio-quality sound for audiophiles",
            rating: 4.9,
            reviews: 567,
            features: ["Hi-Res Audio", "30h Battery", "Premium Materials", "Custom EQ"],
            badge: "New"
        },
        {
            id: 4,
            name: "Budget Beats",
            price: 39.99,
            originalPrice: 59.99,
            image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop",
            category: "Budget",
            description: "Great sound quality at an affordable price",
            rating: 4.3,
            reviews: 2100,
            features: ["Good Sound", "8h Battery", "Comfortable", "Affordable"],
            badge: "Sale"
        },
        {
            id: 5,
            name: "Noise Canceller Elite",
            price: 179.99,
            originalPrice: 219.99,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
            category: "Noise-Cancelling",
            description: "Industry-leading noise cancellation technology",
            rating: 4.7,
            reviews: 743,
            features: ["Advanced ANC", "25h Battery", "Quick Charge", "Premium Build"],
            badge: "Best Seller"
        },
        {
            id: 6,
            name: "Gaming Pro X",
            price: 129.99,
            originalPrice: 159.99,
            image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop",
            category: "Gaming",
            description: "Low-latency gaming earbuds with RGB lighting",
            rating: 4.5,
            reviews: 456,
            features: ["Low Latency", "RGB Lighting", "Gaming Mode", "Clear Mic"],
            badge: "New"
        },
        {
            id: 7,
            name: "Travel Companion",
            price: 89.99,
            originalPrice: 119.99,
            image: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=300&h=300&fit=crop",
            category: "Travel",
            description: "Compact design perfect for travelers",
            rating: 4.4,
            reviews: 321,
            features: ["Compact Case", "15h Battery", "Universal Fit", "Travel Pouch"],
            badge: "Sale"
        },
        {
            id: 8,
            name: "Bass Master Pro",
            price: 159.99,
            originalPrice: 189.99,
            image: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=300&h=300&fit=crop",
            category: "Bass",
            description: "Enhanced bass response for music lovers",
            rating: 4.6,
            reviews: 678,
            features: ["Enhanced Bass", "18h Battery", "Custom Drivers", "Premium Feel"],
            badge: "Best Seller"
        },
        {
            id: 9,
            name: "Clear Voice Pro",
            price: 119.99,
            originalPrice: 149.99,
            image: "https://images.unsplash.com/photo-1493020258366-be3ead61c4d8?w=300&h=300&fit=crop",
            category: "Business",
            description: "Crystal clear calls for business professionals",
            rating: 4.5,
            reviews: 234,
            features: ["Clear Calls", "Noise Reduction", "All-Day Comfort", "Professional Design"],
            badge: "New"
        },
        {
            id: 10,
            name: "Eco-Friendly Buds",
            price: 99.99,
            originalPrice: 129.99,
            image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=300&h=300&fit=crop",
            category: "Eco",
            description: "Made from sustainable materials",
            rating: 4.3,
            reviews: 189,
            features: ["Sustainable Materials", "14h Battery", "Recyclable Case", "Eco-Packaging"],
            badge: "Eco"
        },
        {
            id: 11,
            name: "Kids Safe Buds",
            price: 59.99,
            originalPrice: 79.99,
            image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
            category: "Kids",
            description: "Volume-limited earbuds safe for children",
            rating: 4.7,
            reviews: 445,
            features: ["Volume Limited", "Kid-Safe Design", "Durable Build", "Fun Colors"],
            badge: "Safe"
        },
        {
            id: 12,
            name: "Luxury Edition",
            price: 299.99,
            originalPrice: 399.99,
            image: "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=300&h=300&fit=crop",
            category: "Luxury",
            description: "Premium materials with gold accents",
            rating: 4.9,
            reviews: 123,
            features: ["Gold Accents", "Premium Leather", "Audiophile Sound", "Luxury Case"],
            badge: "Luxury"
        }
    ];
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('show');
        });
    }

    // Auth modal
    const authBtn = document.getElementById('auth-btn');
    const authModal = document.getElementById('auth-modal');
    const modalClose = document.getElementById('modal-close');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (authBtn) {
        authBtn.addEventListener('click', () => {
            if (currentUser) {
                toggleUserDropdown();
            } else {
                showAuthModal();
            }
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', hideAuthModal);
    }

    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                hideAuthModal();
            }
        });
    }

    if (showSignup) {
        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            showSignupForm();
        });
    }

    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginForm();
        });
    }

    // Form submissions
    const loginFormElement = document.getElementById('login-form-element');
    const signupFormElement = document.getElementById('signup-form-element');

    if (loginFormElement) {
        loginFormElement.addEventListener('submit', handleLogin);
    }

    if (signupFormElement) {
        signupFormElement.addEventListener('submit', handleSignup);
    }

    // User dropdown
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Newsletter forms
    const newsletterForm = document.getElementById('newsletter-form');
    const popupNewsletterForm = document.getElementById('popup-newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSignup);
    }

    if (popupNewsletterForm) {
        popupNewsletterForm.addEventListener('submit', handlePopupNewsletterSignup);
    }

    // Newsletter popup close
    const popupClose = document.getElementById('popup-close');
    if (popupClose) {
        popupClose.addEventListener('click', hideNewsletterPopup);
    }

    // Carousel controls
    const carouselPrev = document.getElementById('carousel-prev');
    const carouselNext = document.getElementById('carousel-next');

    if (carouselPrev) {
        carouselPrev.addEventListener('click', () => scrollCarousel('prev'));
    }

    if (carouselNext) {
        carouselNext.addEventListener('click', () => scrollCarousel('next'));
    }
}

// Authentication functions
function showAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function hideAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function showSignupForm() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (loginForm && signupForm) {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
}

function showLoginForm() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (loginForm && signupForm) {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Get stored users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUI();
        hideAuthModal();
        showMessage('Welcome back, ' + user.name + '!', 'success');
    } else {
        showMessage('Invalid email or password', 'error');
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // Validate password strength
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
    }
    
    // Get stored users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        showMessage('User with this email already exists', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        phone,
        password,
        joinDate: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    updateUI();
    hideAuthModal();
    showMessage('Account created successfully! Welcome, ' + name + '!', 'success');
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUI();
    hideUserDropdown();
    showMessage('Logged out successfully', 'success');
}

function toggleUserDropdown() {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

function hideUserDropdown() {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}

// Update UI based on authentication state
function updateUI() {
    const authBtn = document.getElementById('auth-btn');
    const authText = document.getElementById('auth-text');
    const cartCount = document.getElementById('cart-count');
    
    if (currentUser) {
        if (authText) {
            authText.textContent = currentUser.name;
        }
        if (authBtn) {
            authBtn.innerHTML = `<i class="fas fa-user"></i> <span>${currentUser.name}</span> <i class="fas fa-chevron-down"></i>`;
        }
    } else {
        if (authText) {
            authText.textContent = 'Login';
        }
        if (authBtn) {
            authBtn.innerHTML = `<i class="fas fa-user"></i> <span>Login</span>`;
        }
    }
    
    // Update cart count
    if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
    
    // Load products if on homepage
    loadFeaturedProducts();
    
    // Update daily offer
    updateDailyOffer();
}

// Daily offer functions
function updateDailyOffer() {
    const offerText = document.getElementById('daily-offer-text');
    if (offerText && dailyOffers[currentOfferIndex]) {
        offerText.textContent = dailyOffers[currentOfferIndex];
    }
}

function startOfferCountdown() {
    function updateCountdown() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const timeLeft = tomorrow - now;
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
        if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
        if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        if (timeLeft <= 0) {
            // Move to next offer
            currentOfferIndex = (currentOfferIndex + 1) % dailyOffers.length;
            updateDailyOffer();
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Product functions
function loadFeaturedProducts() {
    const carousel = document.getElementById('products-carousel');
    if (!carousel) return;
    
    const featuredProducts = products.slice(0, 6); // Show first 6 products
    
    carousel.innerHTML = featuredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<span class="product-badge ${product.badge.toLowerCase().replace(' ', '-')}">${product.badge}</span>` : ''}
                <button class="wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}" onclick="toggleWishlist(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="price-current">$${product.price}</span>
                    ${product.originalPrice ? `<span class="price-original">$${product.originalPrice}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="quick-view" onclick="quickView(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Cart functions
function addToCart(productId) {
    if (!currentUser) {
        showMessage('Please login to add items to cart', 'error');
        showAuthModal();
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateUI();
    showMessage(`${product.name} added to cart!`, 'success');
}

// Wishlist functions
function isInWishlist(productId) {
    return wishlist.includes(productId);
}

function toggleWishlist(productId) {
    if (!currentUser) {
        showMessage('Please login to use wishlist', 'error');
        showAuthModal();
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        showMessage(`${product.name} removed from wishlist`, 'success');
    } else {
        wishlist.push(productId);
        showMessage(`${product.name} added to wishlist!`, 'success');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateUI();
}

// Newsletter functions
function handleNewsletterSignup(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (email) {
        const newsletters = JSON.parse(localStorage.getItem('newsletters') || '[]');
        
        if (!newsletters.includes(email)) {
            newsletters.push(email);
            localStorage.setItem('newsletters', JSON.stringify(newsletters));
            showMessage('Thank you for subscribing to our newsletter!', 'success');
        } else {
            showMessage('You are already subscribed!', 'error');
        }
        
        e.target.reset();
    }
}

function handlePopupNewsletterSignup(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (email) {
        const newsletters = JSON.parse(localStorage.getItem('newsletters') || '[]');
        
        if (!newsletters.includes(email)) {
            newsletters.push(email);
            localStorage.setItem('newsletters', JSON.stringify(newsletters));
            showMessage('Welcome! Check your email for your 10% discount code!', 'success');
        } else {
            showMessage('You are already subscribed!', 'error');
        }
        
        hideNewsletterPopup();
    }
}

function showNewsletterPopup() {
    // Show popup after 10 seconds if user hasn't subscribed
    setTimeout(() => {
        const newsletters = JSON.parse(localStorage.getItem('newsletters') || '[]');
        const hasSeenPopup = localStorage.getItem('hasSeenNewsletterPopup');
        
        if (!hasSeenPopup && newsletters.length === 0) {
            const popup = document.getElementById('newsletter-popup');
            if (popup) {
                popup.classList.add('show');
                localStorage.setItem('hasSeenNewsletterPopup', 'true');
            }
        }
    }, 10000);
}

function hideNewsletterPopup() {
    const popup = document.getElementById('newsletter-popup');
    if (popup) {
        popup.classList.remove('show');
    }
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    
    if (query.length > 2) {
        const results = products.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );
        
        // Store search results for shop page
        sessionStorage.setItem('searchResults', JSON.stringify(results));
        sessionStorage.setItem('searchQuery', query);
        
        // If on shop page, update results immediately
        if (window.location.pathname.includes('shop.html')) {
            displaySearchResults(results, query);
        }
    }
}

// Carousel functions
function scrollCarousel(direction) {
    const carousel = document.getElementById('products-carousel');
    if (!carousel) return;
    
    const cardWidth = carousel.querySelector('.product-card').offsetWidth + 32; // 32px for gap
    const scrollAmount = direction === 'next' ? cardWidth : -cardWidth;
    
    carousel.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

// Quick view function
function quickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Store product data for product detail page
    sessionStorage.setItem('quickViewProduct', JSON.stringify(product));
    
    // Open product detail page
    window.open('product-detail.html', '_blank');
}

// Utility functions
function showMessage(message, type = 'success') {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Add to page
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(messageDiv, container.firstChild);
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
    
    // Scroll to top to show message
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Export functions for global access
window.addToCart = addToCart;
window.toggleWishlist = toggleWishlist;
window.quickView = quickView;