const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ─── In-memory data ────────────────────────────────────────────────────────

const venues = [
  {
    id: '1',
    name: 'Darbar Hall',
    slug: 'darbar-hall',
    capacity: 800,
    area: '12,000 sq ft',
    description:
      'The grandest hall of Raj Mahal — adorned with hand-carved marble pillars, Rajputana frescoes, and a 40-foot gold-leaf ceiling. Perfect for grand royal weddings and state banquets.',
    features: ['Marble flooring', 'Gold-leaf ceiling', '5-ton chandelier', 'In-built stage', 'Green room', 'Pre-function lawn'],
    amenities: ['State-of-the-art AV', 'Climate control', 'In-house catering', 'Valet parking'],
    pricePerDay: 250000,
    images: ['darbar-1', 'darbar-2'],
    category: 'Grand',
  },
  {
    id: '2',
    name: 'Jasmine Pavilion',
    slug: 'jasmine-pavilion',
    capacity: 350,
    area: '6,500 sq ft',
    description:
      'An elegant indoor-outdoor pavilion surrounded by manicured jasmine gardens. The lush floral backdrop makes it the most sought-after venue for intimate weddings and reception ceremonies.',
    features: ['Garden-view glass walls', 'Outdoor terrace', 'Bridal suite', 'Floral décor included'],
    amenities: ['Wi-Fi', 'Climate control', 'Dedicated event coordinator', 'Valet parking'],
    pricePerDay: 150000,
    images: ['jasmine-1', 'jasmine-2'],
    category: 'Garden',
  },
  {
    id: '3',
    name: 'Rooftop Terrace',
    slug: 'rooftop-terrace',
    capacity: 200,
    area: '4,000 sq ft',
    description:
      'An open-air terrace with panoramic views of the city skyline and Rajasthani landscape. An unforgettable setting for cocktail evenings, mehendi ceremonies, and intimate soirees.',
    features: ['360° skyline view', 'Retractable shade canopy', 'Outdoor bar counter', 'Custom lighting rig'],
    amenities: ['Portable AV', 'Beverage packages', 'Security staff', 'Shuttle service'],
    pricePerDay: 90000,
    images: ['rooftop-1', 'rooftop-2'],
    category: 'Open Air',
  },
  {
    id: '4',
    name: 'Maharani Suite',
    slug: 'maharani-suite',
    capacity: 80,
    area: '2,200 sq ft',
    description:
      'An exclusive, intimate boardroom-style venue styled in deep teal and antique gold, ideal for high-level corporate meetings, private dinners, and product unveilings.',
    features: ['Boardroom layout', 'Private lounge', 'Dedicated butler', 'Projector & screen'],
    amenities: ['Video conferencing', 'Curated menu', 'Stationery set', 'Premium Wi-Fi'],
    pricePerDay: 55000,
    images: ['maharani-1', 'maharani-2'],
    category: 'Corporate',
  },
];

const packages = [
  {
    id: '1',
    name: 'Gold',
    subtitle: 'The Classic Celebration',
    price: 250000,
    priceUnit: 'per event',
    features: [
      'Venue rental (up to 8 hours)',
      'Basic floral décor',
      'Standard AV setup',
      'Parking for 50 cars',
      '1 Dedicated coordinator',
      'Standard catering menu',
      'Basic lighting setup',
    ],
    notIncluded: ['Custom décor', 'Photography', 'Luxury suite access'],
    accent: '#B8972A',
    popular: false,
  },
  {
    id: '2',
    name: 'Platinum',
    subtitle: 'The Grand Affair',
    price: 500000,
    priceUnit: 'per event',
    features: [
      'Venue rental (up to 12 hours)',
      'Custom floral décor & mandap',
      'Premium AV + LED backdrop',
      'Parking for 120 cars',
      '2 Dedicated coordinators',
      'Multi-cuisine live counters',
      'Ambient + stage lighting',
      'Bridal suite access',
      'Welcome drink setup',
    ],
    notIncluded: ['Photography package'],
    accent: '#6B1F2A',
    popular: true,
  },
  {
    id: '3',
    name: 'Royal',
    subtitle: 'The Raj Mahal Experience',
    price: 950000,
    priceUnit: 'per event',
    features: [
      'Full palace access (24 hours)',
      'Master floral design by our creative director',
      'Full AV production with operator',
      'Unlimited valet parking',
      'Dedicated event management team',
      'Royal thali + international buffet',
      'Cinematic lighting design',
      'Presidential suite for 2 nights',
      'Professional photography (8 hrs)',
      'Fireworks clearance & setup',
      'Custom monogram & stationery',
    ],
    notIncluded: [],
    accent: '#8B5E1A',
    popular: false,
  },
];

const testimonials = [
  {
    id: '1',
    name: 'Priya & Rohan Mehta',
    event: 'Wedding — Darbar Hall',
    rating: 5,
    text: 'Raj Mahal turned our wedding into a fairy tale. Every pillar, every flower, every moment was curated to perfection. Our guests still talk about it six months later.',
    location: 'Mumbai',
  },
  {
    id: '2',
    name: 'Arvind Kapoor',
    event: 'Corporate Gala — Maharani Suite',
    rating: 5,
    text: 'We have hosted our annual awards dinner at Raj Mahal for three consecutive years. The professionalism, the food, and the ambience are consistently world-class.',
    location: 'Delhi',
  },
  {
    id: '3',
    name: 'Sunita & Deepak Sharma',
    event: 'Anniversary — Jasmine Pavilion',
    rating: 5,
    text: 'The jasmine garden and that soft golden lighting — it felt like we stepped into a Mughal miniature painting. An evening we will treasure forever.',
    location: 'Jaipur',
  },
  {
    id: '4',
    name: 'Neha Agarwal',
    event: 'Birthday Soirée — Rooftop Terrace',
    rating: 5,
    text: 'The rooftop under the stars with the city glowing below — absolutely magical. Every detail from the bar setup to the live music was handled flawlessly.',
    location: 'Udaipur',
  },
];

let inquiries = [
  {
    id: uuidv4(),
    name: 'Vikram & Anjali Singh',
    email: 'vikram.singh@example.com',
    phone: '9876543210',
    eventType: 'Wedding',
    venue: 'Darbar Hall',
    date: '2026-12-14',
    guestCount: 600,
    message: 'Looking for a December wedding package with full décor.',
    status: 'New',
    createdAt: new Date('2026-06-01').toISOString(),
  },
  {
    id: uuidv4(),
    name: 'TechVision India Pvt Ltd',
    email: 'events@techvision.co.in',
    phone: '9123456780',
    eventType: 'Corporate',
    venue: 'Maharani Suite',
    date: '2026-07-20',
    guestCount: 60,
    message: 'Annual leadership offsite + team dinner.',
    status: 'Confirmed',
    createdAt: new Date('2026-06-05').toISOString(),
  },
];

// ─── Routes ─────────────────────────────────────────────────────────────────

app.get('/api/venues', (req, res) => res.json(venues));
app.get('/api/venues/:slug', (req, res) => {
  const venue = venues.find((v) => v.slug === req.params.slug);
  if (!venue) return res.status(404).json({ error: 'Venue not found' });
  res.json(venue);
});

app.get('/api/packages', (req, res) => res.json(packages));
app.get('/api/testimonials', (req, res) => res.json(testimonials));

// Submit inquiry
app.post('/api/inquiries', (req, res) => {
  const { name, email, phone, eventType, venue, date, guestCount, message } = req.body;
  if (!name || !email || !eventType || !date) {
    return res.status(400).json({ error: 'Required fields missing' });
  }
  const inquiry = {
    id: uuidv4(),
    name,
    email,
    phone: phone || '',
    eventType,
    venue: venue || '',
    date,
    guestCount: guestCount || 0,
    message: message || '',
    status: 'New',
    createdAt: new Date().toISOString(),
  };
  inquiries.unshift(inquiry);
  res.status(201).json({ success: true, inquiry });
});

// Admin: get all inquiries
app.get('/api/inquiries', (req, res) => res.json(inquiries));

// Admin: update inquiry status
app.patch('/api/inquiries/:id', (req, res) => {
  const inquiry = inquiries.find((i) => i.id === req.params.id);
  if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });
  if (req.body.status) inquiry.status = req.body.status;
  if (req.body.notes !== undefined) inquiry.notes = req.body.notes;
  res.json({ success: true, inquiry });
});

// Admin: delete inquiry
app.delete('/api/inquiries/:id', (req, res) => {
  const index = inquiries.findIndex((i) => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Inquiry not found' });
  inquiries.splice(index, 1);
  res.json({ success: true });
});

app.get('/', (req, res) => res.json({ message: 'Raj Mahal API running ✓' }));

app.listen(PORT, () => {
  console.log(`\n🏰 Raj Mahal API running at http://localhost:${PORT}\n`);
});
