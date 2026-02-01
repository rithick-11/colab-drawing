import React from 'react'
import { useSocketStore } from '../store/useSocketStore'
import { MdGroups, MdLink } from "react-icons/md";
import { CiLink } from "react-icons/ci";

const UserCard = ({ className }) => {

    const { users, channelId } = useSocketStore()

    const onCLickInvite = () => {
        try {
            navigator.clipboard.writeText(window.location.host + `?mode=invite&channelID=${channelId}`)
        } catch (err) {
            console.error('Failed to copy: ', err);
        }

    }

    return (
        <div className={`${className} p-3 text-black`}>
            {

                users?.length > 0 ? (
                    <div className='space-y-2'>
                        <div className='flex justify-between'>
                            <div className='flex items-center gap-2 text-blue-500'>
                                <MdGroups className='text-2xl' />
                                <p>{users?.length} Online </p>
                            </div>
                            <button onClick={onCLickInvite} className='cursor-pointer text-[1rem] flex gap-1 items-center bg-blue-500 text-white px-2 rounded-sm font-semibold '><CiLink className='text-2xl' /> Invite</button>
                        </div>
                        <ul className='flex flex-wrap gap-2'>
                            {users?.map(user => <li className={`${"h-10 w-10 text-lg font-semibold text-white rounded-full text-center flex items-center justify-center"}`} style={{ backgroundColor: user.color }}><p className=''>{user?.name?.charAt(0)}</p></li>)}
                        </ul>
                    </div>

                ) : <p className='text-sm'>No one is online</p>
            }
        </div>
    )
}

export default UserCard