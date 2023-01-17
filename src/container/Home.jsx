import React, { useState, useRef, useEffect} from 'react';
import {HiMenu} from 'react-icons/hi';
import {AiFillCloseCircle} from 'react-icons/ai';
import {Link, Route, Routes} from 'react-router-dom';
import {SideBar, UserProfile} from '../components';
import Pins from './Pins'
import { client } from '../client';
import logo from '../assets/AJC_logo.png';
import { userQuery } from '../util/data';
import { fetchUser } from './../util/fetchUsers';
import { adminBorder } from '../util/css';
import { checkAdm } from './../util/data';

const Home = () => {
  //states
  const [toggleSideBar , setToggleSidebar] = useState(false);
  const [user , setUser] = useState(null);
  const scrollRef = useRef(null);
  

  const userInfo = fetchUser();

  useEffect(() =>{
    const query = userQuery(userInfo?.sub);
    
    client.fetch(query)
      .then((data) =>{
        
        setUser(data[0]);
        console.log('userName >>' + userInfo?.name)
      })
      
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); //componenet dead mount
  
  
  
  useEffect(() =>{
    scrollRef.current.scrollTo(0,0)
    
  }, []); 
  
 
  
  
return (
  
<div className='flex-col w-full h-full object-cover bg-gradient-to-l from-orange-300 to-rose-500 text-center'> 
    <h1 className='font-mono animate-pulse pt-4 flex-col'> EXEDIA PLATFORMS LTD. <br></br> <br></br></h1> 
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out'>
        
        <div className='hidden md:flex h-screen flex-initial' >
        {
        

        /*Desktop side bar for md:flex*/
        }
            <SideBar user={user && user} />
        </div>
        
        <div className='flex md:hidden flex-col'>
        
            <div className='p-2 w-full flex flex-row justify-between items-center shadow-lg bg-gray-900' >

            <HiMenu fontSize={40} className="cursor-pointer text-amber-200 flex-row" onClick={()=>{ setToggleSidebar(true)}} />
            <Link to="/">
              <img src={logo} alt="Ajc.png" 
              
              className= "w-20 h-25 flex-row" 
              referrerPolicy="no-referrer"/> 
            </Link>
            
            <Link to={`user-profile/${user?._id}`}>
              <img src={user?.image}  alt="UserImage.png" className={ !checkAdm( ) ? (
                  'w-16 h-16 rounded-lg flex-row'
                
                ) : ( 
                
                  `${adminBorder}`
                ) 
              } referrerPolicy="no-referrer"/> 
            </Link>

          </div> 
          
          {toggleSideBar ? (  //conditional rendering if toggleSidebar is true render the following
          
          <div className='absolute w-full h-screen'>
            
            
            
            <div className='absolute w-3/5 h-screen  text-center overflow-y-auto shadow-md z-20 animate-slide-in'>
            
                <div className='absolute w-full flex justify-end items-center p-2'>

                  <AiFillCloseCircle fontSize={30} className="cursor-pointer bg-orange-200" onClick={() => {
                    setToggleSidebar(false)
                  }}/>
                
                </div>
                
                <SideBar user={user ? user : null} closeToggle={setToggleSidebar}/>
              
              
              </div>
              
              <div className='relative w-full h-screen  text-center  shadow-md z-10 bg-blackOverlay '
              onClick= {
                (e) => {
                  e.stopPropagation();
                  setToggleSidebar(false)
                
                }
              }
              
              ></div>
              
              
          </div>
          
          ) : null }
        
          
        </div>
        
        
        <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef} id='overflowDiv'>
              <Routes>
                <Route path='/user-profile/:userId' element={<UserProfile />} />
                <Route path='/*' element={<Pins user={user && user}/>} />
              </Routes>
        </div>
        
    </div>
</div>
  )
}

export default Home
