"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Home } from 'lucide-react';

const HomeButton = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150); // Reset after 200ms
    router.push('/');
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsClicked(false);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsClicked(false);
  };

  return (
    <div>
      <Button
        onClick={handleClick}
        onMouseDown={() => setIsClicked(true)}
        onMouseUp={() => setIsClicked(false)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className='text-white'
        style={{ 
          border: '1px solid transparent', 
          padding:'2px 10px', 
          borderRadius: '20px',
          backgroundColor: isClicked ? '#9b3f96' : '#b754c9', // Change color when clicked
          transition: 'all 0.3s ease',
          display: 'flex', // Add this
          alignItems: 'center', // Add this
          justifyContent: 'center' // Add this
        }}
      >
        <Home className='pr-0' style={{ fontSize: '24px' }}/>
        <span style={{ 
          display: isHovered ? 'inline' : 'none', // Change this
          transition: 'display 0.8s ease' // Change this
        }}>
          Home
        </span>
      </Button>
    </div>
  );
};

export default HomeButton;
