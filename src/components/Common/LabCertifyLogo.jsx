import React from 'react';

/**
 * Official Brand Logo Component
 * Renders the official Shalaby Labs — LabCertify Clinical logo
 * Exactly matching the user's provided logo asset
 */
export const LabCertifyLogo = ({ 
  className = "", 
  iconSize = "h-8 sm:h-9", 
  showText = true 
}) => {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <img 
        src="/logo.png" 
        alt="Shalaby Labs — LabCertify Clinical" 
        className={`${iconSize} w-auto object-contain shrink-0`} 
      />
    </div>
  );
};

export default LabCertifyLogo;
