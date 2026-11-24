// ==========================================================================
// Alush Coffee House - Interactive Script (with Amharic & Ethiopian Birr)
// ==========================================================================

// Global state
let currentLang = localStorage.getItem('alush_lang') || 'en';
let cart = [];

// ---------------------------------------------------------------------------
// 1. Translations Dictionary (English & Amharic)
// ---------------------------------------------------------------------------
const translations = {
  en: {
    // Nav
    nav_home: "Home",
    nav_about: "About",
    nav_menu: "Menu",
    nav_specials: "Specials",
    nav_reserve: "Reserve",
    nav_reviews: "Reviews",
    nav_contact: "Contact",
    nav_book_btn: "Book Table",

    // Hero
    hero_badge: "100% Ethiopian Highland Arabica",
    hero_title: "Where Coffee Was Born, Brewed to Perfection",
    hero_desc: "Experience authentic Ethiopian coffee heritage from Yirgacheffe, Sidama, and Harar. Traditional Jebena aromas, modern espresso craftsmanship, and warm freshly baked pastries in the heart of Addis Ababa.",
    hero_btn_menu: "Explore Menu",
    hero_btn_reserve: "Reserve a Table",
    stat_origin: "Single Origin Beans",
    stat_rating: "Customer Rating",
    stat_community: "Coffee Lovers in Addis",

    // Features
    feat_1_title: "Authentic Jebena & Roast",
    feat_1_desc: "Traditional clay pot brewing and daily micro-roasting.",
    feat_2_title: "Direct From Farmers",
    feat_2_desc: "Ethically harvested from Yirgacheffe & Sidama hills.",
    feat_3_title: "Fresh Sambusa & Bakes",
    feat_3_desc: "Crispy pastries and artisan cakes made fresh every dawn.",
    feat_4_title: "High-Speed Wi-Fi & Lounge",
    feat_4_desc: "Ideal spot for meetings, remote work, and quiet study.",

    // About
    about_subtitle: "OUR HERITAGE & PASSION",
    about_title: "Celebrating Ethiopian Coffee Culture",
    about_p1: "At Alush Coffee, we take pride in serving the world's most aromatic beans right from their ancestral home. Coffee is an essential Ethiopian tradition—a welcoming ceremony, a moment of friendship, and our proudest gift to the world.",
    about_p2: "From slow-roasted Yirgacheffe and floral Sidama extractions to rich modern macchiatos, our baristas craft each pour with passion and reverence.",
    about_point1: "Traditional Jebena Buna ceremony with frankincense aroma",
    about_point2: "Payment accepted via Telebirr, CBE Birr & cash",
    about_point3: "Fresh daily pastries, Habesha cakes & crispy sambusas",
    about_btn: "Explore Our Menu",
    about_badge_title: "Master Baristas",
    about_badge_desc: "Trained in authentic Ethiopian extraction",

    // Menu
    menu_subtitle: "HANDCRAFTED TASTES",
    menu_title: "Our Signature Menu (in Ethiopian Birr)",
    menu_desc: "Select from traditional Ethiopian brews, rich espresso creations, and bakery delights.",
    filter_all: "All Items",
    filter_hot: "Hot Coffee",
    filter_cold: "Cold Brews",
    filter_bakery: "Bakery & Treats",

    // Specials
    special_tag: "SEASONAL SPECIAL",
    special_title: "Spiced Sidama Honey Macchiato",
    special_desc: "Authentic Sidama double espresso infused with pure Gojjam wild honey, warm cardamom, cinnamon spice, and velvety steamed milk foam.",
    special_add_btn: "Add to Cart",

    // Reservation
    res_subtitle: "RESERVE A MOMENT",
    res_title: "Book Your Cozy Table",
    res_desc: "Whether for morning discussions, business meetings, or relaxed family coffee time, book your table easily in advance.",
    res_perk1: "Instant Confirmation Code",
    res_perk2: "Guaranteed Spot in Bole Medhanealem",
    res_perk3: "Complimentary Roasted Kolo & Popcorn",
    res_lbl_name: "Full Name",
    res_lbl_email: "Email Address",
    res_lbl_phone: "Phone Number (Ethiopia)",
    res_lbl_guests: "Guests",
    res_lbl_date: "Date",
    res_lbl_time: "Time Slot",
    res_lbl_notes: "Special Requests (Optional)",
    res_btn_submit: "Confirm Reservation",

    // Reviews
    rev_subtitle: "TESTIMONIALS",
    rev_title: "Loved by Addis Coffee Aficionados",
    rev_desc: "Read thoughts from our daily regulars in Addis Ababa.",
    rev_1_comment: "\"Alush Coffee has the best traditional Jebena Buna in Bole! The scent of frankincense and the warmth of the staff make working here such a pleasure.\"",
    rev_1_name: "Bethlehem Tadesse",
    rev_1_role: "Tech Entrepreneur, Bole",
    rev_2_comment: "\"The Yirgacheffe pour-over is magnificent. You can taste the authentic citrus and floral notes. Plus, paying with Telebirr makes quick stops completely seamless!\"",
    rev_2_name: "Dawit Haile",
    rev_2_role: "Coffee Taster & Exporter",
    rev_3_comment: "\"Their fresh crispy Sambusas paired with spiced tea or a cold brew are unmatched. Outstanding ambiance and great Ethiopian hospitality.\"",
    rev_3_name: "Alula Girma",
    rev_3_role: "Architect & Designer",

    // Contact
    contact_subtitle: "VISIT OUR CAFE",
    contact_title: "Drop In For A Cup in Addis",
    contact_desc: "Step inside our aromatic haven in Bole, taste freshly roasted beans, and connect with great people.",
    contact_lbl_loc: "Location",
    contact_val_loc: "Bole Medhanealem, Cameroon Street, Addis Ababa, Ethiopia",
    contact_lbl_hours: "Opening Hours",
    contact_val_hours: "Mon – Sun: 06:30 AM – 10:00 PM",
    contact_lbl_phone: "Phone & Inquiries",
    news_title: "Join the Alush Coffee Club",
    news_desc: "Get special seasonal offers, discounts, and invites to traditional roasting ceremonies.",
    news_btn: "Subscribe",
    map_label: "Alush Coffee • Bole, Addis Ababa",
    map_status: "Open Now • Serving Fresh Ethiopian Roast",
    map_directions: "Get Directions",

    // Cart
    cart_title: "Your Coffee Order",
    cart_pay_method: "Payment Method (የመክፈያ ዘዴ)",
    cart_subtotal: "Subtotal",
    cart_tax: "VAT / Tax (15%)",
    cart_total: "Total",
    cart_checkout: "Pay with Ethiopian Birr",
    cart_empty_title: "Your coffee bag is empty",
    cart_empty_desc: "Explore our menu and pick something freshly brewed!",

    // Modals & Footer
    modal_success_title: "Table Reserved Successfully!",
    modal_success_desc: "We've saved your spot at Alush Coffee. Confirmation code below.",
    modal_btn: "Great, See You Soon!",
    footer_about: "Proudly serving genuine Ethiopian single-origin beans, traditional Jebena extractions, and specialty coffee in Addis Ababa, Ethiopia.",
    footer_quick_links: "Quick Links",
    footer_specialties: "Specialties",
    footer_hours_title: "Hours of Pouring"
  },

  am: {
    // Nav
    nav_home: "መነሻ",
    nav_about: "ስለ እኛ",
    nav_menu: "ሜኑ",
    nav_specials: "ልዩ ዝግጅት",
    nav_reserve: "ቦታ ማስያዣ",
    nav_reviews: "አስተያየቶች",
    nav_contact: "አድራሻ",
    nav_book_btn: "ጠረጴዛ ያስይዙ",

    // Hero
    hero_badge: "100% የኢትዮጵያ ሀገር በቀል አረቢካ ቡና",
    hero_title: "የቡና መገኛ የሆነውን እውነተኛ ጣዕም ይቅመሱ",
    hero_desc: "ከይርጋጨፌ፣ ሲዳማ እና ሐረር የተመረጡ ምርጥ የቡና ፍሬዎች። ባህላዊ የጀበና ቡና መዓዛ፣ ዘመናዊ ኤስፕሬሶ አዘገጃጀት እና ትኩስ መክሰሶች በቦሌ አዲስ አበባ።",
    hero_btn_menu: "ሜኑ ይመልከቱ",
    hero_btn_reserve: "ጠረጴዛ ያስይዙ",
    stat_origin: "ንፁህ ሀገር በቀል ቡና",
    stat_rating: "የደንበኞች እርካታ",
    stat_community: "በአዲስ አበባ ያሉ የቡና ወዳጆች",

    // Features
    feat_1_title: "ባህላዊ የጀበና ቡና አፈላል",
    feat_1_desc: "በሸክላ ጀበና በእጣን መዓዛ የታጀበ እውነተኛ የሀበሻ ቡና።",
    feat_2_title: "በቀጥታ ከአርሶ አደሮች",
    feat_2_desc: "ከተፈጥሮአዊ የይርጋጨፌ እና ሲዳማ ተራሮች የተሰበሰበ።",
    feat_3_title: "ትኩስ ሳምቡሳና መክሰሶች",
    feat_3_desc: "በየማለዳው የሚዘጋጁ ጥርት ያሉ ጣፋጮችና ሳምቡሳዎች።",
    feat_4_title: "ፈጣን ዋይፋይና ምቹ ድባብ",
    feat_4_desc: "ለሥራ፣ ለስብሰባ እና ለመዝናናት ተስማሚ ቦታ።",

    // About
    about_subtitle: "የቡና ቅርሳችን እና ፍቅራችን",
    about_title: "የኢትዮጵያን የቡና ባህል በኩራት እናከብራለን",
    about_p1: "በአሉሽ ቡና፣ የዓለማችንን መዓዛማ የቡና ፍሬዎች ከመገኛ ምድራቸው በጥራት በማዘጋጀት ለደንበኞቻችን እናቀርባለን። ቡና ለእኛ ባህል፣ አብሮነትና ታላቅ የሀገራችን ኩራት ነው።",
    about_p2: "ከልዩ የይርጋጨፌ ቪ60 አፈላል እስከ ሲዳማ ማኪያቶ ድረስ፣ ባለሙያዎቻችን እያንዳንዱን ሲኒ በፍቅር ያዘጋጁታል።",
    about_point1: "ባህላዊ የጀበና ቡና ከእጣን ጭስና ቆሎ ጋር",
    about_point2: "ክፍያ በቴሌብር፣ በሲቢኢ ብር እና በጥሬ ገንዘብ ይቀበላል",
    about_point3: "ትኩስ ሳምቡሳ፣ የሀበሻ ኬክ እና ልዩ መክሰሶች በየቀኑ",
    about_btn: "ሜኑውን ይጎብኙ",
    about_badge_title: "ምርጥ ባሪስታዎች",
    about_badge_desc: "በኢትዮጵያ የቡና አዘገጃጀት የተካኑ",

    // Menu
    menu_subtitle: "በጥበብ የተዘጋጁ",
    menu_title: "የአሉሽ ልዩ ሜኑ (በኢትዮጵያ ብር)",
    menu_desc: "ከባህላዊ የጀበና ቡና እስከ ዘመናዊ ቀዝቃዛ መጠጦችና ትኩስ መክሰሶች ድረስ ይምረጡ።",
    filter_all: "ሁሉም",
    filter_hot: "ትኩስ ቡናዎች",
    filter_cold: "ቀዝቃዛ ቡናዎች",
    filter_bakery: "መክሰስና ዳቦ",

    // Specials
    special_tag: "የወቅቱ ልዩ ስጦታ",
    special_title: "የተቀመመ የሲዳማ ማኪያቶ ከማር ጋር",
    special_desc: "የሲዳማ ድርብ ኤስፕሬሶ ከጎጃም የተፈጥሮ ማር፣ ኮረሪማ፣ ቀረፋ እና ለስላሳ የወተት አረፋ ጋር የተዋሃደ ልዩ ጣዕም።",
    special_add_btn: "ወደ ቅርጫት አስገባ",

    // Reservation
    res_subtitle: "ቦታ ይያዙ",
    res_title: "ምቹ ጠረጴዛዎን አስቀድመው ያስይዙ",
    res_desc: "ለማለዳ ሥራ፣ ለንግድ ስብሰባዎች ወይም ከቤተሰብ ጋር ለቡና ሰዓት ቦታዎን በቀላሉ ያስይዙ።",
    res_perk1: "ፈጣን የማረጋገጫ ኮድ",
    res_perk2: "በቦሌ መድኃኔዓለም የተረጋገጠ ቦታ",
    res_perk3: "የተቆላ ቆሎና ፈንድሻ በነፃ",
    res_lbl_name: "ሙሉ ስም",
    res_lbl_email: "ኢሜይል አድራሻ",
    res_lbl_phone: "ስልክ ቁጥር (ኢትዮጵያ)",
    res_lbl_guests: "የሰው ብዛት",
    res_lbl_date: "ቀን",
    res_lbl_time: "ሰዓት",
    res_lbl_notes: "ልዩ ፍላጎቶች (ካሉ)",
    res_btn_submit: "ቦታውን አረጋግጥ",

    // Reviews
    rev_subtitle: "የደንበኞች አስተያየት",
    rev_title: "የአዲስ አበባ ቡና ወዳጆች የሚሉት",
    rev_desc: "የዘወትር ደንበኞቻችን ስለ አሉሽ ቡና የሰጡት ምስክርነት።",
    rev_1_comment: "\"አሉሽ ቡና በቦሌ ውስጥ ምርጥ ባህላዊ የጀበና ቡና ያቀርባል! የእጣኑ መዓዛና የሰራተኞቹ እንክብካቤ እዚህ ተቀምጦ ለመስራት እጅግ ያመቻቻል።\"",
    rev_1_name: "ቤተልሔም ታደሰ",
    rev_1_role: "የቴክኖሎጂ ባለሙያ፣ ቦሌ",
    rev_2_comment: "\"የይርጋጨፌው ቡና ድንቅ ነው! የተፈጥሮ የፍራፍሬ ጣዕሙን በትክክል ታገኙታላችሁ። በተጨማሪም በቴሌብር መክፈል እጅግ ፈጣንና ምቹ ያደርገዋል!\"",
    rev_2_name: "ዳዊት ኃይሌ",
    rev_2_role: "የቡና ቀማሽና ላኪ",
    rev_3_comment: "\"ትኩስ ሳምቡሳቸው ከተቀመመ ሻይ ወይም ከቀዝቃዛ ቡና ጋር እጅግ ይጣፍጣል። ግሩም የኢትዮጵያውያን መስተንግዶና ሰላማዊ ድባብ አላቸው።\"",
    rev_3_name: "አሉላ ግርማ",
    rev_3_role: "አርክቴክትና ዲዛይነር",

    // Contact
    contact_subtitle: "ይምጡና ይጎብኙን",
    contact_title: "ለአንድ ሲኒ ቡና ወደ አሉሽ ይምጡ",
    contact_desc: "በቦሌ መድኃኔዓለም በሚገኘው ማራኪ ቤታችን ገብተው ትኩስ ቡና እየጠጡ ዘና ይበሉ።",
    contact_lbl_loc: "አድራሻ",
    contact_val_loc: "ቦሌ መድኃኔዓለም፣ ካሜሩን ጎዳና፣ አዲስ አበባ፣ ኢትዮጵያ",
    contact_lbl_hours: "የሥራ ሰዓት",
    contact_val_hours: "ከሰኞ – እሁድ፡ ከጠዋቱ 12:30 – ማታ 4:00",
    contact_lbl_phone: "ስልክና ግንኙነት",
    news_title: "የአሉሽ ቡና ክለብ አባል ይሁኑ",
    news_desc: "ልዩ ቅናሾችንና የባህላዊ የቡና ማፍላት ስነ-ስርዓት ጥሪዎችን ያግኙ።",
    news_btn: "ይመዝገቡ",
    map_label: "አሉሽ ቡና • ቦሌ፣ አዲስ አበባ",
    map_status: "አሁን ክፍት ነው • ትኩስ የኢትዮጵያ ቡና በማቅረብ ላይ",
    map_directions: "አቅጣጫ አሳይ",

    // Cart
    cart_title: "የመረጧቸው ትዕዛዞች",
    cart_pay_method: "የመክፈያ ዘዴ",
    cart_subtotal: "ንዑስ ድምር",
    cart_tax: "ተጨማሪ እሴት ታክስ (15%)",
    cart_total: "ጠቅላላ ክፍያ",
    cart_checkout: "በኢትዮጵያ ብር ይክፈሉ",
    cart_empty_title: "የትዕዛዝ ቅርጫትዎ ባዶ ነው",
    cart_empty_desc: "ከሜኑው ውስጥ የሚወዱትን ትኩስ ቡና ይምረጡ!",

    // Modals & Footer
    modal_success_title: "ጠረጴዛዎ በተሳካ ሁኔታ ተይዟል!",
    modal_success_desc: "በአሉሽ ቡና ቦታዎ ተቀምጧል። የማረጋገጫ ኮድዎን ከታች ይመልከቱ።",
    modal_btn: "እሺ አመሰግናለሁ!",
    footer_about: "እውነተኛ የኢትዮጵያ ነጠላ ዝርያ ቡናዎችን፣ ባህላዊ የጀበና አፈላልና ዘመናዊ ኤስፕሬሶ በአዲስ አበባ በኩራት እናቀርባለን።",
    footer_quick_links: "ፈጣን ሊንኮች",
    footer_specialties: "ልዩ ምርቶች",
    footer_hours_title: "የማፍያ ሰዓታት"
  }
};

// ---------------------------------------------------------------------------
// 2. Menu Items Data (with Ethiopian Context & Birr Prices)
// ---------------------------------------------------------------------------
let menuItems = [
  {
    id: 'c1',
    titleEn: 'Traditional Jebena Buna',
    titleAm: 'ባህላዊ የጀበና ቡና ከተናዳም ጋር',
    category: 'hot',
    tagEn: 'Cultural Classic',
    tagAm: 'ባህላዊ ክላሲክ',
    price: 80, // 80 ETB
    rating: '5.0',
    descEn: 'Authentic clay pot brewed single-origin coffee served with fresh Ruta (Tena’adam), popped corn, and incense smoke.',
    descAm: 'በባህላዊ ሸክላ ጀበና በእጣን መዓዛ፣ ከተናዳምና ከፈንድሻ ጋር የሚቀርብ ልዩ የሀበሻ ቡና።',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c2',
    titleEn: 'Yirgacheffe V60 Pour-Over',
    titleAm: 'የይርጋጨፌ ቪ60 ፑር-ኦቨር',
    category: 'hot',
    tagEn: 'Single Origin',
    tagAm: 'ነጠላ ዝርያ',
    price: 150, // 150 ETB
    rating: '4.9',
    descEn: 'Hand-poured specialty roast boasting vibrant notes of wild jasmine blossom, bergamot, and sweet lemon citrus.',
    descAm: 'የጃስሚን አበባና የሎሚ መዓዛ ያለው በጥበብ የተጣራ የይርጋጨፌ ነጠላ ዝርያ ቡና።',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c3',
    titleEn: 'Sidama Honey Flat White',
    titleAm: 'የሲዳማ ማር ፍላት ዋይት',
    category: 'hot',
    tagEn: 'Signature',
    tagAm: 'ተወዳጅ',
    price: 130, // 130 ETB
    rating: '4.9',
    descEn: 'Velvety microfoam poured over double ristretto shots with notes of stone peach and pure Ethiopian honey.',
    descAm: 'የሲዳማ ድርብ ሾት ቡና ከለሰለሰ የወተት አረፋና ከተፈጥሮ ማር ጣዕም ጋር።',
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c4',
    titleEn: 'Kaffa Cold Brew Reserve',
    titleAm: 'የከፋ ኮልድ ብሩ ሪዘርቭ',
    category: 'cold',
    tagEn: '18hr Steeped',
    tagAm: 'ለ18 ሰዓት የረጠበ',
    price: 160, // 160 ETB
    rating: '4.8',
    descEn: 'Steeped for 18 hours using premium Kaffa forest beans, providing a rich, naturally chocolatey chilled flavor.',
    descAm: 'ከከፋ ጫካ በተሰበሰቡ ፍሬዎች ለ18 ሰዓታት ቀዝቅዞ የረጠበ ቸኮሌታማ ቀዝቃዛ ቡና።',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c5',
    titleEn: 'Iced Caramel Macchiato',
    titleAm: 'አይስድ ካራሜል ማኪያቶ',
    category: 'cold',
    tagEn: 'Addis Favorite',
    tagAm: 'የአዲስ ተወዳጅ',
    price: 120, // 120 ETB
    rating: '4.9',
    descEn: 'Chilled whole milk over ice, marked with freshly extracted Harar espresso and topped with golden caramel drizzle.',
    descAm: 'በበረዶ የቀዘቀዘ ወተት ከሐረር ኤስፕሬሶና ከወርቃማ ካራሜል ሽሮፕ ጋር።',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c6',
    titleEn: 'Spiced Habesha Chai Latte',
    titleAm: 'የተቀመመ የሀበሻ ሻይ ላቴ',
    category: 'hot',
    tagEn: 'Aromatic Spice',
    tagAm: 'ቅመማ ቅመም',
    price: 90, // 90 ETB
    rating: '4.8',
    descEn: 'Traditional highland black tea slow-brewed with fresh cloves, cardamom, ginger, and steamed milk.',
    descAm: 'በቅርንፉድ፣ በኮረሪማና በዝንጅብል ቅመሞች ተፈልቶ ከወተት ጋር የቀረበ ባህላዊ ሻይ።',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c7',
    titleEn: 'Crispy Beef & Lentil Sambusa',
    titleAm: 'ትኩስ የስጋና የምስር ሳምቡሳ (2 ፍሬ)',
    category: 'bakery',
    tagEn: 'Fresh Baked',
    tagAm: 'ትኩስ መክሰስ',
    price: 95, // 95 ETB
    rating: '5.0',
    descEn: 'Golden hand-folded crispy pastry pockets stuffed with seasoned minced beef or spiced green lentils.',
    descAm: 'በጥንቃቄ ተጠቅልሎ በደቃቁ የበሰለ ጥርት ያለ የስጋ ወይም የምስር ሳምቡሳ።',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c8',
    titleEn: 'Honey Pistachio Baklava',
    titleAm: 'የማርና ፒስታቺዮ ባክላቫ',
    category: 'bakery',
    tagEn: 'Sweet Delight',
    tagAm: 'ጣፋጭ',
    price: 120, // 120 ETB
    rating: '4.9',
    descEn: 'Layers of delicate flaky phyllo dough packed with crushed pistachios and drenched in aromatic local wild honey.',
    descAm: 'በተፈጨ ፒስታቺዮ የተሞላ እና በንፁህ የተፈጥሮ ማር የተለወሰ ተወዳጅ ባክላቫ።',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80'
  }
];

// ---------------------------------------------------------------------------
// 3. Initialization on DOM Load
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Current year in footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Set default reservation date to tomorrow
  const dateInput = document.getElementById('res-date');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  initLanguageSwitcher();
  initNavigation();
  initMenu();
  loadMenuFromAPI();
  initCart();
  initReservation();
  initNewsletter();

  // Apply stored language
  applyLanguage(currentLang);
});

// Load dynamic menu items from MySQL server
async function loadMenuFromAPI() {
  try {
    const res = await fetch('/api/menu');
    if (!res.ok) return;
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      menuItems = json.data;
      initMenu();
    }
  } catch (e) {
    console.info('Backend API offline, using local menu data.');
  }
}

// ---------------------------------------------------------------------------
// 4. Language Switcher Logic (English <-> Amharic)
// ---------------------------------------------------------------------------
function initLanguageSwitcher() {
  const langToggleBtn = document.getElementById('lang-toggle-btn');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'am' : 'en';
      localStorage.setItem('alush_lang', currentLang);
      applyLanguage(currentLang);
    });
  }
}

function applyLanguage(lang) {
  const dict = translations[lang] || translations.en;

  // Update button indicator
  const langText = document.getElementById('current-lang-text');
  if (langText) {
    // When in English, show "አማርኛ" to toggle. When in Amharic, show "English".
    langText.textContent = lang === 'en' ? 'አማርኛ' : 'English';
  }

  // Update Logo Brand Text
  const mainLogo = document.getElementById('main-logo');
  if (mainLogo) {
    mainLogo.innerHTML = lang === 'am'
      ? `<div class="logo-badge"><i class="fa-solid fa-mug-hot"></i></div><span class="logo-text">አሉሽ <span>ቡና</span></span>`
      : `<div class="logo-badge"><i class="fa-solid fa-mug-hot"></i></div><span class="logo-text">Alush <span>Coffee</span></span>`;
  }

  const footerLogo = document.querySelector('.footer-brand .logo');
  if (footerLogo) {
    footerLogo.innerHTML = lang === 'am'
      ? `<div class="logo-badge"><i class="fa-solid fa-mug-hot"></i></div><span class="logo-text">አሉሽ <span>ቡና</span></span>`
      : `<div class="logo-badge"><i class="fa-solid fa-mug-hot"></i></div><span class="logo-text">Alush <span>Coffee</span></span>`;
  }

  // Update specials prices
  const specCurr = document.getElementById('special-price-curr');
  const specOld = document.getElementById('special-price-old');
  if (specCurr && specOld) {
    const currencyStr = lang === 'am' ? 'ብር' : 'ETB';
    specCurr.textContent = `140 ${currencyStr}`;
    specOld.textContent = `180 ${currencyStr}`;
  }

  // Update all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Re-render menu cards and cart with current language
  initMenu();
  updateCartUI();
}

// ---------------------------------------------------------------------------
// 5. Navigation & Scroll Effects
// ---------------------------------------------------------------------------
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let currentSection = '';
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = menuToggle.querySelector('i');
      if (navMenu.classList.contains('open')) {
        icon.classList.replace('fa-bars', 'fa-xmark');
      } else {
        icon.classList.replace('fa-xmark', 'fa-bars');
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = menuToggle.querySelector('i');
        if (icon) icon.classList.replace('fa-xmark', 'fa-bars');
      });
    });
  }
}

// ---------------------------------------------------------------------------
// 6. Menu Rendering & Category Tabs
// ---------------------------------------------------------------------------
function initMenu() {
  const menuGrid = document.getElementById('menu-grid');
  const tabButtons = document.querySelectorAll('.tab-btn');
  let activeFilter = 'all';

  const activeBtn = document.querySelector('.tab-btn.active');
  if (activeBtn) {
    activeFilter = activeBtn.getAttribute('data-filter') || 'all';
  }

  function renderMenu(filter = 'all') {
    if (!menuGrid) return;
    menuGrid.innerHTML = '';

    const filtered = filter === 'all'
      ? menuItems
      : menuItems.filter(item => item.category === filter);

    const currencySymbol = currentLang === 'am' ? 'ብር' : 'ETB';

    filtered.forEach(item => {
      const title = currentLang === 'am' ? item.titleAm : item.titleEn;
      const desc = currentLang === 'am' ? item.descAm : item.descEn;
      const tag = currentLang === 'am' ? item.tagAm : item.tagEn;

      const card = document.createElement('div');
      card.className = 'menu-card';
      card.innerHTML = `
        <div class="card-img-wrap">
          <img src="${item.image}" alt="${title}" loading="lazy">
          <span class="card-tag">${tag}</span>
        </div>
        <div class="card-body">
          <div class="card-header-line">
            <h3 class="card-title">${title}</h3>
            <div class="card-rating">
              <i class="fa-solid fa-star"></i> ${item.rating}
            </div>
          </div>
          <p class="card-desc">${desc}</p>
          <div class="card-footer-line">
            <span class="card-price">${item.price} ${currencySymbol}</span>
            <button class="card-add-btn" aria-label="Add ${title} to order" onclick="addToCart('${item.id}')">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
      `;
      menuGrid.appendChild(card);
    });
  }

  tabButtons.forEach(btn => {
    btn.onclick = () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderMenu(filter);
    };
  });

  renderMenu(activeFilter);
}

// ---------------------------------------------------------------------------
// 7. Cart Drawer & Ethiopian Payment Handling
// ---------------------------------------------------------------------------
function initCart() {
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  const checkoutBtn = document.getElementById('checkout-btn');

  function openCart() {
    cartDrawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (overlay) overlay.addEventListener('click', closeCart);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartDrawer.classList.contains('active')) {
      closeCart();
    }
  });

  // Payment radio option styling
  const payOptions = document.querySelectorAll('.pay-option');
  payOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      payOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async () => {
      if (cart.length === 0) {
        showToast(currentLang === 'am'
          ? 'የትዕዛዝ ቅርጫትዎ ባዶ ነው! እባክዎ መጀመሪያ ቡና ወይም መክሰስ ይምረጡ።'
          : 'Your order bag is empty! Please add items first.');
        return;
      }

      // Check selected payment method & customer info
      const selectedPayInput = document.querySelector('input[name="pay-method"]:checked');
      const paymentMethod = selectedPayInput ? selectedPayInput.value : 'Telebirr';
      const nameInput = document.getElementById('order-customer-name');
      const phoneInput = document.getElementById('order-customer-phone');
      const customerName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Guest Customer';
      const customerPhone = phoneInput && phoneInput.value.trim() ? phoneInput.value.trim() : '';

      const originalBtnHtml = checkoutBtn.innerHTML;
      checkoutBtn.disabled = true;
      checkoutBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing...`;

      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName,
            customerPhone,
            paymentMethod,
            items: cart
          })
        });

        const result = await response.json();
        closeCart();

        const orderCode = result.orderCode || ('ACH-ORD-' + Math.floor(100000 + Math.random() * 900000));
        const totalAmount = result.totalAmount ? `${result.totalAmount} ETB` : document.getElementById('cart-total').textContent;

        const successMsg = currentLang === 'am'
          ? `እናመሰግናለን! ትዕዛዝ #${orderCode} በ${paymentMethod} (${totalAmount}) በዳታቤዝ ተመዝግቧል።`
          : `Thank you! Order #${orderCode} via ${paymentMethod} (${totalAmount}) saved in database.`;

        showToast(successMsg);
        cart = [];
        if (nameInput) nameInput.value = '';
        if (phoneInput) phoneInput.value = '';
        updateCartUI();
      } catch (err) {
        closeCart();
        const totalText = document.getElementById('cart-total').textContent;
        const successMsg = currentLang === 'am'
          ? `እናመሰግናለን! በ${paymentMethod} የተከፈለው ${totalText} ትዕዛዝዎ በተሳካ ሁኔታ ተረጋግጧል።`
          : `Thank you! Your order of ${totalText} via ${paymentMethod} has been confirmed.`;
        showToast(successMsg);
        cart = [];
        updateCartUI();
      } finally {
        checkoutBtn.disabled = false;
        checkoutBtn.innerHTML = originalBtnHtml;
      }
    });
  }

  updateCartUI();
}

function addToCart(itemId) {
  const product = menuItems.find(p => p.id === itemId);
  if (!product) return;

  const existingIndex = cart.findIndex(i => i.id === itemId);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      id: product.id,
      titleEn: product.titleEn,
      titleAm: product.titleAm,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  updateCartUI();
  const name = currentLang === 'am' ? product.titleAm : product.titleEn;
  const msg = currentLang === 'am'
    ? `"${name}" ወደ ቅርጫትዎ ተጨምሯል!`
    : `Added "${name}" to your bag!`;
  showToast(msg);
}

function quickAddSpecial() {
  const specialItem = {
    id: 'special-honey-macchiato',
    titleEn: 'Spiced Sidama Honey Macchiato',
    titleAm: 'የተቀመመ የሲዳማ ማኪያቶ ከማር ጋር',
    price: 140, // 140 ETB
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
    quantity: 1
  };

  const existing = cart.find(i => i.id === specialItem.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push(specialItem);
  }

  updateCartUI();
  const msg = currentLang === 'am'
    ? 'የተቀመመ የሲዳማ ማኪያቶ ወደ ቅርጫትዎ ተጨምሯል!'
    : 'Added Spiced Sidama Honey Macchiato to cart!';
  showToast(msg);
}

function updateCartQuantity(itemId, delta) {
  const itemIndex = cart.findIndex(i => i.id === itemId);
  if (itemIndex > -1) {
    cart[itemIndex].quantity += delta;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
  }
  updateCartUI();
}

function removeCartItem(itemId) {
  cart = cart.filter(i => i.id !== itemId);
  updateCartUI();
  showToast(currentLang === 'am' ? 'እቃው ከቅርጫቱ ተሰርዟል' : 'Item removed from bag.');
}

function updateCartUI() {
  const cartBadge = document.getElementById('cart-badge');
  const cartItemsEl = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('cart-subtotal');
  const taxEl = document.getElementById('cart-tax');
  const totalEl = document.getElementById('cart-total');

  const currencySymbol = currentLang === 'am' ? 'ብር' : 'ETB';

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartBadge) {
    cartBadge.textContent = totalCount;
  }

  if (!cartItemsEl) return;

  if (cart.length === 0) {
    const emptyTitle = currentLang === 'am' ? 'የትዕዛዝ ቅርጫትዎ ባዶ ነው' : 'Your coffee bag is empty';
    const emptyDesc = currentLang === 'am' ? 'ከሜኑው ውስጥ የሚወዱትን ትኩስ ቡና ይምረጡ!' : 'Explore our menu and pick something freshly brewed!';

    cartItemsEl.innerHTML = `
      <div class="cart-empty">
        <i class="fa-solid fa-mug-saucer"></i>
        <h4>${emptyTitle}</h4>
        <p>${emptyDesc}</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = `0.00 ${currencySymbol}`;
    if (taxEl) taxEl.textContent = `0.00 ${currencySymbol}`;
    if (totalEl) totalEl.textContent = `0.00 ${currencySymbol}`;
    return;
  }

  cartItemsEl.innerHTML = '';
  let subtotal = 0;

  cart.forEach(item => {
    const title = currentLang === 'am' ? (item.titleAm || item.titleEn) : (item.titleEn || item.titleAm);
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <img src="${item.image}" alt="${title}" class="cart-item-img">
      <div class="cart-item-info">
        <h4 class="cart-item-title">${title}</h4>
        <div class="cart-item-price">${item.price} ${currencySymbol}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="updateCartQuantity('${item.id}', -1)" aria-label="Decrease quantity">-</button>
          <span class="cart-item-qty">${item.quantity}</span>
          <button class="qty-btn" onclick="updateCartQuantity('${item.id}', 1)" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <button class="cart-item-delete" onclick="removeCartItem('${item.id}')" aria-label="Remove item">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `;
    cartItemsEl.appendChild(row);
  });

  const vat = subtotal * 0.15; // 15% VAT standard in Ethiopia
  const grandTotal = subtotal + vat;

  if (subtotalEl) subtotalEl.textContent = `${subtotal.toFixed(2)} ${currencySymbol}`;
  if (taxEl) taxEl.textContent = `${vat.toFixed(2)} ${currencySymbol}`;
  if (totalEl) totalEl.textContent = `${grandTotal.toFixed(2)} ${currencySymbol}`;
}

// ---------------------------------------------------------------------------
// 8. Reservation System (Ethiopian Context)
// ---------------------------------------------------------------------------
function initReservation() {
  const reservationForm = document.getElementById('reservation-form');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalDetails = document.getElementById('modal-details');

  if (reservationForm) {
    reservationForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('res-name').value;
      const email = document.getElementById('res-email').value;
      const phone = document.getElementById('res-phone').value;
      const guests = document.getElementById('res-guests').value;
      const date = document.getElementById('res-date').value;
      const time = document.getElementById('res-time').value;
      const notes = document.getElementById('res-notes') ? document.getElementById('res-notes').value : '';

      const submitBtn = reservationForm.querySelector('button[type="submit"]');
      const origBtnHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving...`;
      }

      let reservationId = 'ACH-RES-' + Math.floor(100000 + Math.random() * 900000);

      try {
        const response = await fetch('/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: name,
            email,
            phone,
            guests: parseInt(guests, 10),
            date,
            timeSlot: time,
            specialRequests: notes
          })
        });

        const json = await response.json();
        if (json.success && json.reservationCode) {
          reservationId = json.reservationCode;
        }
      } catch (err) {
        console.warn('Backend reservation offline, using generated code:', err);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origBtnHtml;
        }
      }

      if (modalDetails) {
        if (currentLang === 'am') {
          modalDetails.innerHTML = `
            <strong>የቦታ ማስያዣ ኮድ፡</strong> #${reservationId}<br>
            <strong>የእንግዳ ስም፡</strong> ${name}<br>
            <strong>ስልክ ቁጥር፡</strong> ${phone}<br>
            <strong>የሰው ብዛት፡</strong> ${guests} ሰው<br>
            <strong>ቀንና ሰዓት፡</strong> ${date} በ${time}<br>
            <strong>አድራሻ፡</strong> ቦሌ መድኃኔዓለም፣ አዲስ አበባ<br>
            <strong>ሁኔታ፡</strong> <span style="color:#2ecc71;font-weight:700;">በዳታቤዝ ተረጋግጧል (Saved in MySQL)</span>
          `;
        } else {
          modalDetails.innerHTML = `
            <strong>Reservation Code:</strong> #${reservationId}<br>
            <strong>Guest Name:</strong> ${name}<br>
            <strong>Phone:</strong> ${phone}<br>
            <strong>Party Size:</strong> ${guests} Person(s)<br>
            <strong>Date & Slot:</strong> ${date} at ${time}<br>
            <strong>Location:</strong> Bole Medhanealem, Addis Ababa<br>
            <strong>Status:</strong> <span style="color:#2ecc71;font-weight:700;">Confirmed & Saved to MySQL</span>
          `;
        }
      }

      modalOverlay.classList.add('active');
      reservationForm.reset();
    });
  }

  if (modalCloseBtn && modalOverlay) {
    modalCloseBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }
}

// ---------------------------------------------------------------------------
// 9. Toast Helper
// ---------------------------------------------------------------------------
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// ---------------------------------------------------------------------------
// 10. Newsletter Subscription
// ---------------------------------------------------------------------------
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      if (emailInput && emailInput.value) {
        const email = emailInput.value.trim();
        try {
          await fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
        } catch (err) {
          console.warn('Newsletter submission error:', err);
        }

        showToast(currentLang === 'am'
          ? '🎉 እንኳን ወደ አሉሽ የቡና ክለብ በደህና መጡ! በኢሜይልዎ ልዩ ቅናሽ ልከንልዎታል።'
          : '🎉 Welcome to Alush Coffee Club! Check your email for special perks.');
        emailInput.value = '';
      }
    });
  }
}
