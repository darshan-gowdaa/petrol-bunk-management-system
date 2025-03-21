import React, { useState } from 'react';
import { Info } from 'lucide-react';
import toWords from 'number-to-words';

// Function to format number as per Indian numbering system
const formatIndianNumber = (num) => {
  return num.toLocaleString('en-IN');
};

// Function to convert number to words in the Indian numbering system
const getIndianNumberInWords = (num, prefix, suffix) => {
  const [integer, decimal] = num.toString().replace(/,/g, '').split('.');
  let words = toWords.toWords(parseInt(integer)).replace(/^\w/, (c) => c.toUpperCase());

  // Handle Indian number system words
  const units = ['Thousand', 'Lakh', 'Crore'];
  const numValue = parseInt(integer);
  if (numValue >= 10000000) words = words.replace('million', units[2]); // Crore
  else if (numValue >= 100000) words = words.replace('hundred thousand', units[1]); // Lakh
  else if (numValue >= 1000) words = words.replace('thousand', units[0]); // Thousand

  if (decimal) words += ' point ' + [...decimal].map((d) => toWords.toWords(parseInt(d))).join(' ');

  // Append relevant unit
  if (prefix) words += ' rupees';
  else if (suffix) words += ' Liters';

  return words;
};

const StatsCard = ({ icon, iconBgColor, iconColor, title, value, prefix = '', suffix = '' }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="w-full p-4 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 ${iconColor} ${iconBgColor} rounded-full`}>{icon}</div>
          <div className="ml-4">
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-xl font-bold text-white md:text-2xl lg:text-3xl">
              {prefix}{formatIndianNumber(value)}{suffix}
            </p>
          </div>
        </div>
        <div className="relative">
          <Info
            size={16}
            className="text-gray-400 cursor-pointer hover:text-gray-300"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          {showTooltip && (
            <div className="absolute top-0 w-48 p-2 text-sm text-white bg-gray-900 rounded shadow-md right-5">
              {getIndianNumberInWords(value, prefix, suffix)}
              <div className="absolute right-[-4px] top-2 w-2 h-2 rotate-45 bg-gray-900"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;