import React from 'react';

const UnderlineText = ({ text, color, customHeight }) => {
  return (
    // les position absolue sur relative a la div elle même
    <div className="relative inline-block">
      {/* on créer le svg avec sa position absolue qui permet de superposer le svg avec le span*/}
      {/* le left-0 place le svg tout a gauche de la div ( c'est optionnel ) */}
      {/* le top-1/2 et le transform -translate-y-1/2 permet au svg et au span d'etre aligné verticalement et que donc dès qu'on modifi la hauteur du rectangle il reste centré*/}
      <svg
        className="absolute left-0"
        width="100%"
        height={customHeight}
        style={{
          bottom: "-7px"
        }}
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

export default UnderlineText;
