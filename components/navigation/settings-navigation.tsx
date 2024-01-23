"use client";

// import { useModal } from "@/hooks/use-modal-store";
// import { Button } from "../ui/button";
// import { Home, Settings } from "lucide-react";

// export const NavSettings = () => {
//     const {onOpen} = useModal();
//     return(
//         <div>
//             <Button
//             onClick={() => onOpen("settings")}
//             className='text-white'
//             style={{ border: '1px solid transperant', padding: '2px 25px', borderRadius: '20px',backgroundColor:'#b754c9'}}
//             >
//                 <Settings className='pr-2'/>
//                     Settings
//             </Button>
//         </div>
//     )
// }
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Settings } from 'lucide-react';
import { useModal } from "@/hooks/use-modal-store";

const NavSettings = () => {
  const { onOpen } = useModal();
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 100); // Reset after 100ms
    onOpen("settings");
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
          padding: '2px 10px', // Keep this consistent
          borderRadius: '20px',
          backgroundColor: isClicked ? '#9b3f96' : '#b754c9', // Change color when clicked
          transition: 'all 0.3s ease',
          display: 'flex', // Add this
          alignItems: 'center', // Add this
          justifyContent: 'center' // Add this
        }}
      >
        <Settings className='pr-0' style={{ fontSize: '24px' }}/>
        <span style={{ 
          display: isHovered ? 'inline' : 'none', // Change this
          transition: 'display 0.8s ease' // Change this
        }}>
          Settings
        </span>
      </Button>
    </div>
  );
};

export default NavSettings;
