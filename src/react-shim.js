// React shim for production builds
import React from 'react'
import ReactDOM from 'react-dom'

// Ensure React is available globally for Three.js
if (typeof window !== 'undefined') {
  window.React = React
  window.ReactDOM = ReactDOM
  
  // Ensure React hooks are available
  if (React.useLayoutEffect) {
    window.__REACT_HOOKS__ = {
      useLayoutEffect: React.useLayoutEffect,
      useEffect: React.useEffect,
      useState: React.useState,
      useRef: React.useRef,
      useMemo: React.useMemo,
      useCallback: React.useCallback
    }
  }
}

export { React, ReactDOM }