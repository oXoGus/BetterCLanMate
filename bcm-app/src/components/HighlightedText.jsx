import React from 'react';

const HighlightedText = ({ text, color, customHeight }) => {
  return (
    // les position absolue sur relative a la div elle même
    <div className="relative inline-block">
      {/* on creer le svg avec sa position  */}
      <svg
        className="absolute left-0 top-1/2 transform -translate-y-1/2 "
        width="100%"
        height={customHeight}
      >
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill={color}
        />
      </svg>
      <span className="relative">{text}</span>
    </div> 
  );
};

export default HighlightedText;
