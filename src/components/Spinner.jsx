import React from 'react'
import {Circles} from 'react-loader-spinner'

const Spinner = ({ message, version }) => {
  return (
  <>
    {
      version !== 1 ? (
        <div className='flex flex-col justify-center items-center w-full h-full'>
        <Circles 
            type="Circles"
            color={"#d4c687"}
            height={50}
            width={200}
            className="m-10"
        />
        <p className='text-lg text-center px-2 pt-5'>{message}</p>
      </div>
      ) : (
        
        <div className='flex flex-col justify-center items-center w-full h-full'>
        <Circles 
            type="Circles"
            color={"#d4c687"}
            height={16}
            width={16}
            className="m-10"
        />
        </div>
        
      )
    }
  </>
  )
}

export default Spinner
