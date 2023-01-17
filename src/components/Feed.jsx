import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import{client} from '../client'
import {MasonaryLayout, Spinner} from '../components';
import { searchQuery } from '../util/data';
import { feedQuery } from './../util/data';

const Feed = () => {
  const [pins, setPins] = useState();
  const [loading, setLoading] = useState(false);
  const {categoryId} = useParams();
  
  useEffect(() =>{
    
    if(categoryId){
      setLoading(true);
      const query = searchQuery(categoryId);
      
      client.fetch(query)
        .then((data) => {
          setPins(data);
          setLoading(false);
          
        });
      
    }else{
    
      setLoading(true);
      client.fetch(feedQuery)
        .then((data) => {
          
          setPins(data);
          setLoading(false);
        });
      
    }
    
    
  }, [categoryId]);
  
  
  if(loading) return <Spinner message="we are adding new ideas to your feed" />
  
  
  if( pins?.length === 0 ) { 
    return( 
      <div className='items-center bg-gray-200 rounded-t-lg p-5 font-mono'>
        <h2>There are no posts under this category!</h2> 
        <p className='mt-2'>Post something with the category <b>{ categoryId }</b> to display it here!</p>
      </div>  
    )
  } 
  
  
  return (
    <div>
      {
      
      pins && (
      <MasonaryLayout pins={pins} /> 
        
      )}
      
    </div>
  )
}

export default Feed


