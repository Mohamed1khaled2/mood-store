"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/data/store";
import { Locale } from "@/app/i18n";

type ProductGalleryProps = {
  product: Product;
  locale: Locale;
};

export default function ProductGallery({ product, locale }: ProductGalleryProps) {
  const defaultImage = "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800";
  
  const images = product.images && product.images.length > 0 ? product.images : [defaultImage];
  const videoUrl = product.videoUrl;

  const [activeIndex, setActiveIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  // Helper to determine if videoUrl is YouTube
  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return "";
    let videoId = "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : "";
  };

  const isYoutube = videoUrl && (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be"));
  const embedUrl = isYoutube ? getYoutubeEmbedUrl(videoUrl!) : "";

  return (
    <div className="space-y-4">
      {/* Main Feature View */}
      <div className="relative aspect-[4/5] w-full bg-[#f8f9fa] rounded-lg overflow-hidden border border-[#201711]/5">
        {showVideo && videoUrl ? (
          <div className="absolute inset-0 w-full h-full bg-black">
            {isYoutube ? (
              <iframe
                src={embedUrl}
                title="Product video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            )}
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 z-20 px-3 py-1.5 bg-[#201711] text-[#fffaf3] text-[10px] font-bold uppercase tracking-widest rounded-lg cursor-pointer"
            >
              {locale === "ar" ? "عرض الصور" : "Show Images"}
            </button>
          </div>
        ) : (
          <>
            <Image
              src={images[activeIndex]}
              alt={product.name[locale]}
              fill
              priority
              className="object-cover transition-all duration-700 ease-out"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
            {videoUrl && (
              <button
                onClick={() => setShowVideo(true)}
                className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm hover:bg-white text-[#201711] text-xs font-bold uppercase tracking-widest rounded-xl transition shadow-md cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#8c5a3c]">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                {locale === "ar" ? "تشغيل الفيديو" : "Play Video"}
              </button>
            )}
          </>
        )}
      </div>

      {/* Thumbnails */}
      {!showVideo && (images.length > 1 || videoUrl) && (
        <div className="flex gap-3 overflow-x-auto py-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-20 aspect-[4/5] rounded-md overflow-hidden border-2 transition ${
                activeIndex === idx ? "border-[#8c5a3c]" : "border-transparent"
              } cursor-pointer`}
            >
              <Image src={img} alt="" fill className="object-cover" />
            </button>
          ))}

          {videoUrl && (
            <button
              onClick={() => setShowVideo(true)}
              className="relative w-20 aspect-[4/5] rounded-md overflow-hidden bg-black/80 flex flex-col items-center justify-center border-2 border-transparent hover:border-[#8c5a3c] transition cursor-pointer"
            >
              <span className="text-xl">🎥</span>
              <span className="text-[8px] font-bold text-white uppercase tracking-widest mt-1">
                {locale === "ar" ? "فيديو" : "Video"}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
