import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import {RiHomeFill} from 'react-icons/ri'
import logo from '../assets/AJC_logo.png'
import { categories } from '../util/data'
import Logout from '../components/Logout'



const isNotActiveStyle = 'flex font-mono items-center px-5 gap-3 text-orange-200 border-black hover:text-black transition-all duration-200 ease-in-out capitalize'


const isActiveStyle = 'flex font-mono items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize'






const Sidebar = ({user, closeToggle}) => {
  const handleCloseSidebar = ()=>{
    
    if(closeToggle) closeToggle(false);
    
  };
  
  return (
    
  
    <div className='flex flex-col justify-between bg-gradient-to-r from-rose-900 to-stone-900 h-full overflow-y-scroll min-w-210 hide-scrollbar '>
        
        <div className='flex flex-col'>
            <Link 
                to = "/"
                className='flex px-5 gap-2 my-6 pt-1 w-190 items-center'
                onClick={handleCloseSidebar}
                
            >
                <img src={logo} alt="logo" className='w-20' referrerPolicy="no-referrer"/>
            </Link>
            
            <div className='flex flex-col gap-5'>
                <NavLink
                to="/" 
                className={( {isActive} ) => isActive ? isActiveStyle : isNotActiveStyle}
                onClick={handleCloseSidebar}
                
                >
                    <RiHomeFill />
                    Home
                    
                </NavLink>
                <h3 className='mt-2 px-5 text-base font-mono bg-slate-900 text-amber-200 before:2xl:text-xl'> Discover categories</h3>
                
                {
                
                //.map function retunrs value from orignal array and then maps that value to some function. This is done for each individual values obtained from the orignal array list
                categories.slice(0,categories.length).map((category) => (
                   
                    <NavLink
                        to={`/category/${category.name}`}
                        className={( {isActive} ) => isActive ? isActiveStyle : isNotActiveStyle}
                        onClick={handleCloseSidebar}
                        key={category.name}
                    >
                        <img 
                        src={
                            category.image
                        }
                        
                        className='w-8 h-8 rounded-full shadow-sm'
                        alt='category'
                        />
                        {category.name}
                    </NavLink>
                    
                ))
                
                }
                  
            </div>
        </div>
        {user && (
            <div className='bg-orange-200 mt-10 flex items-center z-0'>
                <Link
                    to={`user-profile/${user._id}`}
                    className="flex w-1/2 my-5 mb-3 gap-2 p-2 items-center z-30"
                    onClick={handleCloseSidebar}
                >
                    <img src={user.image} className="w-10 h-10 rounded-full " alt="user-profile" referrerPolicy="no-referrer" />
                    <p>{user.userName}</p>
                </Link>
                <Logout version={2} user={user}/>
            
            </div>
            
        )}
        
        
        
        
    </div>
  )
}

export default Sidebar
