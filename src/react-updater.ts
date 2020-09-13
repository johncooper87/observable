import * as React from 'react';

function reducer(value: boolean) {
  return !value;
}

export function useUpdater(): () => void {
  console.log('useUpdater');
  return React.useReducer(reducer, false)[1];
}