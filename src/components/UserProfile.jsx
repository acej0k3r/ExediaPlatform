import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../util/data'
import { client } from '../client';
import MasonaryLayout from './MasonryLayout';
import Spinner from './Spinner';
import Logout from './Logout';

const randomImage = "https://source.unsplash.com/1600x900/?nature,photography,technology,art"

const activeBtnStyles = 'mt-4 bg-amber-200 text-black font-bold p-2 rounded-full w-20 outline-none border-2'
const notActiveBtnStyles = 'mt-4 bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 border-b-2'


const UserProfile = () => {
  
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Created'); //created | saved
  const [activeBtn, setActiveBtn] = useState('created');
  const { userId } = useParams(  );
 
 

 
 
 
  useEffect( () => {
  
    const query = userQuery( userId );
    client.fetch( query )
      .then( (data) => {
        setUser( data[0] );
        
      
      } )
  
  }, [userId] );
  
  
  useEffect(() => {
    if( text === 'Created' ){
      const createdQuery = userCreatedPinsQuery( userId );
      client.fetch(createdQuery)
        .then( (data) => {
          setPins( data );
        
        } )
    }else{ 
      const savedQuery = userSavedPinsQuery( userId );
      client.fetch( savedQuery )
        .then( (data) => {
          setPins( data );
        } )
    }
  }, [text, userId]);
  
  
  
  
  if( !user ){
    return <Spinner message="Loading profile..." />
  }
   
  
  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className='felx flex-col pb-5'>
        <div className='flex flex-col justify-center items-center'>
          <img
            src={ randomImage }
            className='w-full h-370 2xl:h-510 shadow-lg object-cover'
            alt="banner-pic"
          />
          
          <img
            className='rounded-full w-20 h-20 -mt-10 shadow-xl items-center justify-center'
            src={ user.image }
            alt="user-pic"
          />
          <h1 className='font-bol text-3xl text-center mt-3'>
              { user.userName }
          </h1>
          <Logout version={1} user={user}/>
          <div
            className='text-center mb-7'
          >
            <button
              type='button'
              onClick={(e) => {
              
                setText( e.target.textContent )
                setActiveBtn( 'created' );
              
              }}
              className={ `${ activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles }` }
            >
              Created
            </button>
            
            <button
              type='button'
              onClick={(e) => {
              
                setText( e.target.textContent )
                setActiveBtn( 'saved' );
              
              }}
              className={ `${ activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}` }
            >
              Saved
            </button>
            
            
          </div>
          
          {
            
            pins?.length ? (
             <>
              <div
              className='flex'
              >
                <MasonaryLayout pins={pins} />
              </div>
              
              </> 
            ) : ( 
              <div className='flex justify-center font-bold items-center text-xl mt-2'  >
                No Pins Found!
              </div>
            )
          }
          
            
          
        </div>
      </div>
    </div>
  )
}


export default UserProfile
