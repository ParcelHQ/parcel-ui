import React from 'react';
import '../../assets/scss/components/app-loader.scss';

export default function ComponentSpinner() {
  return (
    <div className="fallback-spinner">
      <div className="loading component-loader">
        <div className="effect-1 effects"></div>
        <div className="effect-2 effects"></div>
        <div className="effect-3 effects"></div>
      </div>
    </div>
  );
}
