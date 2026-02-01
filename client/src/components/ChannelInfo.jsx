import React from 'react'
import { useSocketStore } from '../store/useSocketStore'

const ChannelInfo = ({ className }) => {

    const { channelId, user } = useSocketStore()

    return (
        <div className={`${className} text-black p-3`}>
            <div className='flex items-center gap-2'>
                <h1 className='text-lg'>Col lab Drawing</h1><span className='text-gray-500'>{channelId}</span>
            </div>
            <div className='flex items-center gap-2 mt-3'>
                <div className='h-12 w-12 rounded-full flex justify-center items-center text-2xl font-semibold text-white' style={{ backgroundColor: user?.color }}>{user?.name[0]}
                </div>
                <p className='text-[1rem]'>{user?.name}</p>
            </div>
        </div>
    )
}

export default ChannelInfo