import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components'
import { getChannelId } from '../utils/generateChannelId.js'



const Home = () => {

    const channelId =  getChannelId()

    return (
        <Container className="flex justify-center items-center text-center">
            <div className='bg-white py-10 px-5 rounded-md shadow-white text-black'>
                <h1 className='text-xl font-medium'>colab drawing platform</h1>
                <div className='space-x-3 my-5'>
                    <Link to={`/canva/${channelId}`} className='btn bg-blue-400'>Create new room</Link>
                    <button type='button' className='btn bg-green-400'>join room</button>
                </div>
            </div>
        </Container>
    )
}

export default Home