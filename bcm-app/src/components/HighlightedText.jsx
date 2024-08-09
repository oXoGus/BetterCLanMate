import React from 'react';

const HighlightedText = ({ text, color, customHeight }) => {
  return (
    <div className="relative inline-block">
      <svg
        className="absolute left-0 top-1/2 transform -translate-y-1/2"
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
