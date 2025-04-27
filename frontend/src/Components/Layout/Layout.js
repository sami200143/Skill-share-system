import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar/NavBar';
import './Layout.css';

/**
 * Layout component that wraps the application content
 * and provides consistent navigation with NavBar
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render within layout
 */
function Layout({ children }) {
  const [isAnimationLoaded, setIsAnimationLoaded] = useState(false);
  
  useEffect(() => {
    // Ensure animations start after component is mounted
    setIsAnimationLoaded(true);
  }, []);

  // Art-themed shapes for modern glass UI
  const artShapes = ['circle', 'rounded-square', 'blob', 'wave'];

  return (
    <div className="layout">
      <NavBar />
      <div className="gradient-background">
        <div className="gradient-overlay glass-effect"></div>
        {/* Animated background elements with animation class controlled by state */}
        <div className={`animated-bg-elements ${isAnimationLoaded ? 'animation-active' : ''}`}>
          {Array.from({ length: 12 }).map((_, index) => (
            <div 
              key={index} 
              className={`animated-element glass-element element-${index + 1} shape-${artShapes[index % artShapes.length]}`}
              style={{
                animationDelay: `${index * 0.6}s`,
                width: `${Math.floor(60 + Math.random() * 140)}px`,
                height: `${Math.floor(60 + Math.random() * 140)}px`,
                left: `${Math.floor(Math.random() * 90)}%`,
                top: `${Math.floor(Math.random() * 90)}%`,
                opacity: 0.2 + Math.random() * 0.3,
              }}
            ></div>
          ))}
        </div>
        <main className="content-container glass-panel">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
