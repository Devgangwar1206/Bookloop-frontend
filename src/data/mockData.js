// Realistic mock data for BookLoop Marketplace (Indian Context & INR)

export const CATEGORIES = [
  { id: 'fiction', name: 'Fiction', icon: 'BookOpen', count: '3,420' },
  { id: 'academic', name: 'Academic', icon: 'GraduationCap', count: '4,150' },
  { id: 'competitive-exams', name: 'Competitive Exams', icon: 'Award', count: '2,890' },
  { id: 'engineering', name: 'Engineering', icon: 'Cpu', count: '1,940' },
  { id: 'medical', name: 'Medical', icon: 'Activity', count: '1,230' },
  { id: 'school-books', name: 'School Books', icon: 'Bookmark', count: '3,800' },
  { id: 'novels', name: 'Novels', icon: 'Feather', count: '5,100' },
  { id: 'comics', name: 'Comics & Manga', icon: 'Smile', count: '980' },
  { id: 'self-help', name: 'Self Help', icon: 'Compass', count: '2,450' },
  { id: 'childrens-books', name: "Children's Books", icon: 'Sparkles', count: '1,670' },
  { id: 'entrance-exams', name: 'Entrance Exams', icon: 'FileText', count: '1,820' },
  { id: 'other', name: 'Other Non-Fiction', icon: 'Layers', count: '890' }
];

export const CITIES = [
  'Noida, UP',
  'Delhi NCR',
  'Greater Noida, UP',
  'Ghaziabad, UP',
  'Gurugram, HR',
  'Lucknow, UP',
  'Kanpur, UP',
  'Jaipur, RJ',
  'Dehradun, UK',
  'Bangalore, KA',
  'Mumbai, MH',
  'Pune, MH'
];

export const INITIAL_BOOKS = [
  {
    id: 'b-101',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    price: 350,
    originalPrice: 899,
    condition: 'Used - Good',
    category: 'Engineering',
    listingType: 'Individual Seller',
    transaction: 'Buy + Exchange',
    exchangePreferences: 'Wants: System Design Interview or Pragmatic Programmer',
    negotiable: true,
    location: 'Sector 62, Noida, UP',
    distance: '2.4 km away',
    city: 'Noida, UP',
    language: 'English',
    delivery: 'Both',
    isbn: '978-0132350884',
    edition: '1st Indian Edition',
    publisher: 'Pearson Education',
    pages: 464,
    publicationYear: 2018,
    description: 'Crisp copy with no markings on the core chapters. A few dog-ears on Chapter 3 & 5. Essential reading for every software engineer looking to write readable, maintainable software.',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 's-1',
      name: 'Aarav Sharma',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      rating: 4.9,
      reviewsCount: 38,
      verified: true,
      memberSince: 'March 2024',
      totalListings: 12,
      soldCount: 9,
      responseRate: '98% (usually replies in 15 mins)',
      location: 'Noida, UP'
    },
    views: 342,
    favoritesCount: 24,
    status: 'Active',
    createdAt: '2026-09-18T10:00:00Z',
    isPopular: true,
    isNearYou: true
  },
  {
    id: 'b-102',
    title: 'Atomic Habits: An Easy & Proven Way to Build Good Habits',
    author: 'James Clear',
    price: 280,
    originalPrice: 799,
    condition: 'Like New',
    category: 'Self Help',
    listingType: 'Individual Seller',
    transaction: 'Buy',
    exchangePreferences: '',
    negotiable: false,
    location: 'Indirapuram, Ghaziabad, UP',
    distance: '4.1 km away',
    city: 'Ghaziabad, UP',
    language: 'English',
    delivery: 'Pickup',
    isbn: '978-1847941831',
    edition: 'Paperback Edition',
    publisher: 'Random House Business',
    pages: 320,
    publicationYear: 2021,
    description: 'Read once and stored carefully in bookshelf. No pen marks, no folded pages. Spine is completely intact like a brand-new bookstore copy.',
    images: [
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 's-2',
      name: 'Priya Verma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      rating: 4.8,
      reviewsCount: 19,
      verified: true,
      memberSince: 'January 2025',
      totalListings: 6,
      soldCount: 4,
      responseRate: '95% (replies in 1 hour)',
      location: 'Ghaziabad, UP'
    },
    views: 512,
    favoritesCount: 42,
    status: 'Active',
    createdAt: '2026-09-20T14:30:00Z',
    isPopular: true,
    isNearYou: true
  },
  {
    id: 'b-103',
    title: 'Concepts of Physics (Vol 1 & Vol 2 Set)',
    author: 'Dr. H.C. Verma',
    price: 450,
    originalPrice: 950,
    condition: 'Used - Good',
    category: 'Competitive Exams',
    listingType: 'Individual Seller',
    transaction: 'Buy + Exchange',
    exchangePreferences: 'Looking for Irodov Physics or Halliday Resnick',
    negotiable: true,
    location: 'Kalu Sarai, South Delhi',
    distance: '8.5 km away',
    city: 'Delhi NCR',
    language: 'English',
    delivery: 'Both',
    isbn: '978-8177091878',
    edition: '2023 Revised',
    publisher: 'Bharati Bhawan',
    pages: 940,
    publicationYear: 2023,
    description: 'Both volumes together! Gold standard for JEE Main & Advanced aspirants. Has helpful pencil notes in the Mechanics & Waves sections.',
    images: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 's-3',
      name: 'Rohan Gupta (IITD Student)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      rating: 5.0,
      reviewsCount: 27,
      verified: true,
      memberSince: 'August 2024',
      totalListings: 8,
      soldCount: 7,
      responseRate: '100% (instant replies)',
      location: 'Delhi NCR'
    },
    views: 890,
    favoritesCount: 78,
    status: 'Active',
    createdAt: '2026-09-15T09:15:00Z',
    isPopular: true,
    isNearYou: false
  },
  {
    id: 'b-104',
    title: 'NCERT Class 11 & 12 PCB Complete Set (8 Books)',
    author: 'NCERT Editorial Board',
    price: 550,
    originalPrice: 1450,
    condition: 'Acceptable',
    category: 'School Books',
    listingType: 'Individual Seller',
    transaction: 'Exchange',
    exchangePreferences: 'Wants: NEET Arihant 35 Years Solved Papers',
    negotiable: false,
    location: 'Alpha 1, Greater Noida, UP',
    distance: '6.2 km away',
    city: 'Greater Noida, UP',
    language: 'English',
    delivery: 'Pickup',
    isbn: '978-9352920002',
    edition: 'Latest NCERT Rationalized',
    publisher: 'NCERT New Delhi',
    pages: 1800,
    publicationYear: 2024,
    description: 'Physics 1 & 2, Chemistry 1 & 2, Biology Class 11 and 12. Ideal for CBSE board exams and NEET preparation. Neatly taped corners for longevity.',
    images: [
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 's-4',
      name: 'Ananya Deshmukh',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      rating: 4.7,
      reviewsCount: 14,
      verified: true,
      memberSince: 'February 2025',
      totalListings: 4,
      soldCount: 3,
      responseRate: '92% (replies in 2 hours)',
      location: 'Greater Noida, UP'
    },
    views: 420,
    favoritesCount: 31,
    status: 'Active',
    createdAt: '2026-09-21T18:00:00Z',
    isPopular: false,
    isNearYou: true
  },
  {
    id: 'b-105',
    title: 'The Psychology of Money: Timeless Lessons on Wealth',
    author: 'Morgan Housel',
    price: 220,
    originalPrice: 499,
    condition: 'Like New',
    category: 'Self Help',
    listingType: 'Individual Seller',
    transaction: 'Buy + Exchange',
    exchangePreferences: 'Wants: The Richest Man in Babylon or Think and Grow Rich',
    negotiable: true,
    location: 'Cyber City, Gurugram, HR',
    distance: '14.0 km away',
    city: 'Gurugram, HR',
    language: 'English',
    delivery: 'Both',
    isbn: '978-9390166268',
    edition: 'First Indian Edition',
    publisher: 'Jaico Publishing House',
    pages: 252,
    publicationYear: 2022,
    description: 'Brilliant read! Highlights 19 short stories exploring the strange ways people think about money. Pristine condition, kept in smoke-free home.',
    images: [
      'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 's-5',
      name: 'Vikramaditya Rao',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      rating: 4.9,
      reviewsCount: 45,
      verified: true,
      memberSince: 'November 2023',
      totalListings: 18,
      soldCount: 15,
      responseRate: '99% (replies in 10 mins)',
      location: 'Gurugram, HR'
    },
    views: 740,
    favoritesCount: 65,
    status: 'Active',
    createdAt: '2026-09-19T11:45:00Z',
    isPopular: true,
    isNearYou: false
  },
  {
    id: 'b-106',
    title: 'Guyton and Hall Textbook of Medical Physiology',
    author: 'John E. Hall, PhD',
    price: 1200,
    originalPrice: 3499,
    condition: 'Used - Good',
    category: 'Medical',
    listingType: 'Professional Seller',
    transaction: 'Buy',
    exchangePreferences: '',
    negotiable: true,
    location: 'Daryaganj Book Bazaar, Delhi',
    distance: '11.0 km away',
    city: 'Delhi NCR',
    language: 'English',
    delivery: 'Delivery',
    isbn: '978-8131244661',
    edition: '14th South Asia Edition',
    publisher: 'Elsevier Health Sciences',
    pages: 1152,
    publicationYear: 2021,
    description: 'Standard textbook for MBBS 1st year students. Full color illustrations intact, hardbound cover in excellent condition. Certified book dealer stock.',
    images: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584697964190-7bb88e999c06?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 's-pro-1',
      name: 'Pioneer Academic Booksellers',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80',
      rating: 4.9,
      reviewsCount: 230,
      verified: true,
      isBusiness: true,
      businessGst: '07AAACP1234F1Z5',
      memberSince: 'June 2022',
      totalListings: 145,
      soldCount: 420,
      responseRate: '100% (official store)',
      location: 'Delhi NCR'
    },
    views: 1120,
    favoritesCount: 89,
    status: 'Active',
    createdAt: '2026-09-17T08:20:00Z',
    isPopular: true,
    isNearYou: false
  },
  {
    id: 'b-107',
    title: 'One Piece Box Set (Vols 1-12 East Blue Arc)',
    author: 'Eiichiro Oda',
    price: 1850,
    originalPrice: 4500,
    condition: 'Like New',
    category: 'Comics',
    listingType: 'Individual Seller',
    transaction: 'Buy + Exchange',
    exchangePreferences: 'Looking for Death Note Black Editions or Berserk Deluxe',
    negotiable: false,
    location: 'Koramangala, Bangalore, KA',
    distance: '3.5 km away',
    city: 'Bangalore, KA',
    language: 'English',
    delivery: 'Both',
    isbn: '978-1421560748',
    edition: 'Viz Media Manga Tankobon',
    publisher: 'VIZ Media LLC',
    pages: 2400,
    publicationYear: 2022,
    description: 'English edition manga tankobon volumes 1 to 12. Stored in anti-humidity sleeves. No yellowing of manga paper whatsoever.',
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 's-6',
      name: 'Tanmay Bhattacharya',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
      rating: 4.9,
      reviewsCount: 31,
      verified: true,
      memberSince: 'September 2024',
      totalListings: 11,
      soldCount: 8,
      responseRate: '96% (replies within 30 mins)',
      location: 'Bangalore, KA'
    },
    views: 680,
    favoritesCount: 94,
    status: 'Active',
    createdAt: '2026-09-22T09:00:00Z',
    isPopular: true,
    isNearYou: false
  },
  {
    id: 'b-108',
    title: 'Indian Polity by M. Laxmikanth (7th Edition)',
    author: 'M. Laxmikanth',
    price: 399,
    originalPrice: 895,
    condition: 'Used - Good',
    category: 'Competitive Exams',
    listingType: 'Individual Seller',
    transaction: 'Buy + Exchange',
    exchangePreferences: 'Wants: Ramesh Singh Indian Economy or Bipin Chandra Modern India',
    negotiable: true,
    location: 'Rajendra Nagar, New Delhi',
    distance: '9.1 km away',
    city: 'Delhi NCR',
    language: 'English',
    delivery: 'Both',
    isbn: '978-9355325051',
    edition: '7th Latest Edition',
    publisher: 'McGraw Hill',
    pages: 880,
    publicationYear: 2023,
    description: 'The bible for UPSC Civil Services and State PCS examinations. Neatly underlined important articles and supreme court judgments. No loose pages.',
    images: [
      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 's-7',
      name: 'Deepak Meena',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
      rating: 4.8,
      reviewsCount: 22,
      verified: true,
      memberSince: 'May 2024',
      totalListings: 5,
      soldCount: 4,
      responseRate: '94% (replies in 45 mins)',
      location: 'Delhi NCR'
    },
    views: 930,
    favoritesCount: 82,
    status: 'Active',
    createdAt: '2026-09-21T12:10:00Z',
    isPopular: true,
    isNearYou: false
  },
  {
    id: 'b-109',
    title: 'Harry Potter and the Philosopher’s Stone (Illustrated Edition)',
    author: 'J.K. Rowling (Illustrated by Jim Kay)',
    price: 650,
    originalPrice: 1999,
    condition: 'Like New',
    category: 'Fiction',
    listingType: 'Individual Seller',
    transaction: 'Buy',
    exchangePreferences: '',
    negotiable: false,
    location: 'Hazratganj, Lucknow, UP',
    distance: '5.0 km away',
    city: 'Lucknow, UP',
    language: 'English',
    delivery: 'Both',
    isbn: '978-1408845646',
    edition: 'Deluxe Hardcover',
    publisher: 'Bloomsbury Childrens Books',
    pages: 256,
    publicationYear: 2020,
    description: 'Stunning full-colour illustrated edition! Heavy glossy art paper. Slipcase and ribbon bookmark completely intact. Collector condition.',
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 's-8',
      name: 'Kavita Mehrotra',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      rating: 5.0,
      reviewsCount: 16,
      verified: true,
      memberSince: 'October 2024',
      totalListings: 7,
      soldCount: 5,
      responseRate: '100% (instant replies)',
      location: 'Lucknow, UP'
    },
    views: 480,
    favoritesCount: 57,
    status: 'Active',
    createdAt: '2026-09-16T15:20:00Z',
    isPopular: true,
    isNearYou: false
  },
  {
    id: 'b-110',
    title: 'Data Structures and Algorithms in Java',
    author: 'Robert Lafore',
    price: 320,
    originalPrice: 750,
    condition: 'Used - Good',
    category: 'Engineering',
    listingType: 'Individual Seller',
    transaction: 'Buy + Exchange',
    exchangePreferences: 'Wants: Introduction to Algorithms (CLRS)',
    negotiable: true,
    location: 'Bandra West, Mumbai, MH',
    distance: '4.8 km away',
    city: 'Mumbai, MH',
    language: 'English',
    delivery: 'Both',
    isbn: '978-0672324536',
    edition: '2nd Edition',
    publisher: 'Sams Publishing',
    pages: 800,
    publicationYear: 2019,
    description: 'Clear explanations of binary trees, graphs, sorting heuristics, and recursion with practical Java examples. Clean pages without scribbles.',
    images: [
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 's-9',
      name: 'Sameer Merchant',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
      rating: 4.7,
      reviewsCount: 12,
      verified: true,
      memberSince: 'December 2024',
      totalListings: 3,
      soldCount: 2,
      responseRate: '91% (replies in 1 hour)',
      location: 'Mumbai, MH'
    },
    views: 310,
    favoritesCount: 28,
    status: 'Active',
    createdAt: '2026-09-22T16:00:00Z',
    isPopular: false,
    isNearYou: false
  },
  {
    id: 'b-111',
    title: 'The Alchemist (Hindi Edition - अल्केमिस्ट)',
    author: 'Paulo Coelho (अनुवाद: सुधीर दीक्षित)',
    price: 150,
    originalPrice: 350,
    condition: 'Used - Good',
    category: 'Novels',
    listingType: 'Individual Seller',
    transaction: 'Buy + Exchange',
    exchangePreferences: 'Looking for Premchand Godan or Gunahon Ka Devta',
    negotiable: false,
    location: 'Civil Lines, Jaipur, RJ',
    distance: '3.1 km away',
    city: 'Jaipur, RJ',
    language: 'Hindi',
    delivery: 'Pickup',
    isbn: '978-8183220880',
    edition: 'Hindi Translation',
    publisher: 'Manjul Publishing House',
    pages: 208,
    publicationYear: 2020,
    description: 'एक चरवाहे की आत्म-खोज और सपनों को पूरा करने की प्रेरणादायक यात्रा। साफ-सुथरी किताब, कोई पन्ना फटा हुआ नहीं है।',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 's-10',
      name: 'Manish Shekhawat',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      rating: 4.8,
      reviewsCount: 11,
      verified: true,
      memberSince: 'January 2025',
      totalListings: 4,
      soldCount: 3,
      responseRate: '95%',
      location: 'Jaipur, RJ'
    },
    views: 260,
    favoritesCount: 19,
    status: 'Active',
    createdAt: '2026-09-20T10:15:00Z',
    isPopular: false,
    isNearYou: false
  },
  {
    id: 'b-112',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    price: 180,
    originalPrice: 399,
    condition: 'Like New',
    category: 'Fiction',
    listingType: 'Individual Seller',
    transaction: 'Buy + Exchange',
    exchangePreferences: 'Open to any classic literature (George Orwell, Hemingway)',
    negotiable: true,
    location: 'Sector 18, Noida, UP',
    distance: '1.8 km away',
    city: 'Noida, UP',
    language: 'English',
    delivery: 'Both',
    isbn: '978-0141182636',
    edition: 'Penguin Modern Classics',
    publisher: 'Penguin Books',
    pages: 188,
    publicationYear: 2021,
    description: 'Unblemished copy. Bought for college literature seminar. Great vintage style cover.',
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 's-1',
      name: 'Aarav Sharma',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      rating: 4.9,
      reviewsCount: 38,
      verified: true,
      memberSince: 'March 2024',
      totalListings: 12,
      soldCount: 9,
      responseRate: '98%',
      location: 'Noida, UP'
    },
    views: 290,
    favoritesCount: 34,
    status: 'Active',
    createdAt: '2026-09-21T09:00:00Z',
    isPopular: false,
    isNearYou: true
  }
];

export const CURRENT_USER = {
  id: 'u-me',
  name: 'Dev Gupta',
  email: 'devg91055@gmail.com',
  phone: '+91 98765 43210',
  city: 'Noida, UP',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  role: 'user', // 'user' | 'business' | 'admin'
  verified: true,
  memberSince: 'January 2025',
  bio: 'Avid reader & tech enthusiast. Looking to exchange engineering textbooks and classic sci-fi novels in Noida / Delhi NCR.',
  favorites: ['b-101', 'b-103', 'b-105'],
  stats: {
    activeListings: 3,
    soldCount: 5,
    exchangeCount: 2,
    rating: 4.9,
    reviewsCount: 18,
    responseRate: '97%'
  }
};

export const INITIAL_CHATS = [
  {
    id: 'c-101',
    bookId: 'b-101',
    bookTitle: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    bookPrice: 350,
    bookImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&auto=format&fit=crop&q=80',
    otherUser: {
      id: 's-1',
      name: 'Aarav Sharma',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      verified: true,
      location: 'Sector 62, Noida, UP'
    },
    lastMessage: 'Sure, we can meet tomorrow near the Metro Station Gate 2 at 5 PM.',
    lastMessageTime: '10:45 AM',
    unreadCount: 1,
    messages: [
      { id: 'm-1', senderId: 'u-me', text: 'Hi Aarav, is this Clean Code book still available?', time: 'Yesterday, 8:12 PM' },
      { id: 'm-2', senderId: 's-1', text: 'Yes! Still available in great condition.', time: 'Yesterday, 8:20 PM' },
      { id: 'm-3', senderId: 'u-me', text: 'Can we do ₹300 for quick pickup tomorrow?', time: 'Yesterday, 8:35 PM' },
      { id: 'm-4', senderId: 's-1', text: 'Sure, we can meet tomorrow near the Metro Station Gate 2 at 5 PM.', time: '10:45 AM' }
    ]
  },
  {
    id: 'c-102',
    bookId: 'b-103',
    bookTitle: 'Concepts of Physics (Vol 1 & Vol 2 Set)',
    bookPrice: 450,
    bookImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200&auto=format&fit=crop&q=80',
    otherUser: {
      id: 's-3',
      name: 'Rohan Gupta',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      verified: true,
      location: 'South Delhi'
    },
    lastMessage: 'Are you interested in exchanging with Halliday Resnick?',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    messages: [
      { id: 'm-10', senderId: 's-3', text: 'Hey! Saw your offer on HC Verma.', time: 'Sep 21, 4:00 PM' },
      { id: 'm-11', senderId: 'u-me', text: 'Yes, looking for standard JEE prep books.', time: 'Sep 21, 4:10 PM' },
      { id: 'm-12', senderId: 's-3', text: 'Are you interested in exchanging with Halliday Resnick?', time: 'Yesterday, 2:30 PM' }
    ]
  },
  {
    id: 'c-103',
    bookId: 'b-102',
    bookTitle: 'Atomic Habits',
    bookPrice: 280,
    bookImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=200&auto=format&fit=crop&q=80',
    otherUser: {
      id: 's-2',
      name: 'Priya Verma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      verified: true,
      location: 'Indirapuram, Ghaziabad'
    },
    lastMessage: 'The price is fixed at ₹280 as it is practically brand new.',
    lastMessageTime: 'Sep 20',
    unreadCount: 0,
    messages: [
      { id: 'm-20', senderId: 'u-me', text: 'Hello Priya, is the price negotiable to ₹220?', time: 'Sep 20, 11:00 AM' },
      { id: 'm-21', senderId: 's-2', text: 'The price is fixed at ₹280 as it is practically brand new.', time: 'Sep 20, 11:15 AM' }
    ]
  }
];

export const INITIAL_OFFERS = [
  {
    id: 'off-1',
    buyer: {
      name: 'Sahil Kapoor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      location: 'Noida Sector 50'
    },
    book: {
      id: 'b-my-1',
      title: 'JavaScript: The Definitive Guide (7th Edition)',
      originalPrice: 650,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&auto=format&fit=crop&q=80'
    },
    offerPrice: 500,
    message: 'Can pick it up today evening from Noida Sector 50 if ₹500 works for you.',
    date: '2 hours ago',
    status: 'Pending'
  },
  {
    id: 'off-2',
    buyer: {
      name: 'Neha Chawla',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      location: 'Connaught Place, Delhi'
    },
    book: {
      id: 'b-my-2',
      title: 'Sapiens: A Brief History of Humankind',
      originalPrice: 320,
      image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=200&auto=format&fit=crop&q=80'
    },
    offerPrice: 260,
    message: 'Will pay ₹260 and cover pickup via WeFast/Dunzo.',
    date: 'Yesterday',
    status: 'Accepted'
  },
  {
    id: 'off-3',
    buyer: {
      name: 'Amitabh Jha',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      location: 'Greater Noida'
    },
    book: {
      id: 'b-my-1',
      title: 'JavaScript: The Definitive Guide (7th Edition)',
      originalPrice: 650,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&auto=format&fit=crop&q=80'
    },
    offerPrice: 300,
    message: 'Offer ₹300 cash right now.',
    date: '3 days ago',
    status: 'Rejected'
  }
];

export const INITIAL_EXCHANGES = [
  {
    id: 'ex-1',
    userName: 'Rahul Sinha',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    requestedBook: {
      title: 'Java: The Complete Reference (12th Ed)',
      condition: 'Used - Good',
      price: 450
    },
    offeredBook: {
      title: 'Spring in Action (6th Edition)',
      condition: 'Like New',
      author: 'Craig Walls',
      image: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=200&auto=format&fit=crop&q=80'
    },
    message: 'I finished my backend project and looking to dive into fundamental Java core. Spring in Action is in mint condition.',
    status: 'Pending',
    date: 'Today, 11:20 AM'
  },
  {
    id: 'ex-2',
    userName: 'Meera Sengupta',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    requestedBook: {
      title: 'Dune (Frank Herbert)',
      condition: 'Like New',
      price: 320
    },
    offeredBook: {
      title: 'Foundation (Isaac Asimov)',
      condition: 'Like New',
      author: 'Isaac Asimov',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&auto=format&fit=crop&q=80'
    },
    message: 'Would love to swap classic sci-fi! Both books are equal condition.',
    status: 'Accepted',
    date: 'Sep 20, 2026'
  },
  {
    id: 'ex-3',
    userName: 'Kunal Mathur',
    userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    requestedBook: {
      title: 'Operating System Concepts (Silberschatz)',
      condition: 'Used - Good',
      price: 400
    },
    offeredBook: {
      title: 'Database System Concepts (Korth)',
      condition: 'Acceptable',
      author: 'Silberschatz, Korth',
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200&auto=format&fit=crop&q=80'
    },
    message: 'College semester exchange. Let me know if you are taking DBMS this term.',
    status: 'Completed',
    date: 'Sep 12, 2026'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ORD-89241',
    trackingNumber: 'BL-EXP-892410-NCR',
    type: 'buying',
    bookId: 'b-101',
    bookTitle: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    bookAuthor: 'Robert C. Martin',
    bookImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
    condition: 'Used - Good',
    category: 'Engineering',
    partyName: 'Aarav Sharma',
    partyRole: 'Seller',
    partyAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    partyPhone: '+91 98765 43210',
    partyRating: 4.9,
    partyVerified: true,
    price: 350,
    originalPrice: 899,
    deliveryMethod: 'Hand-to-hand Meetup (Noida Metro Gate 2)',
    carrier: 'BookLoop Direct Peer Handshake',
    date: '23 Sep 2026, 10:30 AM',
    estimatedDelivery: 'Today by 5:30 PM (Scheduled Handshake)',
    deliveryOtp: '4829',
    status: 'Confirmed',
    urgentBanner: 'Arriving Today: Scheduled handover at Metro Gate 2',
    payment: {
      method: 'UPI (BookLoop Escrow Protection)',
      status: 'Paid (Secured in Escrow)',
      transactionId: 'UPI/260923/88924109',
      subtotal: 350,
      deliveryFee: 0,
      protectionFee: 0,
      discount: 549,
      total: 350
    },
    deliveryLocation: {
      type: 'meetup',
      title: 'Noida City Centre Metro Station (Blue Line)',
      landmark: 'Outside Gate No. 2, near Coffee Day kiosk',
      address: 'Captain Vijyant Thapar Marg, Sector 39, Noida, UP 201301',
      instructions: 'Please inspect the code examples and pages before sharing OTP 4829 with seller.'
    },
    timeline: [
      {
        title: 'Order Placed & Escrow Secured',
        description: 'You paid ₹350 via UPI. Funds are securely locked in BookLoop Escrow until you inspect the book.',
        time: '23 Sep, 10:15 AM',
        completed: true,
        current: false,
        location: 'Sector 62, Noida'
      },
      {
        title: 'Confirmed by Aarav Sharma',
        description: 'Seller accepted order, verified book condition (Used - Good), and agreed to meetup.',
        time: '23 Sep, 10:45 AM',
        completed: true,
        current: true,
        location: 'Sector 62, Noida'
      },
      {
        title: 'Handover Meetup Scheduled',
        description: 'Both parties agreed to meet today between 4:30 PM – 5:30 PM at Metro Gate 2.',
        time: 'Expected 24 Sep, 4:30 PM',
        completed: false,
        current: false,
        location: 'Noida City Centre Gate 2'
      },
      {
        title: 'Inspection & Escrow Release',
        description: 'Check book spine, binding, and verify pages. Share OTP 4829 to release funds.',
        time: 'Pending Inspection',
        completed: false,
        current: false,
        location: 'Gate 2 Handover Point'
      }
    ]
  },
  {
    id: 'ORD-89110',
    trackingNumber: 'DEL-SURF-994102-IN',
    type: 'selling',
    bookId: 'b-my-2',
    bookTitle: 'Sapiens: A Brief History of Humankind',
    bookAuthor: 'Yuval Noah Harari',
    bookImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&auto=format&fit=crop&q=80',
    condition: 'Used - Good',
    category: 'Non-Fiction',
    partyName: 'Neha Chawla',
    partyRole: 'Buyer',
    partyAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    partyPhone: '+91 98112 34567',
    partyRating: 4.8,
    partyVerified: true,
    price: 260,
    originalPrice: 499,
    deliveryMethod: 'Courier Pickup & Express Delivery',
    carrier: 'Delhivery Surface (AWB: 9941028120)',
    date: '21 Sep 2026, 02:15 PM',
    estimatedDelivery: 'Tomorrow by 8:00 PM',
    deliveryOtp: '7193',
    status: 'Shipped',
    urgentBanner: 'In Transit: Package dispatched via Delhivery Express',
    payment: {
      method: 'Prepaid (Net Banking / Card)',
      status: 'Secured in BookLoop Escrow',
      transactionId: 'TXN/260921/7192810',
      subtotal: 260,
      deliveryFee: 40,
      protectionFee: 0,
      discount: 239,
      total: 300
    },
    deliveryLocation: {
      type: 'doorstep',
      title: 'Buyer Home Address',
      landmark: 'Opposite Barakhamba Road Plaza',
      address: 'Flat 402, Block B, Connaught Place, New Delhi 110001',
      instructions: 'Leave with security at main reception if resident unavailable.'
    },
    timeline: [
      {
        title: 'Order Placed & Escrow Paid',
        description: 'Neha Chawla placed order. ₹260 secured in BookLoop escrow protection.',
        time: '21 Sep, 02:15 PM',
        completed: true,
        current: false,
        location: 'Connaught Place, New Delhi'
      },
      {
        title: 'Packed & Label Generated',
        description: 'You packaged Sapiens securely in waterproof bubble mailer and printed AWB label.',
        time: '21 Sep, 05:40 PM',
        completed: true,
        current: false,
        location: 'Seller Residence, Noida'
      },
      {
        title: 'Picked up by Delhivery Agent',
        description: 'Delhivery pickup executive picked up parcel. Package scanned at Noida Hub.',
        time: '22 Sep, 11:15 AM',
        completed: true,
        current: true,
        location: 'Delhi NCR Hub - Okhla'
      },
      {
        title: 'Out for Delivery to Connaught Place',
        description: 'Package arriving at destination delivery center for last-mile transit.',
        time: 'Expected 25 Sep, 10:00 AM',
        completed: false,
        current: false,
        location: 'Central Delhi Delivery Hub'
      },
      {
        title: 'Delivered & Payout Released',
        description: 'Buyer receives book. Earnings of ₹260 will be instantly credited to your wallet.',
        time: 'Pending Delivery',
        completed: false,
        current: false,
        location: 'Destination'
      }
    ]
  },
  {
    id: 'ORD-88742',
    trackingNumber: 'BL-MET-887421-DEL',
    type: 'buying',
    bookId: 'b-103',
    bookTitle: 'Rich Dad Poor Dad',
    bookAuthor: 'Robert T. Kiyosaki',
    bookImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&auto=format&fit=crop&q=80',
    condition: 'Like New',
    category: 'Personal Finance',
    partyName: 'Vivek Oberoi',
    partyRole: 'Seller',
    partyAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    partyPhone: '+91 99100 88221',
    partyRating: 5.0,
    partyVerified: true,
    price: 190,
    originalPrice: 499,
    deliveryMethod: 'Campus Handover',
    carrier: 'Local Campus Meetup',
    date: '14 Sep 2026, 04:00 PM',
    estimatedDelivery: 'Delivered on 14 Sep, 05:15 PM',
    deliveryOtp: 'Verified',
    status: 'Completed',
    urgentBanner: null,
    payment: {
      method: 'Cash Handover upon Meetup',
      status: 'Settled & Verified',
      transactionId: 'CASH/140926/88742',
      subtotal: 190,
      deliveryFee: 0,
      protectionFee: 0,
      discount: 309,
      total: 190
    },
    deliveryLocation: {
      type: 'meetup',
      title: 'University Central Library Porch',
      landmark: 'Near the main fountain steps',
      address: 'Amity / JIIT University Campus, Sector 62, Noida, UP',
      instructions: 'Met between afternoon classes, inspected book pages and handed ₹190 in cash.'
    },
    timeline: [
      {
        title: 'Order Placed',
        description: 'You requested campus pickup for Rich Dad Poor Dad.',
        time: '14 Sep, 04:00 PM',
        completed: true,
        current: false,
        location: 'Campus Quad'
      },
      {
        title: 'Confirmed by Vivek',
        description: 'Vivek agreed to meet at the library porch after his 4:30 PM lecture.',
        time: '14 Sep, 04:20 PM',
        completed: true,
        current: false,
        location: 'Library Porch'
      },
      {
        title: 'Inspected & Handed Over',
        description: 'Book condition checked. High-quality paper, no tears. Paid ₹190 cash.',
        time: '14 Sep, 05:10 PM',
        completed: true,
        current: false,
        location: 'Library Steps'
      },
      {
        title: 'Order Completed & Rated 5★',
        description: 'Both buyer and seller exchanged positive feedback.',
        time: '14 Sep, 05:15 PM',
        completed: true,
        current: true,
        location: 'Campus'
      }
    ]
  },
  {
    id: 'ORD-87619',
    trackingNumber: 'BL-EXP-876192-DEL',
    type: 'buying',
    bookId: 'b-my-1',
    bookTitle: 'JavaScript: The Definitive Guide (7th Edition)',
    bookAuthor: 'David Flanagan',
    bookImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
    condition: 'Like New',
    category: 'Engineering',
    partyName: 'Sahil Kapoor',
    partyRole: 'Seller',
    partyAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    partyPhone: '+91 97180 55432',
    partyRating: 4.9,
    partyVerified: true,
    price: 650,
    originalPrice: 1899,
    deliveryMethod: 'Express Peer Delivery (Same Day)',
    carrier: 'BookLoop Local Rider (Partner: Dunzo/Porter)',
    date: 'Today, 09:15 AM',
    estimatedDelivery: 'Arriving in 2 hours (Today by 4:00 PM)',
    deliveryOtp: '8392',
    status: 'Out for Delivery',
    urgentBanner: 'Arriving Today: Rider is on the way to your location',
    payment: {
      method: 'UPI (BookLoop Escrow Protection)',
      status: 'Paid (Secured in Escrow)',
      transactionId: 'UPI/240926/8761920',
      subtotal: 650,
      deliveryFee: 0,
      protectionFee: 0,
      discount: 1249,
      total: 650
    },
    deliveryLocation: {
      type: 'doorstep',
      title: 'Home / Office Address',
      landmark: 'Near Electronic City Metro Station',
      address: 'Tower B, Floor 6, Logix Cyber Park, Sector 62, Noida, UP 201309',
      instructions: 'Rider can call from the ground reception. OTP 8392 required upon delivery.'
    },
    timeline: [
      {
        title: 'Order Placed & Escrow Locked',
        description: 'Order confirmed and payment verified via UPI. You saved ₹1,249 (65% off MRP).',
        time: 'Today, 09:15 AM',
        completed: true,
        current: false,
        location: 'Sector 62, Noida'
      },
      {
        title: 'Seller Prepared Package',
        description: 'Sahil Kapoor packed the 700-page book with corner bubble guards.',
        time: 'Today, 10:30 AM',
        completed: true,
        current: false,
        location: 'Noida Sector 50'
      },
      {
        title: 'Assigned to Express Rider',
        description: 'Rider Amit Kumar (+91 98234 56789) picked up package from seller.',
        time: 'Today, 12:45 PM',
        completed: true,
        current: false,
        location: 'Sector 50 Hub'
      },
      {
        title: 'Out for Delivery (Live On Route)',
        description: 'Rider is 3.2 km away heading toward Logix Cyber Park.',
        time: 'Today, 01:30 PM',
        completed: true,
        current: true,
        location: 'Sector 62 Roadways'
      },
      {
        title: 'Delivery & Escrow Release',
        description: 'Inspect pages and code listings. Share OTP 8392 with Amit Kumar.',
        time: 'Expected by 4:00 PM',
        completed: false,
        current: false,
        location: 'Tower B Reception'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'n-1',
    type: 'message',
    title: 'New message from Aarav Sharma',
    description: 'Regarding "Clean Code": Sure, we can meet tomorrow near Metro Gate 2.',
    time: '15 minutes ago',
    read: false,
    link: '/chat/c-101'
  },
  {
    id: 'n-2',
    type: 'offer',
    title: 'New offer received! ₹500',
    description: 'Sahil Kapoor made an offer on "JavaScript: The Definitive Guide".',
    time: '2 hours ago',
    read: false,
    link: '/dashboard/offers'
  },
  {
    id: 'n-3',
    type: 'exchange',
    title: 'Exchange request from Rahul Sinha',
    description: 'Rahul offered "Spring in Action" in swap for your Java book.',
    time: '4 hours ago',
    read: false,
    link: '/dashboard/exchanges'
  },
  {
    id: 'n-4',
    type: 'listing',
    title: 'Your book listing is now live!',
    description: '"JavaScript: The Definitive Guide" has been published and is visible to nearby readers.',
    time: '1 day ago',
    read: true,
    link: '/dashboard/listings'
  },
  {
    id: 'n-5',
    type: 'order',
    title: 'Order Status Updated',
    description: 'Order #ORD-89110 has been marked as Shipped.',
    time: '2 days ago',
    read: true,
    link: '/dashboard/orders'
  }
];

export const MY_LISTINGS = [
  {
    id: 'b-my-1',
    title: 'JavaScript: The Definitive Guide (7th Edition)',
    author: 'David Flanagan',
    price: 650,
    condition: 'Like New',
    category: 'Engineering',
    status: 'Active',
    views: 184,
    favorites: 12,
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80'],
    location: 'Sector 62, Noida, UP',
    date: '18 Sep 2026'
  },
  {
    id: 'b-my-2',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    price: 320,
    condition: 'Used - Good',
    category: 'Non-Fiction',
    status: 'Pending',
    views: 95,
    favorites: 6,
    images: ['https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&auto=format&fit=crop&q=80'],
    location: 'Sector 62, Noida, UP',
    date: '15 Sep 2026'
  },
  {
    id: 'b-my-3',
    title: 'Java: The Complete Reference (12th Ed)',
    author: 'Herbert Schildt',
    price: 450,
    condition: 'Used - Good',
    category: 'Engineering',
    status: 'Active',
    views: 240,
    favorites: 19,
    images: ['https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=400&auto=format&fit=crop&q=80'],
    location: 'Sector 62, Noida, UP',
    date: '10 Sep 2026'
  },
  {
    id: 'b-my-4',
    title: 'Zero to One: Notes on Startups',
    author: 'Peter Thiel',
    price: 200,
    condition: 'Like New',
    category: 'Self Help',
    status: 'Sold',
    views: 310,
    favorites: 28,
    images: ['https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&auto=format&fit=crop&q=80'],
    location: 'Sector 62, Noida, UP',
    date: '02 Sep 2026'
  }
];

export const PROFESSIONAL_INVENTORY = [
  {
    id: 'pro-inv-1',
    sku: 'MED-GYT-14',
    title: 'Guyton and Hall Textbook of Medical Physiology',
    author: 'John E. Hall',
    isbn: '978-8131244661',
    publisher: 'Elsevier Health',
    edition: '14th Edition',
    price: 1200,
    mrp: 3499,
    stock: 24,
    condition: 'Brand New',
    soldCount: 86,
    category: 'Medical',
    shipping: 'Free Express Delivery'
  },
  {
    id: 'pro-inv-2',
    sku: 'ENG-CLRS-4',
    title: 'Introduction to Algorithms (CLRS)',
    author: 'Cormen, Leiserson, Rivest, Stein',
    isbn: '978-0262046305',
    publisher: 'MIT Press',
    edition: '4th Edition',
    price: 999,
    mrp: 1899,
    stock: 18,
    condition: 'Brand New',
    soldCount: 142,
    category: 'Engineering',
    shipping: 'Standard ₹40'
  },
  {
    id: 'pro-inv-3',
    sku: 'EXM-LAX-7',
    title: 'Indian Polity for Civil Services Examination',
    author: 'M. Laxmikanth',
    isbn: '978-9355325051',
    publisher: 'McGraw Hill',
    edition: '7th Edition',
    price: 420,
    mrp: 895,
    stock: 45,
    condition: 'Brand New',
    soldCount: 310,
    category: 'Competitive Exams',
    shipping: 'Free Delivery on 2+ items'
  },
  {
    id: 'pro-inv-4',
    sku: 'SCH-NCERT-PCB',
    title: 'NCERT Class 12 Physics, Chemistry, Biology Bundle',
    author: 'NCERT Editorial Board',
    isbn: '978-9352920118',
    publisher: 'NCERT New Delhi',
    edition: '2025 Edition',
    price: 680,
    mrp: 1120,
    stock: 30,
    condition: 'Brand New',
    soldCount: 195,
    category: 'School Books',
    shipping: 'Free Delivery'
  }
];

export const ADMIN_USERS = [
  { id: 'u-1', name: 'Aarav Sharma', email: 'aarav.s@gmail.com', city: 'Noida, UP', role: 'Individual', listings: 12, rating: 4.9, status: 'Active', joined: 'Mar 2024' },
  { id: 'u-2', name: 'Pioneer Academic Books', email: 'sales@pioneeracademic.in', city: 'Delhi NCR', role: 'Professional', listings: 145, rating: 4.9, status: 'Verified Store', joined: 'Jun 2022' },
  { id: 'u-3', name: 'Priya Verma', email: 'priya.v@outlook.com', city: 'Ghaziabad, UP', role: 'Individual', listings: 6, rating: 4.8, status: 'Active', joined: 'Jan 2025' },
  { id: 'u-4', name: 'Fake Book Scam Account', email: 'deal772@tempmail.com', city: 'Unknown', role: 'Individual', listings: 1, rating: 1.2, status: 'Flagged', joined: 'Yesterday' },
  { id: 'u-5', name: 'Tanmay Bhattacharya', email: 'tanmay.b@gmail.com', city: 'Bangalore, KA', role: 'Individual', listings: 11, rating: 4.9, status: 'Active', joined: 'Sep 2024' }
];

export const ADMIN_REPORTS = [
  {
    id: 'rep-1',
    bookId: 'b-101',
    bookTitle: 'Clean Code: A Handbook',
    reportedBy: 'Kunal Verma',
    reason: 'Wrong information',
    details: 'Seller listed it as 2024 edition but the ISBN photos show 2018 edition.',
    date: '22 Sep 2026',
    status: 'Under Review'
  },
  {
    id: 'rep-2',
    bookId: 'b-fake-99',
    bookTitle: 'Free Medical Textbook Pirated PDF',
    reportedBy: 'Dr. Ananya Rao',
    reason: 'Fraud / Scam',
    details: 'Seller attempting to sell digital torrent PDF as physical book via UPI advance.',
    date: '23 Sep 2026',
    status: 'Pending'
  }
];
