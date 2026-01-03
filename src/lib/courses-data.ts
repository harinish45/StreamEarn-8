
export type Course = {
  id: string;
  title: string;
  description: string;
  icon: string;
  imageKey: string;
};

export type CourseCategory = {
  id: string;
  name: string;
  courses: Course[];
};

export const coursesData: CourseCategory[] = [
  {
    id: 'ai-development',
    name: 'AI Development',
    courses: [
      {
        id: 'py-ai',
        title: 'Intro to Python for AI',
        description: 'Master the foundational language of artificial intelligence.',
        icon: 'BrainCircuit',
        imageKey: 'pythonCodeImage'
      },
      {
        id: 'adv-ml',
        title: 'Advanced Machine Learning',
        description: 'Dive deep into complex algorithms and neural networks.',
        icon: 'BrainCircuit',
        imageKey: 'machineLearningImage'
      },
      {
        id: 'nlp',
        title: 'Natural Language Processing',
        description: 'Teach machines to understand and respond to human language.',
        icon: 'BrainCircuit',
        imageKey: 'nlpDiagramImage'
      },
      {
        id: 'cv-funds',
        title: 'Computer Vision Fundamentals',
        description: 'Learn how machines see and interpret the visual world.',
        icon: 'BrainCircuit',
        imageKey: 'computerVisionImage'
      },
    ],
  },
  {
    id: 'content-creation',
    name: 'Content Creation',
    courses: [
      {
        id: 'yt-master',
        title: 'YouTube Masterclass',
        description: 'Grow your channel from 0 to 100,000 subscribers.',
        icon: 'Youtube',
        imageKey: 'youtubeCreatorImage1'
      },
      {
        id: 'seo-writers',
        title: 'SEO for Writers',
        description: 'Learn to rank your content on the first page of Google.',
        icon: 'FileText',
        imageKey: 'contentWritingImage1'
      },
      {
        id: 'podcast-beg',
        title: 'Podcasting for Beginners',
        description: 'Launch and monetize your own successful podcast.',
        icon: 'Mic',
        imageKey: 'voiceoverMicrophoneImage1'
      },
      {
        id: 'smm',
        title: 'Social Media Marketing',
        description: 'Build and engage a loyal audience on any platform.',
        icon: 'Share2',
        imageKey: 'socialMediaImage1'
      },
    ],
  },
  {
    id: 'freelancing-business',
    name: 'Freelancing & Business',
    courses: [
      {
        id: 'freelance-kick',
        title: 'The Freelance Kickstarter',
        description: 'Your A-Z guide to starting a profitable freelance career.',
        icon: 'BriefcaseBusiness',
        imageKey: 'virtualAssistantImage1'
      },
      {
        id: 'digital-agency',
        title: 'Building a Digital Agency',
        description: 'Scale your freelance skills into a 6-figure agency.',
        icon: 'BriefcaseBusiness',
        imageKey: 'virtualAssistantImage2'
      },
      {
        id: 'client-acq',
        title: 'Client Acquisition Secrets',
        description: 'Never worry about finding high-paying clients again.',
        icon: 'BriefcaseBusiness',
        imageKey: 'virtualAssistantImage3'
      },
      {
        id: 'financial-mgmt',
        title: 'Financial Management for Creatives',
        description: 'Master your money, from invoicing to investing.',
        icon: 'BriefcaseBusiness',
        imageKey: 'virtualAssistantImage4'
      },
    ],
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    courses: [
      {
        id: 'dropship-101',
        title: 'Dropshipping 101',
        description: 'Build a profitable online store without holding inventory.',
        icon: 'Store',
        imageKey: 'shippingBoxImage1'
      },
      {
        id: 'shopify-mastery',
        title: 'Shopify Store Mastery',
        description: 'Become an expert in the world\'s most popular e-com platform.',
        icon: 'Store',
        imageKey: 'onlineShoppingImage1'
      },
      {
        id: 'pod-profits',
        title: 'Print-on-Demand Profits',
        description: 'Sell custom-designed products with zero upfront cost.',
        icon: 'Printer',
        imageKey: 'tshirtDesignImage1'
      },
      {
        id: 'fba-beg',
        title: 'Amazon FBA for Beginners',
        description: 'Leverage the power of Amazon to build your own brand.',
        icon: 'Package',
        imageKey: 'shippingBoxImage2'
      },
    ],
  },
];
