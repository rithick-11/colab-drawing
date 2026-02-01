import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Container } from '../components'
import { getChannelId } from '../utils/generateChannelId.js'



const Home = () => {

    const [homeState, setHomeState] = useState('home')

    return (
        <Container className="flex justify-center items-center text-center">
            <div className='bg-white h-96 w-96 py-10 px-5 rounded-md shadow-white text-black'>
                <h1 className='text-xl font-medium mb-4'>colab drawing platform</h1>
                <div className='h-full flex justify-center items-center'>
                    <RenderHomeState homeState={homeState} setHomeState={setHomeState} />
                </div>
            </div>
        </Container>
    )
}

const RenderHomeState = ({ homeState, setHomeState }) => {

    const channelId = getChannelId()

    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const mode = searchParams.get('mode')
    const invitedChannelId = searchParams.get('channelID')

    const onInviteUser = () => {
        if (name.length < 0) return
        navigate(`/canva/${invitedChannelId}?username=${name}`)
        setName("")
    }

    const [name, setName] = useState('')
    const [newchannelId, setChannelId] = useState('')

    const onJoinUser = () => {
        if (name.length < 0) return
        navigate(`/canva/${channelId}?username=${name}`)
        setName("")
    }

    const onExitingchannel = () => {
        if (newchannelId.length < 5 || name.length < 0) return
        navigate(`/canva/${newchannelId}?username=${name}`)
    }

    if (mode == 'invite') {
        return <div>
            <h1 className='text-[1rem] font-normal'>Channel Id - {invitedChannelId}</h1>
            <div className='mt-4'>
                <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='input border px-2 py-1 rounded-md w-full mb-2' required placeholder='Enter your name' />
                <button onClick={onInviteUser} className='btn bg-green-500 w-full'>Start Drawing</button>
            </div>
        </div>
    }

    switch (homeState) {

        case 'home':
            return <div className='flex gap-2'>
                <button className='btn bg-orange-400' onClick={() => setHomeState('create room')}>Create Room</button>
                <button className='btn bg-blue-500' onClick={() => setHomeState('join room')}>Join Room</button>
            </div>

        case 'create room':

            return <div>
                <h1 className='text-[1rem] font-normal'>Channel Id - {channelId}</h1>
                <div>
                    <input onChange={(e) => setName(e.target.value)} type="text" className='input border px-2 py-1 rounded-md w-full mt-4 mb-2' placeholder='Enter your name' />
                    <button className='btn bg-green-500 w-full' onClick={onJoinUser}>Start Drawing</button>
                </div>
            </div>
        case 'join room':
            return <div>
                <input onChange={(e) => setChannelId(e.target.value)} value={newchannelId} type="text" className='input border px-2 py-1 rounded-md w-full mb-2' required placeholder='Enter channel id or newChannel id' />
                <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='input border px-2 py-1 rounded-md w-full mb-2' required placeholder='Enter your name' />
                <button onClick={onExitingchannel} className='btn bg-green-500 w-full'>Start Drawing</button>
            </div>

        default:
            return <></>
    }
}

export default Home