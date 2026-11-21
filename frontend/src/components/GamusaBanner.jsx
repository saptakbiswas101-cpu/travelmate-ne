import React from 'react';

export default function GamusaBanner({ className = "" }) {
  return (
    <div className={`w-full overflow-hidden flex items-center h-1.5 opacity-90 ${className}`}>
      <div 
        className="w-full h-full"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            #D92534 0px,
            #D92534 6px,
            #FFFFFF 6px,
            #FFFFFF 12px
          )`
        }}
      />
    </div>
  );
}
