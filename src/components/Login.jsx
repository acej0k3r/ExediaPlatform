import React from 'react';
import { useNavigate } from 'react-router-dom';
import shareVideo from '../assets/cloud.mp4'
import logo from '../assets/AJC_logo.png'
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import AudioComp from './AudioComp'
import { client } from '../client'







const Login = () => {
  const user = false;
  const navigate = useNavigate();  
  
  const responseGoogle = (response) => {
  
    const decode = jwt_decode(response.credential);
    localStorage.setItem('user', JSON.stringify(decode));
    
    const { name, picture, sub } = decode;

    const doc = {
        _id: sub, 
        _type: 'user',
        userName: name,
        image: picture,
    }
    
    sessionStorage.setItem( 'sub', sub );
    
    console.log('Message decoded >>> user: '+ name + ' id : ' + sub)
    
    client.createIfNotExists(doc)
      .then(()=>{
        
        navigate('/', {replace: true})
      })
    
    
  }
  

  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        
        <AudioComp />
        
        <video 
          src={shareVideo}
          type = "video/mp4"
          loop controls={false}
          muted
          autoPlay
          className='w-full h-full object-cover'
        />
        
        <div className='absolute flex flex-col justify-center items-center top-0 bottom-0 right-0 left-0'>
          <div className='bg-blackOverlay opacity-20'>
          </div>
          
          <div className='p-5 pointer-events-none user-select-none'>
            <img src={logo} 
            width="130px" alt="logo" 
            unselectable='on' className='pointer-events-none user-select-none'
            />
          </div>  
          
          <div className='shadow-2xl'>
                      
            <div>
              {
              
                user ? (
                
                  <div> Logged in </div>
                  
                  ) : (
                
                  <GoogleLogin
                    onSuccess={responseGoogle} 
                    onError={()=> console.log('ERROR /ft')}
                    referrerPolicy="no-referrer"
                  />)
              
              }
            </div>          
              
          
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Login