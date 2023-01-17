import React, {useState} from 'react'
import { urlFor, client } from '../client'
import { Link, useNavigate } from 'react-router-dom'
import {v4 as uuidv4}   from 'uuid' 
import { AiTwotoneDelete } from 'react-icons/ai'
import { BsFillArrowRightCircleFill } from 'react-icons/bs'
import {MdDownloadForOffline} from 'react-icons/md'
import { fetchUser } from './../util/fetchUsers';
import { BsHeart, BsHeartFill } from 'react-icons/bs'


const Pin = ({ pin: {postedBy, image, _id, destination, save}}) => {
  const navigate = useNavigate();
  const [postHovered, setPostHoverd] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const user = fetchUser();
  
  //!! makes the return statement a boolean value
  // if 1 is returned !1  -> false -> !false -> true
  // if 0 is returned !0  -> true -> !true -> false
  
  const alreadySaved = !!(save?.filter((item) => {
  
    return item?.postedBy?._id === user.sub 
    
  }))?.length;
  // .filter looks through an array and filters by the condition posted within it and returns an aray of matched elements
  
  // we look for 1 from the pin post and try to so all the users that liked it
  //1 , [2,3,1,5] ->[1].length = 1 (true)
  //4 , [2,3,1,5] -> [].length = 0 (false)
  
  const  savePin = (id) => {
  
    if(!alreadySaved){
      setSavingPost(true);
      
      client
        .patch(id)
        .setIfMissing({ save: []})
        .insert('after', 'save[-1]', [{
          _key : uuidv4(),
          userId : user.sub,
          postedBy : {
            _type: 'postedBy',
            _ref : user.sub,
          }
        }])
        .commit()
        .then(() => {
        
          window.location.reload();
          setSavingPost(false);
        
        });
    }
  
  };
  
  
  
  const deletePin = (id) => {
  
    client
      .delete(id)
      .then(() => {
        window.location.reload();
      })      
      
      
  
  }
  
  
  
  
  return (
    <div className='m-2'>
    
        <div
            onMouseEnter={() => {
              setPostHoverd(true)
            }}
            onMouseLeave={() => {
              setPostHoverd(false)
            }}
            
            onClick={() =>  {  
                navigate(`/pin-details/${_id}`);
                document.getElementById( 'overflowDiv' ).scrollTo( 0,20 );
              }  
            }
            
            className = "relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
         
        >
        
          <img className='rounded-lg w-full' alt="user-post" src={urlFor(image).width(250).url()}/> 
                      
          {
            postHovered && (
              <div className="absolute top-0 w-full flex flex-col justify-between p-1 pr-2 pb-2 z-50"
              style={{height : '100%'}}
              >
                <div className='flex items-center  justify-between'>
                  <div className='flex gap-2'>
                    {
                    
                      image?.asset?.url ? (
                        <a 
                        href={`${image?.asset?.url}?dl=`}
                        download
                        onClick={(e) => {
                        
                          e.stopPropagation();
                        
                        }}
                        className="bg-amber-200 w-9 h-9 flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-lg outline-none"
                      >
                        <MdDownloadForOffline />
                      </a>
                      
                      ):( 
                        <button
                        className="bg-gray-200 w-9 h-9 flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-lg outline-none"
                        onClick={(e) => {
                        
                          e.stopPropagation();
                        
                        }}
                        >
                          <MdDownloadForOffline />
                        </button>
                      )
                      
                      
                    }
                      
                      
                  </div>
                      
                      
                      {alreadySaved ? (
                          
                          <button className='bg-rose-800 opacity-80 font-mono hover:opacity-100 text-amber-200 font-bold px-5 py-1 text-base rounded-md hover:shadow-md outline-none'>
                          <p className='opacity-100 flex justify-center items-center gap-1 outline-1'>
                            {
                            `${save?.length}`
                            }
                            <BsHeartFill className='w-half h-half'/>
                          </p>
                          </button>
                          
                      ):(
                        
                        <button 
                        type='button'
                        className='bg-rose-800 opacity-80 font-mono hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-md hover:shadow-md outline-none'
                        onClick={(e) => {
                        
                          e.stopPropagation();
                          savePin(_id);
                        
                        }}
                        
                        
                        >
                          <p className='opacity-100'>
                          
                          {savingPost ? '...' : <BsHeart />} 
                          </p>
                          
                        </button>
                        
                      )}  
                      
                      
                </div>
                <div className='flex justify-between items-center gap-2 w-full'>
                  
                        {
                          destination ? (
                            <a 
                              href={destination}
                              target='_blank'
                              rel='noreferrrer'
                              className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:100 hover:shadow-md'
                            >
                              <BsFillArrowRightCircleFill />
                              {
                                destination.length > 20 ?
                                destination.slice(8,20) :
                                destination.slice(8)
                                
                              }
                                
                              
                            </a>
                          
                          
                          ) : ( 
                          
                          
                            <div className='opacity-0'>
                            <BsFillArrowRightCircleFill />
                            </div>
                          
                          )
                        }
                        
                        {
                          postedBy?._id === user.sub && (
                              <button
                                type='button'
                                className='bg-rose-800 opacity-80 font-mono hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-md hover:shadow-md outline-none'
                                onClick={(e) => {
                                
                                  e.stopPropagation();
                                  deletePin(_id)
                                
                                }}
                              >
                                
                                <AiTwotoneDelete />
                                
                              </button>
                          )
                        }
                  
                </div>
            </div>
                
            )
          }
               
            
        </div>
        <Link to={`user-profile/${user?._id}`} className="flex gap-2 mt-2 items-center" >
                        
                        <img className='w-8 h-8 rounded-full object-cover'
                          src={postedBy?.image}
                          alt='user-profile'
                          referrerPolicy="no-referrer"
                        />
                        <p className='font-semibold capitalize'>{postedBy?.userName} </p>
          </Link> 
    
    </div>
    
    
  )
}

export default Pin
