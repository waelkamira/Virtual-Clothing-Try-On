'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  MessageSquare,
} from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';

// Define FAQ categories
const faqCategories = [
  { id: 'general', name: 'General' },
  { id: 'account', name: 'Account' },
  { id: 'try-on', name: 'Try-On' },
  { id: 'importing', name: 'Importing' },
  { id: 'technical', name: 'Technical' },
  { id: 'payment', name: 'Payment' },
];

// Define FAQs
const faqs = [
  {
    id: 1,
    question: 'How does the virtual try-on feature work?',
    answer:
      'Our virtual try-on feature uses advanced AI technology to overlay clothing items onto your photo. Simply upload a photo of yourself, select the items you want to try on, and our system will generate realistic images of how the clothes would look on you.',
    category: 'try-on',
  },
  {
    id: 2,
    question: 'Can I import products from any online store?',
    answer:
      'Yes, you can import products from most major online stores. Simply paste the URL of the product page or store, and our system will extract the available products for you to try on.',
    category: 'importing',
  },
  {
    id: 3,
    question: 'How do I create an account?',
    answer:
      'To create an account, click on the profile icon in the top right corner and select "Sign Up". Fill in your details, and you\'re ready to go!',
    category: 'account',
  },
  {
    id: 4,
    question: 'Is my personal data secure?',
    answer:
      'Yes, we take data security very seriously. All your photos and personal information are encrypted and stored securely. We never share your data with third parties without your explicit consent.',
    category: 'general',
  },
  {
    id: 5,
    question: 'How accurate is the virtual try-on?',
    answer:
      "Our virtual try-on provides a good representation of how clothes would look on you, including fit, color, and style. However, it's not 100% accurate as factors like exact fabric behavior and precise sizing can vary.",
    category: 'try-on',
  },
  {
    id: 6,
    question: "What if the website I want to import from isn't supported?",
    answer:
      "If you encounter a website that isn't supported, please contact our support team. We're constantly adding support for new stores and can prioritize based on user requests.",
    category: 'importing',
  },
  {
    id: 7,
    question: 'How do I reset my password?',
    answer:
      'To reset your password, click on "Forgot Password" on the login screen. Enter your email address, and we\'ll send you a link to reset your password.',
    category: 'account',
  },
  {
    id: 8,
    question: 'Can I save my virtual try-on images?',
    answer:
      'Yes, you can save, download, or share your virtual try-on images directly from the app.',
    category: 'try-on',
  },
  {
    id: 9,
    question: 'What devices is the app compatible with?',
    answer:
      'Our app works on most modern devices including smartphones, tablets, and computers. We support the latest versions of Chrome, Safari, Firefox, and Edge browsers.',
    category: 'technical',
  },
  {
    id: 10,
    question: 'Is there a limit to how many items I can try on?',
    answer:
      'Free accounts can try on up to 5 items per day. Premium subscribers have unlimited try-ons.',
    category: 'try-on',
  },
  {
    id: 11,
    question: 'How do I purchase items I like?',
    answer:
      'After trying on an item, you can click the "Buy" button which will redirect you to the original store where you can complete your purchase.',
    category: 'general',
  },
  {
    id: 12,
    question: 'Do you offer refunds for premium subscriptions?',
    answer:
      "Yes, we offer a 14-day money-back guarantee for all premium subscriptions. If you're not satisfied with our service, you can request a refund within 14 days of purchase.",
    category: 'payment',
  },
  {
    id: 13,
    question: 'How do I contact customer support?',
    answer:
      'You can contact our customer support team through the "Contact" page on our website, by email at support@virtualfit.com, or by using the chat feature in the app.',
    category: 'general',
  },
  {
    id: 14,
    question: 'Can I try on accessories like hats and jewelry?',
    answer:
      "Currently, our system primarily supports clothing items. We're working on adding support for accessories in a future update.",
    category: 'try-on',
  },
  {
    id: 15,
    question: 'How do I update my measurements?',
    answer:
      'You can update your measurements in your profile settings. Accurate measurements help our system provide more realistic try-on results.',
    category: 'account',
  },
];

interface FAQItem {
  question: string;
  answer: string;
  isOpen: boolean;
  toggleOpen: () => void;
}

// FAQ component
const FAQ = ({ question, answer, isOpen, toggleOpen }: FAQItem) => {
  return (
    <div className="border-b border-border last:border-0">
      <button
        className="flex justify-between items-center w-full py-4 text-left"
        onClick={toggleOpen}
      >
        <span className="font-medium">{question}</span>
        {isOpen ? (
          <ChevronDown className="h-5 w-5 text-orange-500" />
        ) : (
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 text-muted-foreground">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('general');
  const [openFAQs, setOpenFAQs] = useState<number[]>([]);

  // Filter FAQs based on search query and category
  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === 'all' || faq.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: number) => {
    setOpenFAQs((prev) =>
      prev.includes(id) ? prev.filter((faqId) => faqId !== id) : [...prev, id],
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <Link
              href="/"
              className="mr-4 p-2 rounded-full bg-orange-500/10 text-muted-foreground hover:text-foreground hover:bg-orange-500/20 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold">Help Center</h1>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-6 sticky top-24">
                <div className="mb-6">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      <Search size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search help articles..."
                      className="w-full pl-10 pr-4 py-2 bg-background/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3 flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2 text-orange-500" />
                    Categories
                  </h3>
                  <div className="space-y-1">
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        activeCategory === 'all'
                          ? 'bg-orange-500/20 text-orange-500'
                          : 'hover:bg-background/80 text-muted-foreground hover:text-foreground'
                      }`}
                      onClick={() => setActiveCategory('all')}
                    >
                      All Categories
                    </button>
                    {faqCategories.map((category) => (
                      <button
                        key={category.id}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          activeCategory === category.id
                            ? 'bg-orange-500/20 text-orange-500'
                            : 'hover:bg-background/80 text-muted-foreground hover:text-foreground'
                        }`}
                        onClick={() => setActiveCategory(category.id)}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-orange-500" />
                    Need more help?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Can't find what you're looking for? Contact our support
                    team.
                  </p>
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    asChild
                  >
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6">
                  {activeCategory === 'all'
                    ? 'Frequently Asked Questions'
                    : `${faqCategories.find((c) => c.id === activeCategory)?.name || ''} FAQs`}
                </h2>

                {filteredFAQs.length > 0 ? (
                  <div className="space-y-1">
                    {filteredFAQs.map((faq) => (
                      <FAQ
                        key={faq.id}
                        question={faq.question}
                        answer={faq.answer}
                        isOpen={openFAQs.includes(faq.id)}
                        toggleOpen={() => toggleFAQ(faq.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                      <HelpCircle size={24} />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      No results found
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      We couldn't find any help articles matching your search.
                      Try different keywords or browse categories.
                    </p>
                    <Button
                      variant="outline"
                      className="border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-500"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('all');
                      }}
                    >
                      View All FAQs
                    </Button>
                  </div>
                )}
              </div>

              <div className="mt-8 bg-card/50 backdrop-blur-md border border-border rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6">Contact Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-background/50 border border-border rounded-lg">
                    <div className="flex items-center mb-3">
                      <Mail className="h-5 w-5 mr-2 text-orange-500" />
                      <h3 className="font-medium">Email Support</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      For general inquiries and support:
                    </p>
                    <a
                      href="mailto:support@virtualfit.com"
                      className="text-orange-500 hover:underline"
                    >
                      support@virtualfit.com
                    </a>
                  </div>
                  <div className="p-4 bg-background/50 border border-border rounded-lg">
                    <div className="flex items-center mb-3">
                      <Phone className="h-5 w-5 mr-2 text-orange-500" />
                      <h3 className="font-medium">Phone Support</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Available Monday-Friday, 9am-5pm EST:
                    </p>
                    <a
                      href="tel:+18001234567"
                      className="text-orange-500 hover:underline"
                    >
                      +1 (800) 123-4567
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
