import React from 'react'
import { useSocketStore } from '../store/useSocketStore'
import { FaRing } from 'react-icons/fa'

const UserCard = ({ className }) => {

    const { users } = useSocketStore()

    return (
        <div className={`${className} p-3 text-black`}>
            {

                users?.length > 0 ? (
                    <div>
                        <p ><FaRing /> online {users?.length}</p>
                    </div>
                ) : <p className='text-sm'>No one is online</p>
            }
        </div>
    )
}

export default UserCard