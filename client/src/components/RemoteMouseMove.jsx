import React from 'react'
import { useSocketStore } from '../store/useSocketStore'
import { socket } from '../socket/socket'
import { FaMousePointer } from "react-icons/fa";

const RemoteMouseMove = () => {

    const { users } = useSocketStore()
    return (
        <>
            {users.map(({ id, name, pos, color }) => {
                if (id === socket.id) return null

                return <div
                    key={id}
                    className={`absolute pointer-events-none text-[${color}]`}
                    style={{ left: pos.x+20, top: pos.y+22, transform: 'translate(-50%, -50%)', color }}
                >
                    <FaMousePointer className={`text-xl`} />
                    <p className=''>{name}</p>
                </div>
            })}
        </>
    )
}

export default RemoteMouseMove