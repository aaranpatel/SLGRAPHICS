import './style.css';

// --- Global State ---
let currentStep = 1;
let selectedProduct = 'business-cards';
let uploadedFile = null;

// Product Specifications & Pricing database for all 16 actual products matching Instagram highlights
const productDatabase = {
  'business-cards': {
    name: 'Premium Business Cards',
    basePrice: 39.00,
    options: [
      { id: 'qty', label: 'Quantity', type: 'select', choices: [{ val: 100, text: '100 cards' }, { val: 250, text: '250 cards' }, { val: 500, text: '500 cards' }, { val: 1000, text: '1000 cards' }] },
      { id: 'sides', label: 'Printing Sides', type: 'select', choices: [{ val: 0, text: 'Single-Sided' }, { val: 15, text: 'Double-Sided (+ $15)' }] },
      { id: 'coating', label: 'Finish Coating', type: 'select', choices: [{ val: 0, text: 'Matte Finish' }, { val: 10, text: 'High Gloss UV (+ $10)' }] }
    ],
    calcPrice: (specs) => {
      const qty = parseInt(specs.qty) || 100;
      const sidesAddon = parseFloat(specs.sides) || 0;
      const coatingAddon = parseFloat(specs.coating) || 0;
      let base = 39.00;
      if (qty === 250) base = 59.00;
      else if (qty === 500) base = 89.00;
      else if (qty === 1000) base = 129.00;
      return base + sidesAddon + coatingAddon;
    }
  },
  'standard-cards': {
    name: 'Standard Business Cards',
    basePrice: 39.00,
    options: [
      { id: 'qty', label: 'Quantity', type: 'select', choices: [{ val: 100, text: '100 cards' }, { val: 250, text: '250 cards' }, { val: 500, text: '500 cards' }, { val: 1000, text: '1000 cards' }] },
      { id: 'paper', label: 'Paper Choice', type: 'select', choices: [{ val: 0, text: '14pt Uncoated' }, { val: 10, text: '14pt Semi-gloss (+ $10)' }] }
    ],
    calcPrice: (specs) => {
      const qty = parseInt(specs.qty) || 100;
      const paperAddon = parseFloat(specs.paper) || 0;
      let base = 39.00;
      if (qty === 250) base = 49.00;
      else if (qty === 500) base = 75.00;
      else if (qty === 1000) base = 109.00;
      return base + paperAddon;
    }
  },
  'digital-cards': {
    name: 'Same-Day Digital Cards',
    basePrice: 45.00,
    options: [
      { id: 'qty', label: 'Quantity', type: 'select', choices: [{ val: 50, text: '50 cards (Rush)' }, { val: 100, text: '100 cards (Rush) (+ $20)' }, { val: 250, text: '250 cards (Rush) (+ $50)' }] }
    ],
    calcPrice: (specs) => {
      const qtyAddon = parseFloat(specs.qty) || 0;
      return 45.00 + qtyAddon;
    }
  },
  'silk-cards': {
    name: 'Premium Silk Cards',
    basePrice: 65.00,
    options: [
      { id: 'qty', label: 'Quantity', type: 'select', choices: [{ val: 100, text: '100 cards' }, { val: 250, text: '250 cards' }, { val: 500, text: '500 cards' }] },
      { id: 'thickness', label: 'Card Thickness', type: 'select', choices: [{ val: 0, text: '16pt Premium Silk' }, { val: 20, text: '19pt Silk Heavyweight (+ $20)' }] }
    ],
    calcPrice: (specs) => {
      const qty = parseInt(specs.qty) || 100;
      const thickAddon = parseFloat(specs.thickness) || 0;
      let base = 65.00;
      if (qty === 250) base = 95.00;
      else if (qty === 500) base = 145.00;
      return base + thickAddon;
    }
  },
  'suede-cards': {
    name: 'Suede Matte Cards',
    basePrice: 75.00,
    options: [
      { id: 'qty', label: 'Quantity', type: 'select', choices: [{ val: 100, text: '100 cards' }, { val: 250, text: '250 cards' }, { val: 500, text: '500 cards' }] }
    ],
    calcPrice: (specs) => {
      const qty = parseInt(specs.qty) || 100;
      let base = 75.00;
      if (qty === 250) base = 115.00;
      else if (qty === 500) base = 175.00;
      return base;
    }
  },
  'raised-cards': {
    name: 'Raised Spot UV Cards',
    basePrice: 85.00,
    options: [
      { id: 'qty', label: 'Quantity', type: 'select', choices: [{ val: 100, text: '100 cards' }, { val: 250, text: '250 cards' }, { val: 500, text: '500 cards' }] },
      { id: 'finish', label: 'Spot UV Area', type: 'select', choices: [{ val: 0, text: 'Single-Sided Spot UV' }, { val: 30, text: 'Double-Sided Spot UV (+ $30)' }] }
    ],
    calcPrice: (specs) => {
      const qty = parseInt(specs.qty) || 100;
      const finishAddon = parseFloat(specs.finish) || 0;
      let base = 85.00;
      if (qty === 250) base = 135.00;
      else if (qty === 500) base = 195.00;
      return base + finishAddon;
    }
  },
  'gold-foil-cards': {
    name: 'Gold Foil Cards',
    basePrice: 95.00,
    options: [
      { id: 'qty', label: 'Quantity', type: 'select', choices: [{ val: 100, text: '100 cards' }, { val: 250, text: '250 cards' }, { val: 500, text: '500 cards' }] },
      { id: 'foil', label: 'Foil Options', type: 'select', choices: [{ val: 0, text: 'Single-Sided Gold Foil' }, { val: 20, text: 'Double-Sided Gold Foil (+ $20)' }, { val: 10, text: 'Silver Foil Accent (+ $10)' }] }
    ],
    calcPrice: (specs) => {
      const qty = parseInt(specs.qty) || 100;
      const foilAddon = parseFloat(specs.foil) || 0;
      let base = 95.00;
      if (qty === 250) base = 155.00;
      else if (qty === 500) base = 225.00;
      return base + foilAddon;
    }
  },
  'edge-cards': {
    name: 'Edge Painted Cards',
    basePrice: 110.00,
    options: [
      { id: 'qty', label: 'Quantity', type: 'select', choices: [{ val: 100, text: '100 cards' }, { val: 250, text: '250 cards' }, { val: 500, text: '500 cards' }] },
      { id: 'edge', label: 'Edge Finish', type: 'select', choices: [{ val: 0, text: 'Matte CMYK Spray Edge' }, { val: 25, text: 'Metallic Gold/Silver Edge (+ $25)' }] }
    ],
    calcPrice: (specs) => {
      const qty = parseInt(specs.qty) || 100;
      const edgeAddon = parseFloat(specs.edge) || 0;
      let base = 110.00;
      if (qty === 250) base = 175.00;
      else if (qty === 500) base = 250.00;
      return base + edgeAddon;
    }
  },
  'color-copies': {
    name: 'High-Def Color Copies',
    basePrice: 0.39,
    options: [
      { id: 'volume', label: 'Total Pages', type: 'number', default: 50, min: 1 },
      { id: 'paper', label: 'Paper Upgrade', type: 'select', choices: [{ val: 0, text: '24lb Bright White' }, { val: 0.15, text: '28lb Presentation Silk (+ $0.15/page)' }, { val: 0.30, text: '80lb Gloss Text (+ $0.30/page)' }] }
    ],
    calcPrice: (specs) => {
      const volume = parseInt(specs.volume) || 50;
      const paperAddon = parseFloat(specs.paper) || 0;
      return volume * (0.39 + paperAddon);
    }
  },
  'bw-copies': {
    name: 'Black & White Copies',
    basePrice: 0.09,
    options: [
      { id: 'volume', label: 'Total Pages', type: 'number', default: 100, min: 1 },
      { id: 'paper', label: 'Paper Type', type: 'select', choices: [{ val: 0, text: '20lb Bond Standard' }, { val: 0.10, text: '28lb Presentation Silk (+ $0.10/page)' }] }
    ],
    calcPrice: (specs) => {
      const volume = parseInt(specs.volume) || 100;
      const paperAddon = parseFloat(specs.paper) || 0;
      return volume * (0.09 + paperAddon);
    }
  },
  'email-printing': {
    name: 'Email Printing Service',
    basePrice: 5.00,
    options: [
      { id: 'pages', label: 'Page Range Group', type: 'select', choices: [{ val: 0, text: '1-5 printed pages' }, { val: 10, text: '6-20 printed pages (+ $10)' }, { val: 25, text: '21-50 printed pages (+ $25)' }] }
    ],
    calcPrice: (specs) => {
      const pagesAddon = parseFloat(specs.pages) || 0;
      return 5.00 + pagesAddon;
    }
  },
  'fax': {
    name: 'In-Store Fax Service',
    basePrice: 2.50,
    options: [
      { id: 'type', label: 'Destination Route', type: 'select', choices: [{ val: 0, text: 'Local Fax Transmission' }, { val: 3.50, text: 'Long Distance (Canada/US) (+ $3.50)' }] },
      { id: 'pages', label: 'Pages (including cover)', type: 'number', default: 3, min: 1 }
    ],
    calcPrice: (specs) => {
      const typeAddon = parseFloat(specs.type) || 0;
      const pages = parseInt(specs.pages) || 3;
      return 2.50 + typeAddon + (pages * 0.50);
    }
  },
  'scanning-service': {
    name: 'Document Scanning',
    basePrice: 5.00,
    options: [
      { id: 'qty', label: 'Pages Volume', type: 'select', choices: [{ val: 0, text: 'Up to 10 sheets scanning' }, { val: 15, text: '11-50 sheets scanning (+ $15)' }, { val: 35, text: '51-100 sheets scanning (+ $35)' }] }
    ],
    calcPrice: (specs) => {
      const qtyAddon = parseFloat(specs.qty) || 0;
      return 5.00 + qtyAddon;
    }
  },
  'wide-format': {
    name: 'Wide Format Prints',
    basePrice: 25.00,
    options: [
      { id: 'size', label: 'Print Dimension', type: 'select', choices: [{ val: 0, text: '24" x 36" Architectural Bond' }, { val: 15, text: '30" x 42" Layout (+ $15)' }, { val: 30, text: '36" x 48" Giant Print (+ $30)' }] },
      { id: 'paper', label: 'Material Quality', type: 'select', choices: [{ val: 0, text: '20lb Standard Blueprint Bond' }, { val: 20, text: 'Premium Photographic Satin (+ $20)' }] }
    ],
    calcPrice: (specs) => {
      const sizeAddon = parseFloat(specs.size) || 0;
      const paperAddon = parseFloat(specs.paper) || 0;
      return 25.00 + sizeAddon + paperAddon;
    }
  },
  'document-services': {
    name: 'Document Finishing Services',
    basePrice: 10.00,
    options: [
      { id: 'service', label: 'Finishing Task', type: 'select', choices: [{ val: 0, text: 'Stapling & Collation Pack' }, { val: 15, text: 'Custom Machine Letter Folding (+ $15)' }, { val: 25, text: 'Premium Letter Size Laminating (+ $25)' }] }
    ],
    calcPrice: (specs) => {
      const serviceAddon = parseFloat(specs.service) || 0;
      return 10.00 + serviceAddon;
    }
  },
  'banner-stands': {
    name: 'Retractable Banner Stands',
    basePrice: 119.00,
    options: [
      { id: 'size', label: 'Banner Dimensions', type: 'select', choices: [{ val: 0, text: '33" x 81" Standard rollup' }, { val: 40, text: '36" x 92" Large rollup (+ $40)' }] }
    ],
    calcPrice: (specs) => {
      const sizeAddon = parseFloat(specs.size) || 0;
      return 119.00 + sizeAddon;
    }
  },
  'seating-charts': {
    name: 'Event Seating Charts',
    basePrice: 65.00,
    options: [
      { id: 'size', label: 'Chart Dimension', type: 'select', choices: [{ val: 0, text: '18" x 24" Table Chart board' }, { val: 35, text: '24" x 36" Large Table Chart board (+ $35)' }] }
    ],
    calcPrice: (specs) => {
      const sizeAddon = parseFloat(specs.size) || 0;
      return 65.00 + sizeAddon;
    }
  },
  'canvas-prints': {
    name: 'Canvas Gallery Wraps',
    basePrice: 59.00,
    options: [
      { id: 'size', label: 'Canvas Dimension', type: 'select', choices: [{ val: 0, text: '16" x 20" wrap' }, { val: 25, text: '20" x 30" medium wrap (+ $25)' }, { val: 50, text: '24" x 36" large wrap (+ $50)' }] }
    ],
    calcPrice: (specs) => {
      const sizeAddon = parseFloat(specs.size) || 0;
      return 59.00 + sizeAddon;
    }
  },
  'standup-cutouts': {
    name: 'Life-Size Standup Cutouts',
    basePrice: 99.00,
    options: [
      { id: 'height', label: 'Cutout Height', type: 'select', choices: [{ val: 0, text: 'Up to 4ft tall cutout' }, { val: 30, text: '5ft tall cutout (+ $30)' }, { val: 50, text: '6ft tall cutout (Life-size) (+ $50)' }] }
    ],
    calcPrice: (specs) => {
      const heightAddon = parseFloat(specs.height) || 0;
      return 99.00 + heightAddon;
    }
  },
  'photobooth': {
    name: 'Photobooth Backdrops',
    basePrice: 149.00,
    options: [
      { id: 'size', label: 'Backdrop Dimension', type: 'select', choices: [{ val: 0, text: "8' x 8' Standard backdrop" }, { val: 50, text: "8' x 10' Wide backdrop (+ $50)" }] }
    ],
    calcPrice: (specs) => {
      const sizeAddon = parseFloat(specs.size) || 0;
      return 149.00 + sizeAddon;
    }
  },
  'rigid-signs': {
    name: 'Rigid Signs & A-Frames',
    basePrice: 45.00,
    options: [
      { id: 'type', label: 'Rigid Material', type: 'select', choices: [{ val: 0, text: '4mm Coroplast Yard Sign' }, { val: 95, text: 'Metal A-Frame stand & Inserts (+ $95)' }, { val: 40, text: '1/4" PVC Rigid Board (+ $40)' }] }
    ],
    calcPrice: (specs) => {
      const typeAddon = parseFloat(specs.type) || 0;
      return 45.00 + typeAddon;
    }
  },
  'bag-signs': {
    name: 'Bag Signs',
    basePrice: 89.00,
    options: [
      { id: 'qty', label: 'Pack Volume', type: 'select', choices: [{ val: 0, text: '10 promo bag signs' }, { val: 90, text: '25 promo bag signs (+ $90)' }, { val: 190, text: '50 promo bag signs (+ $190)' }] }
    ],
    calcPrice: (specs) => {
      const qtyAddon = parseFloat(specs.qty) || 0;
      return 89.00 + qtyAddon;
    }
  },
  'lawn-signs': {
    name: 'Lawn Signs (Coroplast)',
    basePrice: 45.00,
    options: [
      { id: 'qty', label: 'Pack Volume', type: 'select', choices: [{ val: 0, text: '1 lawn sign + wire stake' }, { val: 100, text: '5 lawn signs + wire stakes (+ $100)' }, { val: 180, text: '10 lawn signs + wire stakes (+ $180)' }] }
    ],
    calcPrice: (specs) => {
      const qtyAddon = parseFloat(specs.qty) || 0;
      return 45.00 + qtyAddon;
    }
  },
  'foamcore-signs': {
    name: 'Foamcore Board Signs',
    basePrice: 55.00,
    options: [
      { id: 'size', label: 'Foamcore Dimension', type: 'select', choices: [{ val: 0, text: '18" x 24" Display Board' }, { val: 25, text: '24" x 36" Display Board (+ $25)' }] }
    ],
    calcPrice: (specs) => {
      const sizeAddon = parseFloat(specs.size) || 0;
      return 55.00 + sizeAddon;
    }
  },
  'vinyl-lettering': {
    name: 'Vinyl Lettering',
    basePrice: 40.00,
    options: [
      { id: 'color', label: 'Vinyl color', type: 'select', choices: [{ val: 0, text: 'Gloss White Lettering' }, { val: 0, text: 'Gloss Black Lettering' }, { val: 10, text: 'Gloss Metallic Gold (+ $10)' }] }
    ],
    calcPrice: (specs) => {
      const colorAddon = parseFloat(specs.color) || 0;
      return 40.00 + colorAddon;
    }
  },
  'window-vinyl': {
    name: 'Window Vinyl Graphics',
    basePrice: 85.00,
    options: [
      { id: 'type', label: 'Vinyl Finish', type: 'select', choices: [{ val: 0, text: 'Solid adhesive vinyl graphic' }, { val: 30, text: 'Perforated one-way vision graphics (+ $30)' }] }
    ],
    calcPrice: (specs) => {
      const typeAddon = parseFloat(specs.type) || 0;
      return 85.00 + typeAddon;
    }
  },
  'vehicle-magnets': {
    name: 'Vehicle Door Magnets',
    basePrice: 65.00,
    options: [
      { id: 'size', label: 'Door Magnet Size', type: 'select', choices: [{ val: 0, text: '12" x 18" Magnet Pair' }, { val: 30, text: '18" x 24" Magnet Pair (+ $30)' }] }
    ],
    calcPrice: (specs) => {
      const sizeAddon = parseFloat(specs.size) || 0;
      return 65.00 + sizeAddon;
    }
  },
  'vehicle-graphics': {
    name: 'Vehicle Door Graphics',
    basePrice: 95.00,
    options: [
      { id: 'side', label: 'Sides Count', type: 'select', choices: [{ val: 0, text: 'Driver side door decal only' }, { val: 80, text: 'Both driver and passenger decals (+ $80)' }] }
    ],
    calcPrice: (specs) => {
      const sideAddon = parseFloat(specs.side) || 0;
      return 95.00 + sideAddon;
    }
  },
  'telescopic-backdrops': {
    name: 'Telescopic Backdrops',
    basePrice: 199.00,
    options: [
      { id: 'size', label: 'Fabric Banner Size', type: 'select', choices: [{ val: 0, text: "8' x 8' Fabric banner + adjustable frame" }, { val: 80, text: "8' x 10' Fabric banner + adjustable frame (+ $80)" }] }
    ],
    calcPrice: (specs) => {
      const sizeAddon = parseFloat(specs.size) || 0;
      return 199.00 + sizeAddon;
    }
  },
  'perfect-bound': {
    name: 'Perfect Bound Books',
    basePrice: 120.00,
    options: [
      { id: 'qty', label: 'Short Run Count', type: 'select', choices: [{ val: 0, text: '5 perfect-bound softcover books' }, { val: 80, text: '10 perfect-bound softcover books (+ $80)' }, { val: 280, text: '25 perfect-bound softcover books (+ $280)' }] }
    ],
    calcPrice: (specs) => {
      const qtyAddon = parseFloat(specs.qty) || 0;
      return 120.00 + qtyAddon;
    }
  },
  'coil-bound': {
    name: 'Coil Spiral Bound Books',
    basePrice: 45.00,
    options: [
      { id: 'qty', label: 'Booklets Count', type: 'select', choices: [{ val: 0, text: '5 spiral coil-bound booklets' }, { val: 35, text: '10 spiral coil-bound booklets (+ $35)' }, { val: 120, text: '25 spiral coil-bound booklets (+ $120)' }] }
    ],
    calcPrice: (specs) => {
      const qtyAddon = parseFloat(specs.qty) || 0;
      return 45.00 + qtyAddon;
    }
  },
  'saddle-stitched': {
    name: 'Saddle Stitched Booklets',
    basePrice: 35.00,
    options: [
      { id: 'qty', label: 'Booklets Count', type: 'select', choices: [{ val: 0, text: '10 saddle-stitched stapled booklets' }, { val: 40, text: '25 saddle-stitched stapled booklets (+ $40)' }, { val: 90, text: '50 saddle-stitched stapled booklets (+ $90)' }] }
    ],
    calcPrice: (specs) => {
      const qtyAddon = parseFloat(specs.qty) || 0;
      return 35.00 + qtyAddon;
    }
  },
  'wedding-invitations': {
    name: 'Wedding Invitations',
    basePrice: 75.00,
    options: [
      { id: 'qty', label: 'Total invitation Sets', type: 'select', choices: [{ val: 25, text: '25 invitation packs' }, { val: 50, text: '50 invitation packs' }, { val: 100, text: '100 invitation packs' }] },
      { id: 'style', label: 'Design Style', type: 'select', choices: [{ val: 0, text: 'Elegant Contemporary Style' }, { val: 20, text: 'Minimalist Floral & Botanical (+ $20)' }] }
    ],
    calcPrice: (specs) => {
      const qty = parseInt(specs.qty) || 25;
      const styleAddon = parseFloat(specs.style) || 0;
      let base = 75.00;
      if (qty === 50) base = 125.00;
      else if (qty === 100) base = 210.00;
      return base + styleAddon;
    }
  },
  'die-cut-stickers': {
    name: 'Vinyl Die Cut Stickers',
    basePrice: 49.00,
    options: [
      { id: 'qty', label: 'Decals Count', type: 'select', choices: [{ val: 0, text: '50 contour-cut vinyl decals' }, { val: 35, text: '100 contour-cut vinyl decals (+ $35)' }, { val: 95, text: '250 contour-cut vinyl decals (+ $95)' }] }
    ],
    calcPrice: (specs) => {
      const qtyAddon = parseFloat(specs.qty) || 0;
      return 49.00 + qtyAddon;
    }
  },
  'cut-stickers': {
    name: 'Cut Stickers Labels',
    basePrice: 39.00,
    options: [
      { id: 'qty', label: 'Labels Count', type: 'select', choices: [{ val: 0, text: '100 sheets geometric shape labels' }, { val: 40, text: '250 sheets geometric shape labels (+ $40)' }] }
    ],
    calcPrice: (specs) => {
      const qtyAddon = parseFloat(specs.qty) || 0;
      return 39.00 + qtyAddon;
    }
  },
  'roll-labels': {
    name: 'Roll Stickers Labels',
    basePrice: 149.00,
    options: [
      { id: 'qty', label: 'Roll Quantity', type: 'select', choices: [{ val: 0, text: '500 labels on roll' }, { val: 90, text: '1000 labels on roll (+ $90)' }] }
    ],
    calcPrice: (specs) => {
      const qtyAddon = parseFloat(specs.qty) || 0;
      return 149.00 + qtyAddon;
    }
  }
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initTestimonials();
  initFAQs();
  initDragAndDrop();
  initBookingTriggers();
  
});




// --- Sticky Navigation header shadow ---
function initHeaderScroll() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// --- Mobile Navigation Menu ---
function initMobileNav() {
  const burger = document.getElementById('burger-menu');
  const mobileNav = document.getElementById('mobile-nav');

  burger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    burger.classList.toggle('active');
  });
}

window.toggleMobileNav = function() {
  const mobileNav = document.getElementById('mobile-nav');
  const burger = document.getElementById('burger-menu');
  mobileNav.classList.remove('open');
  burger.classList.remove('active');
};

// --- Testimonials Slider ---
function initTestimonials() {
  const track = document.getElementById('testimonial-track');
  const slides = Array.from(track.children);
  const nextBtn = document.getElementById('next-slide');
  const prevBtn = document.getElementById('prev-slide');
  let currentSlide = 0;

  const updateSlider = () => {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
  };

  nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
  });

  prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlider();
  });

  let interval = setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
  }, 6000);

  const container = document.querySelector('.slider-container');
  container.addEventListener('mouseenter', () => clearInterval(interval));
  container.addEventListener('mouseleave', () => {
    interval = setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      updateSlider();
    }, 6000);
  });
}

// --- FAQs Accordion ---
function initFAQs() {
  const questions = document.querySelectorAll('.faq-question');
  questions.forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// --- Drag and Drop file Uploader ---
function initDragAndDrop() {
  const zone = document.getElementById('file-drop-zone');
  const fileInput = document.getElementById('print-file-input');
  const fileListDisplay = document.getElementById('uploaded-file-list');

  ['dragenter', 'dragover'].forEach(eventName => {
    zone.addEventListener(eventName, (e) => {
      e.preventDefault();
      zone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    zone.addEventListener(eventName, (e) => {
      e.preventDefault();
      zone.classList.remove('dragover');
    }, false);
  });

  zone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  }, false);

  fileInput.addEventListener('change', (e) => {
    handleFiles(fileInput.files);
  });

  function handleFiles(files) {
    if (files.length > 0) {
      uploadedFile = files[0];
      fileListDisplay.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:center; gap:8px; margin-top:10px; color:#0099ff;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
          Selected artwork: <strong>${uploadedFile.name}</strong> (${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB)
        </div>
      `;
    }
  }
}

// --- Booking Modal Drawer Controller ---
function initBookingTriggers() {
  const overlay = document.getElementById('booking-overlay');
  overlay.addEventListener('click', () => closeBookingDrawer());
}

window.openBookingDrawer = function(productId = 'business-cards') {
  document.getElementById('booking-overlay').classList.add('open');
  document.getElementById('booking-drawer').classList.add('open');
  
  const select = document.getElementById('booking-product-select');
  select.value = productId;
  selectedProduct = productId;
  
  handleProductChange();
};

window.closeBookingDrawer = function() {
  document.getElementById('booking-overlay').classList.remove('open');
  document.getElementById('booking-drawer').classList.remove('open');
};

function resetSteps() {
  // Stuffed
}

const relatedProductsMapping = {
  'business-cards': ['digital-cards', 'labels'],
  'digital-cards': ['business-cards', 'flyers'],
  'color-copies': ['bw-copies', 'books'],
  'bw-copies': ['color-copies', 'document-services'],
  'flyers': ['labels', 'business-cards'],
  'books': ['color-copies', 'flyers'],
  'labels': ['business-cards', 'flyers'],
  'banner-stands': ['rigid-signs', 'photobooth'],
  'seating-charts': ['wedding-invitations', 'canvas-prints'],
  'canvas-prints': ['seating-charts', 'standup-cutouts'],
  'standup-cutouts': ['canvas-prints', 'photobooth'],
  'photobooth': ['banner-stands', 'standup-cutouts'],
  'rigid-signs': ['banner-stands', 'labels'],
  'wedding-invitations': ['seating-charts', 'canvas-prints'],
  'wide-format': ['rigid-signs', 'bw-copies'],
  'document-services': ['bw-copies', 'color-copies']
};

function renderSuggestedProducts() {
  const container = document.getElementById('suggested-products-container');
  if (!container) return;
  container.innerHTML = '';
  
  const relatedKeys = relatedProductsMapping[selectedProduct] || [];
  if (relatedKeys.length === 0) return;
  
  const title = document.createElement('h5');
  title.innerText = 'Frequently Booked Together:';
  container.appendChild(title);
  
  const list = document.createElement('div');
  list.className = 'suggestions-list';
  
  relatedKeys.forEach(key => {
    const prod = productDatabase[key];
    if (!prod) return;
    
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'suggestion-pill-btn';
    btn.onclick = () => window.switchDrawerProduct(key);
    
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
      <span>${prod.name}</span>
    `;
    list.appendChild(btn);
  });
  
  container.appendChild(list);
}

window.switchDrawerProduct = function(productId) {
  const select = document.getElementById('booking-product-select');
  if (select) {
    select.value = productId;
    window.handleProductChange();
  }
};

// Render dynamic fields inside Step 1 based on selected product category
window.handleProductChange = function() {
  const select = document.getElementById('booking-product-select');
  selectedProduct = select.value;
  
  const container = document.getElementById('dynamic-product-options');
  container.innerHTML = ''; // clear previous
  
  const spec = productDatabase[selectedProduct];
  if (!spec) return;
  
  spec.options.forEach(opt => {
    const group = document.createElement('div');
    group.className = 'form-group';
    
    const label = document.createElement('label');
    label.setAttribute('for', `opt-${opt.id}`);
    label.innerText = opt.label;
    group.appendChild(label);
    
    if (opt.type === 'select') {
      const element = document.createElement('select');
      element.id = `opt-${opt.id}`;
      element.className = 'form-control';
      element.addEventListener('change', calculateEstimatedCost);
      
      opt.choices.forEach(c => {
        const o = document.createElement('option');
        o.value = c.val;
        o.innerText = c.text;
        element.appendChild(o);
      });
      group.appendChild(element);
    } else if (opt.type === 'number') {
      const element = document.createElement('input');
      element.type = 'number';
      element.id = `opt-${opt.id}`;
      element.className = 'form-control';
      element.value = opt.default || 100;
      element.min = opt.min || 1;
      element.addEventListener('input', calculateEstimatedCost);
      group.appendChild(element);
    }
    
    container.appendChild(group);
  });
  
  calculateEstimatedCost();
  renderSuggestedProducts();
};

function getSpecsFormState() {
  const spec = productDatabase[selectedProduct];
  if (!spec) return {};
  
  const state = {};
  spec.options.forEach(opt => {
    const el = document.getElementById(`opt-${opt.id}`);
    if (el) {
      let text = el.value;
      if (el.tagName === 'SELECT') {
        text = el.options[el.selectedIndex].text;
      }
      state[opt.id] = { val: el.value, text: text };
    }
  });
  return state;
}

function calculateEstimatedCost() {
  const spec = productDatabase[selectedProduct];
  if (!spec) return;
  
  const formState = getSpecsFormState();
  const specsPayload = {};
  for (let key in formState) {
    specsPayload[key] = formState[key].val;
  }
  
  const price = spec.calcPrice(specsPayload);
  
  document.getElementById('summary-product-name').innerText = spec.name;
  
  let desc = '';
  for (let key in formState) {
    desc += `${formState[key].text} | `;
  }
  document.getElementById('summary-options').innerText = desc.slice(0, -3);
  document.getElementById('summary-price').innerText = `$${price.toFixed(2)}`;
}

window.changeStep = function(direction) {
  // Stuffed
};

function updateDrawerStepDisplay() {
  // Stuffed
}

// --- Submit Booking (WhatsApp or Email integration) ---
window.submitBooking = function(channel) {
  const name = document.getElementById('client-name').value.trim();
  const email = document.getElementById('client-email').value.trim();
  const phone = document.getElementById('client-phone').value.trim();
  const delivery = "Pickup";
const deliveryAddress = "";
  if (!name || !email || !phone) {
    alert("Please complete all contact detail fields before submitting.");
    return;
  }
  
 
  
  const productSpec = productDatabase[selectedProduct];
  const formState = getSpecsFormState();
  const estimatedCost = document.getElementById('summary-price').innerText;
  const notes = document.getElementById('booking-notes').value.trim() || 'No special instructions.';
  const fileUploadedText = uploadedFile ? `${uploadedFile.name} (${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB)` : 'No file uploaded (will email design layout later).';
  
  let specsText = '';
  for (let key in formState) {
    specsText += `\n- ${formState[key].text}`;
  }

  // Compile detailed text message
  const summaryPayload = `
*NEW PRINTING ORDER BOOKING*
--------------------------------
*Product:* ${productSpec.name}
*Configurations:* ${specsText}
*Estimated Price:* ${estimatedCost}
*Special Notes:* ${notes}
*Attached Mockup:* ${fileUploadedText}

*CLIENT INFORMATION:*
--------------------------------
*Name:* ${name}
*Email:* ${email}
*Phone:* ${phone}
*Delivery Option:* ${delivery}
${deliveryAddress ? `*Delivery/Pickup Address:* ${deliveryAddress}\n` : ''}
`;

  if (channel === 'whatsapp') {
    const waPhone = '14165314377'; // Owner's WhatsApp Number
    const url = `https://wa.me/${waPhone}?text=${encodeURIComponent(summaryPayload.trim())}`;
    window.open(url, '_blank');
    
    showSuccessToast("WhatsApp booking compiled! Sending via WhatsApp window.");
    closeBookingDrawer();
    resetBookingForm();
  } else if (channel === 'email') {
    const submitBtn = document.getElementById('submit-email-btn');
    submitBtn.innerText = 'Submitting...';
    submitBtn.disabled = true;
    
    const formData = new FormData();
    formData.append('access_key', '5c44cf6d-f0b4-42b7-a36c-9407bf8a964a'); // Actual Web3Forms Token
    formData.append('subject', `NEW Booking Request: ${productSpec.name} - ${name}`);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
   
    formData.append('booking_summary', summaryPayload);
    
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showSuccessToast("Booking inquiry sent to owner's email successfully!");
        closeBookingDrawer();
        resetBookingForm();
      } else {
        alert("There was an error sending the email request: " + data.message);
      }
    })
    .catch(error => {
      console.error("Error submitting booking:", error);
      alert("Submission error. You can still submit this booking directly via WhatsApp!");
    })
    .finally(() => {
      submitBtn.innerText = 'Book via Email';
      submitBtn.disabled = false;
    });
  }
};

function resetBookingForm() {
  document.getElementById('booking-flow-form').reset();
  document.getElementById('booking-notes').value = '';
  document.getElementById('uploaded-file-list').innerHTML = '';
  uploadedFile = null;
}

function showSuccessToast(message) {
  const toast = document.getElementById('success-toast');
  document.getElementById('success-message').innerText = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 5000);
}

// --- Full Catalog Filter Categories ---
window.filterCatalog = function(category, button) {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  if (button) button.classList.add('active');
  
  const cards = document.querySelectorAll('#main-catalog-grid .product-card');
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'all' || cardCat === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
};
