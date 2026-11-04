import { TourPackage } from '@/types';

export const INITIAL_PACKAGES: TourPackage[] = [
  {
    id: 'td-01',
    slug: 'kashmir-paradise-on-earth',
    title: 'Kashmir: Paradise On Earth & Dal Lake Escapade',
    tagline: 'Glide on Shikaras, wander Mughal gardens, and soak in snowy Gulmarg peaks.',
    state: 'Jammu & Kashmir',
    location: 'Srinagar, Gulmarg, Pahalgam & Sonamarg',
    duration: { days: 6, nights: 5 },
    price: 24999,
    originalPrice: 32000,
    featured: true,
    status: 'featured',
    rating: 4.9,
    reviewsCount: 142,
    bannerImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/n3kUvD4gVqU',
    overview: 'Experience the magic of heaven on earth. Enjoy luxury stays in authentic Srinagar houseboats, take a romantic Shikara ride across Dal Lake, take the high-altitude Gulmarg Gondola, and marvel at the pristine valleys of Pahalgam and Betaab Valley.',
    theme: 'Honeymoon',
    highlights: [
      'Luxury traditional houseboat stay on Dal Lake',
      'Sunset Shikara ride with Kahwa tasting',
      'Gulmarg Gondola Phase 1 & 2 pass experience',
      'River Rafting in Lidder River, Pahalgam',
      'Visit Mughal Gardens: Nishat & Shalimar Bagh'
    ],
    inclusions: [
      '5 Nights Deluxe Accommodations (1N Houseboat + 4N 4-Star Hotels)',
      'Daily Buffet Breakfast and Gourmet Dinners',
      'Private AC Cab for all inter-city transfers and local sightseeing',
      '1 Hour complimentary Dal Lake Shikara ride',
      'Toll taxes, parking, driver allowances, and 24/7 on-trip assistance'
    ],
    exclusions: [
      'Airfare / Train tickets to Srinagar',
      'Pony rides or local ATV rentals',
      'Gondola cable car tickets (can be pre-booked on request)',
      'Personal expenses, laundry, tips, and personal insurance'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Srinagar & Dal Lake Shikara Ride',
        description: 'Warm welcome at Srinagar Airport. Transfer to your luxury houseboat. Evening relaxing Shikara ride across the serene Dal Lake taking in floating markets.',
        meals: 'Dinner included',
        hotel: 'Deluxe Heritage Houseboat, Srinagar',
        activities: ['Airport Meet & Greet', 'Shikara Sunset Cruise', 'Kahwa Welcome']
      },
      {
        day: 2,
        title: 'Srinagar to Gulmarg - Meadow of Flowers',
        description: 'Morning scenic drive to Gulmarg. Witness snow-clad peaks, pine forests, and take the legendary Gulmarg Gondola up to Apharwat peak.',
        meals: 'Breakfast & Dinner',
        hotel: 'Pine Palace Resort / similar, Gulmarg',
        activities: ['Gulmarg Gondola Ride', 'Snow Sports / Trekking', 'Golf Course Walk']
      },
      {
        day: 3,
        title: 'Gulmarg to Pahalgam - The Valley of Shepherds',
        description: 'Journey to the breathtaking valleys of Pahalgam via saffron fields of Pampore and Awantipora ruins. Check into your river-facing resort.',
        meals: 'Breakfast & Dinner',
        hotel: 'Pahalgam Pines Retreat, Pahalgam',
        activities: ['Pampore Saffron Farms', 'Lidder River Walk', 'Campfire Evening']
      },
      {
        day: 4,
        title: 'Exploring Betaab Valley, Aru & Chandanwari',
        description: 'Full day excursion to the scenic Betaab Valley, tranquil Aru Valley, and Chandanwari. Experience untouched Himalayan pine trails.',
        meals: 'Breakfast & Dinner',
        hotel: 'Pahalgam Pines Retreat, Pahalgam',
        activities: ['Betaab Valley Tour', 'Aru Village Exploration', 'Local Trout Tasting']
      },
      {
        day: 5,
        title: 'Pahalgam to Srinagar & Mughal Gardens Tour',
        description: 'Drive back to Srinagar. Explore UNESCO-nominated Mughal Gardens: Shalimar Bagh, Nishat Bagh, and the historic Shankaracharya Temple.',
        meals: 'Breakfast & Dinner',
        hotel: 'Four Points by Sheraton / similar, Srinagar',
        activities: ['Nishat Bagh', 'Shalimar Bagh', 'Lal Chowk Handicraft Shopping']
      },
      {
        day: 6,
        title: 'Farewell Kashmir - Departure',
        description: 'Enjoy a leisurely breakfast overlooking the snow peaks. Transfer to Srinagar Airport with unforgettable memories.',
        meals: 'Breakfast',
        activities: ['Airport Transfer', 'Souvenir Gifting']
      }
    ],
    groupSize: '2 to 12 persons',
    bestTimeToVisit: 'March to October (Summer & Blooms) or Dec to Feb (Snow)'
  },
  {
    id: 'td-02',
    slug: 'himachal-manali-kasol-spiti-gateway',
    title: 'Himachal: Manali, Solang & Kasol Parvati Trail',
    tagline: 'Roam roaring river gorges, snow valleys, cedar trails, and bohemian cafes.',
    state: 'Himachal Pradesh',
    location: 'Manali, Solang Valley, Kasol & Manikaran',
    duration: { days: 5, nights: 4 },
    price: 16999,
    originalPrice: 21999,
    featured: true,
    status: 'featured',
    rating: 4.8,
    reviewsCount: 218,
    bannerImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/ScMzIvxBSi4',
    overview: 'The quintessential mountain getaway. Discover mist-covered cedar woodlands in Old Manali, thrill to paragliding and zip-lining at Solang Valley, and unwind along the turquoise waters of Parvati River in Kasol.',
    theme: 'Adventure',
    highlights: [
      'Atal Tunnel drive to Sissu waterfall (Lahaul Valley)',
      'Adrenaline sports at Solang Valley (Paragliding, Quad Biking)',
      'Old Manali cafe-hopping & Hadimba Temple',
      'Riverside bonfire & music in Kasol',
      'Holy dip at natural hot springs of Manikaran Sahib'
    ],
    inclusions: [
      '4 Nights accommodation in 3-star boutique resorts / riverside camps',
      'Breakfast and Dinner throughout the trip',
      'Dedicated AC Sedan / Innova for sightseeing and transfers',
      'Guided trek to Chalal village',
      'All driver allowances, permits, and fuel charges'
    ],
    exclusions: [
      'Adventure activities fee at Solang Valley',
      'Lunch and mid-day snacks',
      'Heater charges at hotels if applicable',
      'Anything not mentioned in inclusions'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Manali & Old Manali Stroll',
        description: 'Check in to your resort with panoramic views of the Pir Panjal range. Visit Hadimba Devi Temple and explore bohemian cafes in Old Manali.',
        meals: 'Dinner',
        hotel: 'Snow Valley Resort / similar, Manali',
        activities: ['Hadimba Temple', 'Mall Road Manali', 'Cafe 1947']
      },
      {
        day: 2,
        title: 'Solang Valley & Atal Tunnel to Sissu',
        description: 'Excursion through the engineering marvel Atal Tunnel to Sissu in Lahaul Valley. Indulge in paragliding, skiing, or snowmobile rides at Solang.',
        meals: 'Breakfast & Dinner',
        hotel: 'Snow Valley Resort / similar, Manali',
        activities: ['Atal Tunnel Drive', 'Sissu Waterfall', 'Solang Adventure Hub']
      },
      {
        day: 3,
        title: 'Manali to Kasol & Parvati River Valley',
        description: 'Drive along Kullu valley with an option for Beas river rafting. Head deep into the mystical Parvati Valley to Kasol. Check into luxury riverside camps.',
        meals: 'Breakfast & Dinner',
        hotel: 'The Himalayan Woods Camp / Riverside Retreat Kasol',
        activities: ['White Water Rafting (optional)', 'Kasol Flea Market', 'Riverside Bonfire']
      },
      {
        day: 4,
        title: 'Manikaran Sahib Hot Springs & Chalal Village Trek',
        description: 'Visit the revered Manikaran Sahib Gurudwara and its therapeutic natural hot sulfur springs. Afternoon scenic pine walk to serene Chalal village.',
        meals: 'Breakfast & Dinner',
        hotel: 'Riverside Retreat Kasol',
        activities: ['Manikaran Gurudwara', 'Chalal Forest Trail', 'Israeli Cuisine Trail']
      },
      {
        day: 5,
        title: 'Farewell Himachal & Departure',
        description: 'Enjoy a slow morning cup of Himalayan tea by the river. Drive back towards Chandigarh / Delhi with heart-stirring mountain memories.',
        meals: 'Breakfast',
        activities: ['Check-out & Transfer']
      }
    ],
    groupSize: 'Solo, Couples & Groups',
    bestTimeToVisit: 'Throughout the year'
  },
  {
    id: 'td-03',
    slug: 'rajasthan-royal-heritage-jaipur-udaipur-jodhpur',
    title: 'Rajasthan: Grand Royalty Jaipur, Jodhpur & Udaipur',
    tagline: 'Palaces of marble, desert fortresses, mirror mosaics, and royal hospitality.',
    state: 'Rajasthan',
    location: 'Jaipur, Jodhpur & Udaipur',
    duration: { days: 7, nights: 6 },
    price: 29999,
    originalPrice: 38000,
    featured: true,
    status: 'featured',
    rating: 4.95,
    reviewsCount: 310,
    bannerImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1592635196078-9fe3d54f2377?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/nU_qL454J40',
    overview: 'Step into the realm of Maharajas and regal grandeur. Marvel at Amber Fort and Hawa Mahal in the Pink City of Jaipur, explore the mighty Mehrangarh Fort in the Blue City of Jodhpur, and conclude with romantic boat cruises on Lake Pichola in Udaipur.',
    theme: 'Heritage',
    highlights: [
      'Heritage Havelis & 4-Star Palatial hotel stays',
      'Amber Fort elephant/jeep ascent and City Palace tour',
      'Sunset views over Blue City from Mehrangarh ramparts',
      'Boat cruise on Lake Pichola overlooking Jag Mandir',
      'Traditional Rajasthani Thali dinner & folk dance show'
    ],
    inclusions: [
      '6 Nights Royal Heritage Hotel stays',
      'Daily Royal Breakfast and Authentic Dinners',
      'Private air-conditioned Chauffeur-driven vehicle throughout',
      'Lake Pichola boat cruise pass in Udaipur',
      'Guide fees at Amber Fort & Mehrangarh'
    ],
    exclusions: [
      'Monument entry tickets',
      'Camera / Videography permits at historical sites',
      'Personal tipping and shopping'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Pink City Jaipur',
        description: 'Welcome with traditional garlands. Check-in to your heritage hotel. Evening visit to Birla Temple and colorful Bapu Bazaar.',
        meals: 'Dinner',
        hotel: 'Alsisar Haveli / Narain Niwas Palace, Jaipur',
        activities: ['Garland Welcome', 'Bapu Bazaar Walking', 'Chokhi Dhani Folk Evening']
      },
      {
        day: 2,
        title: 'Jaipur: Amber Fort, Hawa Mahal & City Palace',
        description: 'Ascend Amber Fort overlooking Maota Lake. Stop by Jal Mahal for photographs. Tour the City Palace museum and Jantar Mantar observatory.',
        meals: 'Breakfast & Dinner',
        hotel: 'Alsisar Haveli, Jaipur',
        activities: ['Amber Fort', 'Hawa Mahal Photo Op', 'City Palace & Museum']
      },
      {
        day: 3,
        title: 'Jaipur to Jodhpur - The Sun & Blue City',
        description: 'Drive westward towards Jodhpur. Stop at the ancient stepwell Toorji Ka Jhalra. Explore the vibrant indigo-painted lanes of the old city.',
        meals: 'Breakfast & Dinner',
        hotel: 'Ranbanka Palace / Ajit Bhawan, Jodhpur',
        activities: ['Toorji Stepwell', 'Blue City Heritage Walk', 'Clock Tower Market']
      },
      {
        day: 4,
        title: 'Mehrangarh Fort & Drive to Udaipur via Ranakpur',
        description: 'Tour the impregnable Mehrangarh Fort and Jaswant Thada. Journey through Aravali hills stopping at the 1444-carved-pillar Ranakpur Jain Temple.',
        meals: 'Breakfast & Dinner',
        hotel: 'Fateh Garh Heritage Resort / similar, Udaipur',
        activities: ['Mehrangarh Fort', 'Jaswant Thada', 'Ranakpur Marble Temple']
      },
      {
        day: 5,
        title: 'Udaipur: City of Lakes & Royal Romance',
        description: 'Explore the grand Udaipur City Palace complex on Lake Pichola. Visit Saheliyon Ki Bari and take an evening boat cruise around Jag Mandir.',
        meals: 'Breakfast & Dinner',
        hotel: 'Fateh Garh Heritage Resort, Udaipur',
        activities: ['City Palace Udaipur', 'Saheliyon Ki Bari', 'Lake Pichola Sunset Boat']
      },
      {
        day: 6,
        title: 'Udaipur: Monsoon Palace & Cultural Arts',
        description: 'Ascend Sajjangarh (Monsoon Palace) for bird-eye sunset views. Evening Bagore Ki Haveli folk dance & puppet performance.',
        meals: 'Breakfast & Dinner',
        hotel: 'Fateh Garh Heritage Resort, Udaipur',
        activities: ['Monsoon Palace', 'Bagore Ki Haveli Show', 'Miniature Painting Workshop']
      },
      {
        day: 7,
        title: 'Departure from Udaipur',
        description: 'Relish a royal breakfast on the terrace. Airport transfer for onward journey.',
        meals: 'Breakfast',
        activities: ['Udaipur Airport Transfer']
      }
    ],
    groupSize: '2 to 14 persons',
    bestTimeToVisit: 'October to March'
  },
  {
    id: 'td-04',
    slug: 'kerala-gods-own-country-backwaters-munnar',
    title: 'Kerala: Munnar Tea Hills, Alleppey Houseboat & Kochi',
    tagline: 'Rolling emerald plantations, tranquil backwaters, and Ayurvedic breezes.',
    state: 'Kerala',
    location: 'Kochi, Munnar, Thekkady & Alleppey',
    duration: { days: 6, nights: 5 },
    price: 22499,
    originalPrice: 28999,
    featured: true,
    status: 'featured',
    rating: 4.9,
    reviewsCount: 189,
    bannerImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/R83BlU5nnbs',
    overview: 'Immerse yourself in God\'s Own Country. Drive through misty tea estates of Munnar, observe wild spice groves in Thekkady, and cruise slowly through Alleppey\'s palm-fringed canals aboard a private traditional Kettuvallam houseboat.',
    theme: 'Nature',
    highlights: [
      'Private luxury Kettuvallam Houseboat cruise in Alleppey',
      'Eravikulam National Park and Nilgiri Tahr spotting',
      'Spice plantation guided walk with authentic aroma tasting',
      'Kathakali dance performance and Kalaripayattu martial art show',
      'Authentic Kerala Sadhya served on banana leaf'
    ],
    inclusions: [
      '4 Nights in 4-Star Plantation Resorts + 1 Night in Alleppey AC Houseboat',
      'All meals on houseboat (Lunch, High Tea, Dinner, Breakfast)',
      'Daily breakfast at hotels',
      'Private AC vehicle for all transfers and tours',
      'Spice plantation entry and boat safari booking'
    ],
    exclusions: [
      'Flight tickets to/from Kochi',
      'Optional Ayurvedic massage therapies',
      'Meals not specified in itinerary'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival Kochi & Drive to Munnar',
        description: 'Pickup from Kochi Airport. Drive through the Western Ghats past Cheeyappara and Valara waterfalls. Check in to mountain tea resort.',
        meals: 'Dinner',
        hotel: 'The Leaf Munnar / Fragrant Nature Resort',
        activities: ['Cheeyappara Falls', 'Tea Gardens Photo Shoot']
      },
      {
        day: 2,
        title: 'Munnar Tea Estates & Eravikulam National Park',
        description: 'Visit Rajamalai / Eravikulam National park, home to the endangered Nilgiri Tahr. Tour the Tea Museum, Mattupetty Dam, and Echo Point.',
        meals: 'Breakfast & Dinner',
        hotel: 'The Leaf Munnar',
        activities: ['Eravikulam Park', 'Tata Tea Museum', 'Mattupetty Speedboating']
      },
      {
        day: 3,
        title: 'Munnar to Thekkady (Periyar Wildlife Sanctuary)',
        description: 'Scenic descent into Thekkady. Tour organic spice plantations of cardamom, pepper, and cinnamon. Evening Kathakali and Kalaripayattu shows.',
        meals: 'Breakfast & Dinner',
        hotel: 'Elephant Court / Poet’s Cove, Thekkady',
        activities: ['Spice Plantation Tour', 'Kathakali Dance Show', 'Kalaripayattu Arena']
      },
      {
        day: 4,
        title: 'Thekkady to Alleppey Houseboat Embarkation',
        description: 'Drive to Alleppey. Board your private luxury houseboat at 12 noon. Drift along quiet lagoons, paddy fields, and local village backwaters.',
        meals: 'Lunch, Evening Snacks & Dinner',
        hotel: 'Private Deluxe AC Houseboat, Alleppey',
        activities: ['Backwater Navigation', 'Fresh Karimeen Pollichathu Catch', 'Sunset on Canal']
      },
      {
        day: 5,
        title: 'Alleppey to Fort Kochi Heritage',
        description: 'Disembark after breakfast. Drive to Fort Kochi. Stroll by historic Chinese Fishing Nets, St. Francis Church, and vibrant Jew Town cafes.',
        meals: 'Breakfast & Dinner',
        hotel: 'Brunton Boatyard / Casino Hotel, Kochi',
        activities: ['Chinese Fishing Nets', 'Jew Town Antiques', 'Mattancherry Palace']
      },
      {
        day: 6,
        title: 'Departure from Kochi',
        description: 'Final breakfast overlooking the harbor. Drop-off at Cochin International Airport.',
        meals: 'Breakfast',
        activities: ['Airport Transfer']
      }
    ],
    groupSize: 'Ideal for couples & families',
    bestTimeToVisit: 'September to May'
  },
  {
    id: 'td-05',
    slug: 'goa-sun-sand-luxury-yacht-heritage',
    title: 'Goa: Sun, Sand, Luxury Catamaran & Portuguese Quarters',
    tagline: 'Golden shores, private sunset cruises, Latin quarters, and beachside dining.',
    state: 'Goa',
    location: 'North & South Goa',
    duration: { days: 4, nights: 3 },
    price: 15499,
    originalPrice: 19999,
    featured: false,
    status: 'active',
    rating: 4.75,
    reviewsCount: 164,
    bannerImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/qre6d0k8sYI',
    overview: 'Discover Goa beyond the parties. Relish luxury beachfront resort hospitality, explore colorful Portuguese mansions in Fontainhas, sail the Mandovi river on a catamaran, and relax under coconut canopies in Palolem.',
    theme: 'Beach',
    highlights: [
      'Luxury 4-star Beachfront resort stay',
      'Fontainhas Latin Quarter guided heritage walking tour',
      '2-Hour Sunset Catamaran Cruise with music and drinks',
      'Scuba diving / water sports combo at Grand Island',
      'Seafood tasting at iconic beach shacks'
    ],
    inclusions: [
      '3 Nights Deluxe resort stay near the beach',
      'Daily buffet breakfast',
      'Airport / Railway station transfers',
      'Private sunset cruise voucher',
      'North Goa & Heritage South Goa private tour'
    ],
    exclusions: ['Airfare', 'Water sports insurance', 'Lunches & drinks'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Goa & Beach Sunset',
        description: 'Welcome to Goa. Check in to your coastal resort. Unwind on the sands of Candolim / Calangute with chilled coconut water.',
        meals: 'Welcome Drink',
        hotel: 'Taj Holiday Village / Resort Rio, Goa',
        activities: ['Resort Relaxation', 'Beach Sunset', 'Shack Dinner']
      },
      {
        day: 2,
        title: 'Fontainhas Heritage Walk & Mandovi River Cruise',
        description: 'Explore the vivid pastel Portuguese streets of Fontainhas in Panjim. Visit Church of Our Lady of Immaculate Conception. Sunset cruise on Mandovi.',
        meals: 'Breakfast',
        hotel: 'Taj Holiday Village / Resort Rio, Goa',
        activities: ['Fontainhas Architecture Tour', 'Panjim Church', 'Sunset Catamaran Cruise']
      },
      {
        day: 3,
        title: 'North Goa Forts & Coastal Water Thrills',
        description: 'Visit Aguada Fort and Chapora Fort ("Dil Chahta Hai" fame). Relax at Vagator and Anjuna beaches. Optional scuba diving & parasailing.',
        meals: 'Breakfast',
        hotel: 'Taj Holiday Village / Resort Rio, Goa',
        activities: ['Aguada Fort', 'Chapora Fort', 'Anjuna Flea Market']
      },
      {
        day: 4,
        title: 'Leisurely Breakfast & Departure',
        description: 'Enjoy a beach morning swim, souvenir shopping for cashews and feni, followed by an airport drop.',
        meals: 'Breakfast',
        activities: ['Souvenir Shopping', 'Airport Transfer']
      }
    ],
    groupSize: 'Friends, Couples & Families',
    bestTimeToVisit: 'October to April'
  },
  {
    id: 'td-06',
    slug: 'uttarakhand-rishikesh-mussoorie-char-dham-vibes',
    title: 'Uttarakhand: Rishikesh Rafting, Ganga Aarti & Mussoorie Hills',
    tagline: 'Sacred riverbanks, yoga serenity, misty Queen of Hills, and Himalayan rapids.',
    state: 'Uttarakhand',
    location: 'Dehradun, Rishikesh & Mussoorie',
    duration: { days: 5, nights: 4 },
    price: 18499,
    originalPrice: 23500,
    featured: false,
    status: 'active',
    rating: 4.88,
    reviewsCount: 175,
    bannerImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626014303757-646633b478cf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/3Q9fD4l9aG0',
    overview: 'Experience the duality of adrenaline and spiritual stillness. Raft down the holy rapids of the Ganges in Rishikesh, witness the divine evening Ganga Aarti at Triveni Ghat, and escape into the misty colonial charm of Mussoorie.',
    theme: 'Adventure',
    highlights: [
      '16 km White-water rafting on the Ganga (Grade III & IV)',
      'VIP front-row seating at Triveni Ghat Ganga Aarti',
      'The Beatles Ashram (Chaurasi Kutia) guided walk',
      'Cable car ride to Gun Hill Mussoorie',
      'Kempty Falls and scenic Landour bakery trail'
    ],
    inclusions: [
      '2 Nights Riverside Resort Rishikesh + 2 Nights Hillview Hotel Mussoorie',
      'Daily breakfast & dinner',
      'Complete river rafting equipment, lifejackets & certified river guide',
      'All inter-city transfers in private AC vehicle'
    ],
    exclusions: ['Bungee jumping or Giant swing tickets', 'Lunch', 'Personal tips'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival Dehradun / Rishikesh & Evening Ganga Aarti',
        description: 'Arrive in Dehradun and transfer to Rishikesh. Visit Ram Jhula and Lakshman Jhula. Attend the transcendental Ganga Aarti at Triveni Ghat.',
        meals: 'Dinner',
        hotel: 'Aloha on the Ganges / Divine Resort, Rishikesh',
        activities: ['Ram Jhula Walk', 'Triveni Ghat Aarti', 'Riverside Meditation']
      },
      {
        day: 2,
        title: 'White Water Rafting & Beatles Ashram',
        description: 'Tackle the roaring rapids from Shivpuri down to Rishikesh. Afternoon exploration of the historic Beatles Ashram covered in graffiti and murals.',
        meals: 'Breakfast & Dinner',
        hotel: 'Aloha on the Ganges, Rishikesh',
        activities: ['Shivpuri Ganga Rafting', 'Cliff Jump', 'Beatles Ashram Tour']
      },
      {
        day: 3,
        title: 'Rishikesh to Queen of Hills, Mussoorie',
        description: 'Ascend the winding hills past Dehradun to Mussoorie. Check-in and stroll down the famous colonial Mall Road and Library Chowk.',
        meals: 'Breakfast & Dinner',
        hotel: 'Jaypee Residency Manor / Fortune Grace, Mussoorie',
        activities: ['Scenic Hill Drive', 'Mussoorie Mall Road', 'Gun Hill Cable Car']
      },
      {
        day: 4,
        title: 'Kempty Falls, Company Garden & Landour Stroll',
        description: 'Marvel at cascading Kempty Falls. Escape the crowd into old-world Landour for panoramic Himalayan peaks and fresh bakeries.',
        meals: 'Breakfast & Dinner',
        hotel: 'Jaypee Residency Manor, Mussoorie',
        activities: ['Kempty Falls', 'Landour Heritage Trail', 'Char Dukan Tasting']
      },
      {
        day: 5,
        title: 'Departure via Dehradun',
        description: 'Enjoy a leisurely breakfast over the Doon valley panorama. Transfer to Dehradun Airport or Railway Station.',
        meals: 'Breakfast',
        activities: ['Dehradun Drop-off']
      }
    ],
    groupSize: '2 to 10 persons',
    bestTimeToVisit: 'September to June'
  },
  {
    id: 'td-07',
    slug: 'andaman-emerald-islands-havelock-scuba-paradise',
    title: 'Andaman: Radhanagar Beach, Havelock & Scuba Atoll',
    tagline: 'Turquoise oceans, bioluminescent waves, coral reefs, and pristine white sands.',
    state: 'Andaman & Nicobar',
    location: 'Port Blair, Havelock Island & Neil Island',
    duration: { days: 6, nights: 5 },
    price: 34999,
    originalPrice: 44000,
    featured: true,
    status: 'featured',
    rating: 4.96,
    reviewsCount: 156,
    bannerImage: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/G_B1p_m85oY',
    overview: 'Enter a tropical paradise in the Bay of Bengal. Radhanagar Beach (Asia’s top-ranked beach), crystal clear waters of Elephant Beach, historic Cellular Jail in Port Blair, and vibrant live coral reefs under the Indian ocean.',
    theme: 'Beach',
    highlights: [
      'Luxury Catamaran (Makruzz / Nautika) inter-island cruises',
      'Radhanagar Beach sunset rated among world\'s finest',
      'Elephant Beach guided Snorkeling and Water sports',
      'Cellular Jail historic Light & Sound show',
      'Neil Island Natural Rock Bridge and Laxmanpur Beach'
    ],
    inclusions: [
      '5 Nights in Beachfront 4-Star Resorts & Wooden Cottages',
      'Daily Buffet Breakfast and Dinner',
      'All Luxury AC Catamaran transfers between Port Blair, Havelock & Neil',
      'Entry tickets, permits, and private cab transfers on all islands'
    ],
    exclusions: ['Airfare to Port Blair', 'Scuba diving certification fee', 'Personal expenses'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival Port Blair & Cellular Jail Light & Sound',
        description: 'Arrive at Veer Savarkar International Airport. Transfer to hotel. Afternoon visit to national memorial Cellular Jail followed by the moving Light & Sound presentation.',
        meals: 'Dinner',
        hotel: 'Symphony Samudra / Peerless Sarovar Portico, Port Blair',
        activities: ['Cellular Jail Museum', 'Light & Sound Show', 'Corbyn’s Cove Beach']
      },
      {
        day: 2,
        title: 'Cruise to Havelock Island & Radhanagar Beach',
        description: 'Board luxury high-speed catamaran to Havelock Island (Swaraj Dweep). Afternoon sunset at the breathtaking Radhanagar Beach (Beach No. 7).',
        meals: 'Breakfast & Dinner',
        hotel: 'Havelock Island Beach Resort / Barefoot at Havelock',
        activities: ['Makruzz Catamaran Ride', 'Radhanagar Sunset', 'Beachside Candlelight Dinner']
      },
      {
        day: 3,
        title: 'Elephant Beach Marine Life & Snorkeling',
        description: 'Speedboat ride to Elephant Beach. Explore underwater coral reefs, vibrant clownfish, and sea turtles with certified dive masters.',
        meals: 'Breakfast & Dinner',
        hotel: 'Havelock Island Beach Resort',
        activities: ['Elephant Beach Speedboat', 'Snorkeling', 'Sea Walk / Scuba']
      },
      {
        day: 4,
        title: 'Havelock to Neil Island (Shaheed Dweep)',
        description: 'Ferry to tranquil Neil Island. Marvel at the dramatic Natural Living Rock Formations and golden sunset at Laxmanpur Beach.',
        meals: 'Breakfast & Dinner',
        hotel: 'Sea Shell Neil / Summer Sands, Neil Island',
        activities: ['Natural Coral Bridge', 'Bharatpur Beach', 'Laxmanpur Sunset']
      },
      {
        day: 5,
        title: 'Neil Island to Port Blair Return & Sagarika Shopping',
        description: 'Morning cruise back to Port Blair. Afternoon visit to Sagarika Emporium for genuine shell handicrafts and pearl jewelry.',
        meals: 'Breakfast & Dinner',
        hotel: 'Symphony Samudra, Port Blair',
        activities: ['Ferry Transfer', 'Sagarika Handicrafts', 'Chidiya Tapu Sunset']
      },
      {
        day: 6,
        title: 'Farewell Andaman - Airport Transfer',
        description: 'Check-out with unforgettable memories of the Andaman seas. Transfer to Port Blair Airport.',
        meals: 'Breakfast',
        activities: ['Airport Drop-off']
      }
    ],
    groupSize: 'Couples, Families & Private Groups',
    bestTimeToVisit: 'October to May'
  },
  {
    id: 'td-08',
    slug: 'north-east-meghalaya-living-roots-cherrapunji',
    title: 'Meghalaya: Living Root Bridges, Cherrapunji & Dawki Crystal River',
    tagline: 'Mist, towering waterfalls, double-decker living root bridges, and glass-clear waters.',
    state: 'Meghalaya',
    location: 'Shillong, Cherrapunji, Mawlynnong & Dawki',
    duration: { days: 6, nights: 5 },
    price: 23999,
    originalPrice: 31000,
    featured: true,
    status: 'featured',
    rating: 4.92,
    reviewsCount: 133,
    bannerImage: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/fD3zG2JjV9Q',
    overview: 'Enter the Abode of Clouds. Walk on the bio-engineered Nongriat Double Decker Living Root Bridge, marvel at Nohkalikai Falls (India’s tallest plunge waterfall), boat on the crystal transparent Umngot river in Dawki, and explore Mawlynnong (Asia’s cleanest village).',
    theme: 'Nature',
    highlights: [
      'Boating on glass-like transparent Umngot River in Dawki',
      'Trek to ancient Nongriat Double Decker Living Root Bridge',
      'Witness the majestic plunge of Nohkalikai Falls',
      'Explore Mawsmai Cave & Arwah limestone formations',
      'Stroll through Asia’s Cleanest Village: Mawlynnong'
    ],
    inclusions: [
      '5 Nights Deluxe Hotels and Eco-Resorts',
      'Daily breakfast and traditional Khasi dinners',
      'Dedicated AC SUV/Innova for all mountain transfers and tours',
      'Boating pass on Umngot River Dawki',
      'Guided trek support for Living Root Bridge'
    ],
    exclusions: ['Airfare to Guwahati', 'Zip lining fees', 'Personal expenses'],
    itinerary: [
      {
        day: 1,
        title: 'Guwahati to Shillong (Scotland of the East)',
        description: 'Pickup from Guwahati. Stop by the serene turquoise waters of Umiam Lake (Barapani). Check in to Shillong resort and explore Police Bazar.',
        meals: 'Dinner',
        hotel: 'Ri Kynjai / Courtyard by Marriott, Shillong',
        activities: ['Umiam Lake Viewpoint', 'Police Bazar Cafe Crawl']
      },
      {
        day: 2,
        title: 'Shillong to Cherrapunji (Sohra)',
        description: 'Drive along deep cloud-laden gorges. Marvel at Elephant Falls, Wakaba Falls, and the iconic Nohkalikai Falls. Explore ancient Mawsmai cave.',
        meals: 'Breakfast & Dinner',
        hotel: 'Polo Orchid Resort / Jiva Resort, Cherrapunji',
        activities: ['Elephant Falls', 'Nohkalikai Falls', 'Mawsmai Cave Spelunking']
      },
      {
        day: 3,
        title: 'Nongriat Double Decker Living Root Bridge Trek',
        description: 'Descend 3,000 stone steps through lush rainforests to the extraordinary bio-architectural wonder: Double Decker Living Root Bridge and Rainbow Falls.',
        meals: 'Breakfast & Dinner',
        hotel: 'Polo Orchid Resort, Cherrapunji',
        activities: ['Double Decker Bridge', 'Rainbow Falls', 'Natural Swimming Pools']
      },
      {
        day: 4,
        title: 'Cherrapunji to Mawlynnong & Dawki (Umngot River)',
        description: 'Visit Mawlynnong, recognized as Asia\'s cleanest village. Head to Dawki border for boat rides on the Umngot river where boats appear to float on air.',
        meals: 'Breakfast & Dinner',
        hotel: 'Betelnut Resort / Shnongpdeng Riverside Camp',
        activities: ['Mawlynnong Stroll', 'Dawki Umngot Boating', 'India-Bangladesh Border View']
      },
      {
        day: 5,
        title: 'Krang Shuri Waterfalls & Return to Shillong',
        description: 'Swim in the aquamarine lagoon of Krang Shuri Falls in Jaintia hills. Return to Shillong for evening musical cafe culture.',
        meals: 'Breakfast & Dinner',
        hotel: 'Ri Kynjai / Courtyard by Marriott, Shillong',
        activities: ['Krang Shuri Falls', 'Laitlum Canyons', 'Cafe Shillong Music']
      },
      {
        day: 6,
        title: 'Shillong to Guwahati Airport Departure',
        description: 'Morning breakfast with mountain views. Scenic descent to Guwahati Airport with unforgettable North East memories.',
        meals: 'Breakfast',
        activities: ['Guwahati Airport Drop']
      }
    ],
    groupSize: 'Nature lovers, Hikers & Photographers',
    bestTimeToVisit: 'October to May'
  }
];

export const STATES_LIST = [
  'All States',
  // 28 Indian States (Alphabetical)
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  // 8 Union Territories
  'Andaman & Nicobar Islands',
  'Chandigarh',
  'Dadra & Nagar Haveli and Daman & Diu',
  'Delhi (NCR)',
  'Jammu & Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

export const THEMES_LIST = [
  'All Themes',
  'Honeymoon',
  'Adventure',
  'Heritage',
  'Nature',
  'Beach',
  'Pilgrimage',
  'Luxury',
  'Family Special',
  'Wildlife & Safari',
  'Hill Station',
  'Weekend Getaway',
  'Road Trip',
  'Cultural & Festival'
];

