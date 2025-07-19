import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import NgoShortCard from '../NgoCardShort';
import { dummyNgos } from '../../content/data';

const GAP = 16;

const FilteredNgoDisplay = () => {
  const { ngos, NgoByFilter } = useAuth();
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const [x, setX] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  const displayedNgos = NgoByFilter.length > 0 ? NgoByFilter : ngos;

  useEffect(() => {
    const updateScrollLimit = () => {
      if (
        containerRef.current &&
        cardRef.current &&
        displayedNgos.length
      ) {
        const cardWidth = cardRef.current.offsetWidth;
        const containerWidth = containerRef.current.offsetWidth;
        const totalWidth = displayedNgos.length * (cardWidth + GAP);
        const scrollLimit = containerWidth >= totalWidth ? 0 : -(totalWidth - containerWidth);
        setMaxScroll(scrollLimit);
      }
    };

    updateScrollLimit();

    const resizeObserver = new ResizeObserver(updateScrollLimit);
    if (cardRef.current) resizeObserver.observe(cardRef.current);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [displayedNgos]);

  const handleSlide = (dir) => {
    if (!cardRef.current) return;
    const cardWidth = cardRef.current.offsetWidth + GAP;
    const shift = cardWidth * 1.5;

    let newX = dir === 'left' ? x + shift : x - shift ;
    if (newX > 0) newX = 0;
    if (newX < maxScroll) newX = maxScroll;
    setX(newX);
  };

  return (
    <div className="relative max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-10 pt-5 bg-white rounded-xl mb-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-wide">
          {NgoByFilter.length > 0 ? 'Filtered' : 'Featured'} NGOs
        </h2>
        <div className="hidden md:flex gap-3">
          <button
            onClick={() => handleSlide('left')}
            className="bg-gray-100 hover:bg-gray-200 flex-none text-gray-600 rounded-full h-12 w-12 p-3 shadow transition"
            aria-label="Slide left"
          >
            <i className="fi fi-rr-angle-left text-lg"></i>
          </button>
          <button
            onClick={() => handleSlide('right')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full h-12 w-12 p-3 shadow transition"
            aria-label="Slide right"
          >
            <i className="fi fi-rr-angle-right text-lg"></i>
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Mobile Nav Buttons */}
        <div className="md:hidden absolute top-1/2 left-2 z-10 -translate-y-1/2">
          <button
            onClick={() => handleSlide('left')}
            className="bg-gray-300 shadow-lg rounded-full h-12 w-12 p-3"
            aria-label="Slide left"
          >
            <i className="fi fi-rr-angle-left text-xl"></i>
          </button>
        </div>
        <div className="md:hidden absolute top-1/2 right-2 z-10 -translate-y-1/2">
          <button
            onClick={() => handleSlide('right')}
            className="bg-gray-300 shadow-lg rounded-full h-12 w-12 p-3"
            aria-label="Slide right"
          >
            <i className="fi fi-rr-angle-right text-xl"></i>
          </button>
        </div>

        {/* Scrollable Container */}
        <div ref={containerRef} className="overflow-hidden py-4 px-2 pr-4 bg-gray-50 rounded-lg">
          <motion.div
            className="flex gap-4"
            animate={{ x }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {displayedNgos.map((ngo, idx) => (
              <div
                key={ngo._id}
                ref={idx === 0 ? cardRef : null}
                className="w-[250px] sm:w-[280px] md:w-[300px] flex-shrink-0 transition-transform hover:scale-[1.015]"
              >
                <NgoShortCard data={ngo} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FilteredNgoDisplay;
