'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  User,
  Camera,
  ChevronRight,
} from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'try-on' | 'catalog'>('try-on');

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-black">
      {/* Status bar */}
      <div className="h-10 flex justify-between items-center px-6 bg-[#f5f5f5]">
        <div className="text-sm font-medium">9:41</div>
        <div className="flex items-center gap-1">
          <svg
            width="16"
            height="12"
            viewBox="0 0 16 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 4.5C1 2.567 2.567 1 4.5 1H11.5C13.433 1 15 2.567 15 4.5V7.5C15 9.433 13.433 11 11.5 11H4.5C2.567 11 1 9.433 1 7.5V4.5Z"
              stroke="black"
              strokeWidth="2"
            />
            <path d="M16 4.5H15.5V7.5H16V4.5Z" fill="black" />
          </svg>
          <svg
            width="16"
            height="12"
            viewBox="0 0 16 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8 0C9.6 0 11.1 0.5 12.3 1.4C13.5 2.2 14.4 3.4 14.9 4.8C15 5.1 15 5.4 15 5.7C15 6 15 6.3 14.9 6.6C14.4 8 13.5 9.2 12.3 10C11.1 10.9 9.6 11.4 8 11.4C6.4 11.4 4.9 10.9 3.7 10C2.5 9.2 1.6 8 1.1 6.6C1 6.3 1 6 1 5.7C1 5.4 1 5.1 1.1 4.8C1.6 3.4 2.5 2.2 3.7 1.4C4.9 0.5 6.4 0 8 0ZM8 2.3C6.5 2.3 5.3 3.5 5.3 5C5.3 6.5 6.5 7.7 8 7.7C9.5 7.7 10.7 6.5 10.7 5C10.7 3.5 9.5 2.3 8 2.3ZM8 3.7C8.7 3.7 9.3 4.3 9.3 5C9.3 5.7 8.7 6.3 8 6.3C7.3 6.3 6.7 5.7 6.7 5C6.7 4.3 7.3 3.7 8 3.7Z"
              fill="black"
            />
          </svg>
          <svg
            width="24"
            height="12"
            viewBox="0 0 24 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.5"
              width="23"
              height="11"
              rx="2.5"
              stroke="black"
            />
            <rect x="2" y="2" width="18" height="8" rx="1" fill="black" />
          </svg>
        </div>
      </div>

      {activeTab === 'try-on' ? (
        <TryOnView setActiveTab={setActiveTab} />
      ) : (
        <CatalogView setActiveTab={setActiveTab} />
      )}

      {/* Home indicator */}
      <div className="h-8 flex justify-center items-center">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  );
}

function TryOnView({
  setActiveTab,
}: {
  setActiveTab: (tab: 'try-on' | 'catalog') => void;
}) {
  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)]">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="text-sm font-medium uppercase tracking-wider">
          VIRTUAL STYLE
        </div>
        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
          <Heart className="h-5 w-5" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/placeholder.svg?height=600&width=400"
            alt="Virtual model"
            width={400}
            height={600}
            className="h-full w-auto object-contain"
          />

          {/* Interactive elements */}
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-[200px] h-[100px]">
            <svg
              width="200"
              height="100"
              viewBox="0 0 200 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 50C20 50 60 20 100 50C140 80 180 50 180 50"
                stroke="white"
                strokeWidth="2"
              />
              <circle cx="20" cy="50" r="6" fill="#FF6B00" />
              <circle cx="180" cy="50" r="6" fill="#FF6B00" />
            </svg>
          </div>

          {/* Measurement points */}
          <div className="absolute top-1/3 left-1/3">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
          <div className="absolute top-1/3 right-1/3">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
          <div className="absolute top-1/2 left-1/4">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
          <div className="absolute top-1/2 right-1/4">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>

          {/* Measurement lines */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 400 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M150 200L120 300L180 350L240 300L210 200"
              stroke="#DDDDDD"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          </svg>
        </div>
      </div>

      {/* Bottom items */}
      <div className="p-4">
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[120px] bg-white rounded-xl overflow-hidden shadow-sm"
            >
              <div className="h-[100px] relative">
                <Image
                  src="/placeholder.svg?height=100&width=120"
                  alt={`Clothing item ${i}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-2">
                <div className="text-xs truncate">Item Name Here</div>
                <div className="text-xs font-semibold text-[#FF6B00]">
                  $49.99
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="bg-white rounded-full mx-4 mb-4 p-2 shadow-md flex justify-between items-center">
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt={`Profile ${i}`}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="flex">
          <button
            className="w-12 h-12 rounded-full bg-[#FF6B00] flex items-center justify-center"
            onClick={() => setActiveTab('catalog')}
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CatalogView({
  setActiveTab,
}: {
  setActiveTab: (tab: 'try-on' | 'catalog') => void;
}) {
  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)]">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <button
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm"
          onClick={() => setActiveTab('try-on')}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="text-sm font-medium">NO COTENJE</div>
        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
          <Heart className="h-5 w-5" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 px-4">
        <div className="flex gap-4">
          {/* Model */}
          <div className="w-1/2">
            <Image
              src="/placeholder.svg?height=500&width=200"
              alt="Model"
              width={200}
              height={500}
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Clothing items */}
          <div className="w-1/2 flex flex-col gap-4">
            <div className="aspect-[4/3] bg-white rounded-lg shadow-sm p-2 flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=150&width=200"
                alt="Clothing item 1"
                width={200}
                height={150}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="aspect-[4/3] bg-white rounded-lg shadow-sm p-2 flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=150&width=200"
                alt="Clothing item 2"
                width={200}
                height={150}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Small items */}
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-white rounded-lg shadow-sm p-2 flex items-center justify-center"
                >
                  <Image
                    src="/placeholder.svg?height=80&width=80"
                    alt={`Small item ${i}`}
                    width={80}
                    height={80}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="flex justify-around items-center p-4">
        <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
          <User className="h-5 w-5" />
        </button>
        <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
          <ShoppingBag className="h-5 w-5" />
        </button>
        <button className="w-16 h-16 rounded-full bg-[#FF6B00] flex items-center justify-center shadow-md">
          <Camera className="h-8 w-8 text-white" />
        </button>
        <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 4V16M4 10H16"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
          <User className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
