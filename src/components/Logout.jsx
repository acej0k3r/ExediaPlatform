import React from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';




const Logout = ({version, user}) => {
    const navigate = useNavigate(  );
    const { userId } = useParams(  );
    const sub = sessionStorage.getItem( 'sub' );

    const logout = () => {
        localStorage.removeItem("user");
        sessionStorage.clear();
        localStorage.clear();
        googleLogout();
        navigate( '/login' );
      }
      
      
  return (
  
    version === 1 ? ( 
        <div
        className='absolute top-0 z-1 right-0 p-2'
        >
        { 
        
        userId === user._id && (
            <button
            type='button'
            className='bg-gradient-to-b from-slate-900 to-white font-bold font-mono shadow-lg rounded-sm p-2 text-black hover:text-amber-50'
            onClick={
                logout
                }
            >
            Logout
            </button>
        )
        
        }
    </div>
    ) : version === 2 ? (
        
        <div
        className='flex ml-10'
        >
        { 
        
        sub === user._id && (
            <button
            type='button'
            className='font-mono shadow-lg rounded-sm p-2 bg-gradient-to-b from-slate-900 to-white font-bold  hover:text-amber-50'
            onClick={
                logout
                }
            >
            Logout
            </button>
        )
        
        }
        
        </div>
        
    ) : ( 
    
        <></>
    )
    
    
    
  )
}

export default Logout
