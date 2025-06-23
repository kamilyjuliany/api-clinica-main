// utils/wrapScreen.js
import React from 'react';
import ScreenWrapper from '../components/ScreenWrapper';

export function wrapScreen(ScreenComponent) {
  return function (props) {
    return (
      <ScreenWrapper>
        <ScreenComponent {...props} />
      </ScreenWrapper>
    );
  };
}
