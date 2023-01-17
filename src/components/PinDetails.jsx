import React, { useState, useEffect } from 'react'
import { MdDownloadForOffline } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { client, urlFor } from '../client';
import MasonaryLayout from './MasonryLayout'
import { pinDetailMorePinQuery, pinDetailQuery, checkAdm, pinCommentQuery } from '../util/data'
import Spinner from './Spinner';
import { AiTwotoneDelete } from 'react-icons/ai'
import { BsHeart, BsHeartFill } from 'react-icons/bs';




const PinDetails = ({ user }) => {

  const [pins, setPins] = useState();
  const [pinDetails, setPinDetails] = useState();
  const [comment, setComment] = useState('');
  const [submissionAdd, setSubmissionAdd] = useState(false);
  const [deletingComment, setDeletingComment] = useState(false);
  const [addingComment, setaddingComment] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const { pinId } = useParams();
  




  const fetchPinDetails = () => {

    let query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(`${query}`)
        .then((data) => {

          setPinDetails(data[0]);

          if (data[0]) {
            const query1 = pinDetailMorePinQuery(data[0]);
            client.fetch(query1)
              .then((res) => {

                setPins(res);

              });
          }

        });
    }

  };

  const scrollToBottom = (id) => {
    if( document.getElementById( id ) != null ){
      const element = document.getElementById( id );
      element.scrollTop = element.scrollHeight
    }
    
  
  } 
  
  
  useEffect(() => {
    fetchPinDetails();
    
  }, [pinId]);




  const addComment = () => {
    
    if( !submissionAdd ){
      setSubmissionAdd( true );
      if (comment) {

        setaddingComment(true);
        client
          .patch(pinId)
          .setIfMissing({ comments: [] })
          .insert('after', 'comments[-1]', [{
            comment, //comment : comment shorthand typing
            _key: uuidv4(),
            postedBy: {
              _type: 'postedBy',
              _ref: user._id
            }
          }])
          .commit()
          .then(() => {
  
            fetchPinDetails();
            setComment('');
            setaddingComment(false);
            setSubmissionAdd( false );
  
          })
          .catch((e) => {
          
            console.log( e );
            setSubmissionAdd( false );
          
          });
          
          
      }
    }
    
    
  };

  const deleteComments = () => {
    
    
    
    client
      .patch(pinId)
      .set({ comments: [] })
      .commit()
      .then(() => {

        fetchPinDetails();
        setComment('');

      });

  }
  
  
  const deleteIndividaulComment = (index) => {
    
    
    if( !deletingComment ){
      setDeletingComment( true );
    
      client
        .patch( pinId )
        .unset([`comments[${index}]`])
        .commit()
        .then(() => {
        
          fetchPinDetails();
          setComment('');
          setDeletingComment(false);
          
        
        })
    }

  }

  
  const handleKeyPress = (event) => {
    if( event.keyCode === 13  ){ //13 == enter
      addComment();
    }
    
    if( event.keyCode ===  27){ //27 == esc
      setComment( '' );
    }
  
  }
  
  
  const alreadySaved = !!(pinDetails?.save?.filter((item) => {
  
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
          fetchPinDetails(pinId);
          setSavingPost(false);
          
        
        });
    }
  
  };
  


  if (!pinDetails) {
    return (
      <Spinner message="Loading pin details" />
    )
  }


  return (

    <>
      {
        pinDetails && (  
        <div className='flex xl:flex-row flex-col m-auto xl:w-full' style={{ maxWidth: '1500px', borderRadius: '325px' }}>
          <div className='flex justify-center items-center md:items-start flex-initial'>
            <img
              src={pinDetails?.image && urlFor(pinDetails.image).url()}
              className='rounded-t-3xl rounded-b-lh'
              style={{maxWidth: '700px'}}
              alt='user-post'
            />
          </div>
          <div className='w-full p-5 flex-1 xl:min-w-62'>

            <div className=''>
              <h1
                className='text-4xl font-mono font-bold bg-gray-200 p-3 break-words mt-3'
              >
                {pinDetails.title}
              </h1>
              <p
                className=' bg-gray-200 p-3 font-mono pb-20'
              >
                {pinDetails.about}
              </p>
              
              <div className='bg-gray-200 p-2 ' id='heartSection'>
              
              
              {alreadySaved ? (
                          
                          <button className='bg-rose-800 opacity-80 font-mono hover:opacity-100 text-amber-200 font-bold px-5 py-1 text-base rounded-md hover:shadow-md outline-none'>
                          <p className='opacity-100 flex justify-center items-center gap-1 outline-1'>
                            {
                            `${pinDetails?.save?.length}`
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
                          savePin(pinId);
                        
                        }}
                        
                        
                        >
                          <p className='opacity-100'>
                          
                          {savingPost ? '...' : <BsHeart />} 
                          </p>
                          
                        </button>
                        
                      )}  
              
              </div>
              
              
            </div>



            <div
              className='flex items-center p-2 bg-gradient-to-b from-rose-700 to-stone-900'
            >
              <Link
                to={`user-profile/${user?._id}`}
                className="flex-row gap-2 mt-0 justify-centeritems-center rounded-lg p-3 w-1/2 md:w-full"
              >
                <img
                  className='float-left w-8 h-8 rounded-full object-cover'
                  src={pinDetails.postedBy?.image}
                  alt="user"
                  referrerPolicy="no-referrer"
                />
                <p
                  className='float-left ml-3 text-bold capitalize text-amber-200'
                >
                  {pinDetails.postedBy?.userName}
                </p>
              </Link>
              <div
                className='flex-row '
              >
                <p
                  className='text-semibold capitalize text-gray-500'
                >
                  Posted Date: {pinDetails?._createdAt}
                </p>
              </div>
            

            </div>






            <div
              className='bg-gray-200 mt-20'
            >
              <h2 className='mt-5 text-2xl font-mono border-stone-900 border-b-2 '>
                Comments
              </h2>
              
              <div className='max-h-80 overflow-y-scroll bg-gray-200' id='commentOverflow'>
                {
                  pinDetails?.comments?.length > 0 ? (

///////////////// -> map
                    pinDetails?.comments?.map((item, index) => (
                      
                      <div className='flex gap-2 mt-5 items-center bg-white rounded-lg'
                        key={item.comment}
                      >
                        <img
                          src={item.postedBy.image}
                          alt="user-profile"
                          referrerPolicy='no-referrer'
                          className='w-10 h-10 rounded-full cursor-pointer flex ml-1 mb-10'
                        />
                        <div
                          className='flex flex-col items-start w-full break-all'
                        >
                          <p className='font-bold border-b-2  border-amber-200 border-dotted capitalize'>
                            {item.postedBy.userName}
                          </p>
                          <p className='font-mono text-sm p-2 '>
                            {item.comment}
                          </p>
                          
                          {
                            user?._id === item.postedBy._id && (
                              
                              
                              <div className='flex flex-row justify-end items-end w-full'>
                              
                                    _
                                <div className=''>
                                  
                                  <button
                                    className='bg-rose-700 text-black p-1 border-2 border-black hover:text-amber-200'
                                    type='button'
                                    onClick={(e) => {
                                    
                                      e.preventDefault(  );
                                      deleteIndividaulComment( index );
                                    }}
                                  >
                                  
                                  {
                                    deletingComment ? (
                                      
                                      <Spinner version={1}/>
                                      
                                    ) : (
                                      <AiTwotoneDelete />
                                    )
                                  
                                  }
                                  </button>
                                </div>
                              </div>
                            )
                          }
                          
                       
                          
                        </div>
                      </div>

                      )
                    )
                   
                    

                  ) : (

                    <div
                      className='bg-gray-200 justify-center items-center'
                    >
                      <p
                        className='text-black font-mono mt-10'
                      >
                        No comments yet...
                      </p>
                    </div>

                  )
                  
                }
                <>
                {
                    scrollToBottom( 'commentOverflow' )
                  
                }
                </>
                

              </div>
            </div>


            <div className='flex flex-wrap p-3 gap-3 items-center bg-gray-200'>
              <Link
                to={`user-profile/${user?._id}`}
              >
                <img
                  className='w-8 h-8 rounded-full object-cover'
                  src={user?.image}
                  alt="user-profile"
                />

              </Link>
              
              <input
                className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl bg-gradient-to-b from-rose-700 to-stone-900 text-amber-200 focus:border-gray-300'
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => {

                  setComment(e.target.value);

                }}
                onKeyDown = {(e) => {
                  handleKeyPress( e );
                  
                }}
                
              /> 

              <button
                type='button'
                className='bg-amber-200 text-black font-mono rounded-full px-6 font-semibold '
                onClick={
                  addComment
                }
              >
                {addingComment ? 'Posting...' : 'Post'}
              </button>

              {

                checkAdm()  ? (

                  <button
                    type='button'
                    className='bg-amber-200 text-black font-mono rounded-full px-6 font-semibold '
                    onClick={
                      deleteComments
                    }
                  >
                    Delete
                  </button>

                ) : ( 
                  <>
                  </>
                )
                
                }


              <br />
              <br />
              <br />
              <br />
              <br />
            </div>



            <div className='flex items-center justify-between bottom-0'>
              <div className='flex gap-2 items-start'>
                <a
                  href={`${pinDetails.image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => {

                    e.stopPropagation();

                  }}
                  className="bg-amber-200 w-12 h-12 flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-lg outline-none"
                >
                
                  <MdDownloadForOffline />
                  
                 
                </a>
              </div>
              <a
                href={pinDetails.destination}
                target="_blank"
                rel='noreferrer'
                className="bg-amber-200 w-full h-12 flex font-mono items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-lg outline-none"
              >
                {pinDetails.destination}
              </a>

            </div>


          </div>

        </div>
        
          )//end of pinDetails && (  )
        } 
        
        {
          pins ? (
            <>
              <h2
                className='text-center font-bold text-2x mt-20 mb-2'
              >
                More Posts like this
              </h2>
              <MasonaryLayout pins={pins} />
            </>

          ) : (
            <Spinner message='Loading more pins...' />
          )

        }
       
    </> //react fragment

  )
}





export default PinDetails;