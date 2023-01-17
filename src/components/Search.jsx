import React, { useEffect, useState } from 'react'
import MasonaryLayout from './MasonryLayout'
import { client } from '../client'
import { feedQuery, searchQuery } from '../util/data'
import Spinner from './Spinner'


const Search = ({ searchTerm }) => {
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);

  const search = () => {
  
    if( searchTerm !== '' ){
      setLoading( true );
      const searchQ = searchQuery( searchTerm.toLowerCase() );
      
      client.fetch( searchQ )
        .then( (data) => {
          setPins( data )
          setLoading( false );
          
        } );
        
    
    }else{
    
      
      client.fetch( feedQuery )
        .then( (data) => {
        
          setPins( data )
          setLoading( false );
          
        } );
      
    }
  
  }

  useEffect(() => {
  
   search();
   
  }, [searchTerm]);

  return (
    <div >
      
      
      { 
        loading && (
          <Spinner message={ `Searching for ${ searchTerm } ...` } />
        )
      }
      
      {
        pins?.length !== 0 && (
          <MasonaryLayout pins={ pins } />
        )
      }
      
      {
        pins?.length !== 0 && searchTerm !== '' && !loading &&(
          <div
            className='mt-10 text-center text-xl'
          >
            0 results found with the following { searchTerm }
          </div>
        )
      }
      
      
    </div>
  )
}

export default Search