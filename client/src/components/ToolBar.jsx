import React from 'react'
import { FaEraser } from 'react-icons/fa';
import { IoMdBrush, IoMdHelpCircleOutline, IoMdRedo, IoMdUndo } from "react-icons/io";
import { TbLine } from "react-icons/tb";
import { useSocketStore } from '../store/useSocketStore';

const ToolBar = ({ className }) => {

  const { setBruseSize, bruseSize, brushColor, setBrushColor, tool, setTool, handleUndo } = useSocketStore()

  const tootBarBtnClassName = "p-2 border rounded-lg hover:bg-gray-100 cursor-pointer"

  const toolBarActions = [
    {
      icon: <IoMdUndo />,
      action: 'undo',
      onClick: handleUndo
    },
    { icon: <IoMdRedo />, action: 'redo', onClick: () => { } },
  ]

  const toolBarItems = [
    { icon: <IoMdBrush />, tool: 'brush' },
    { icon: <TbLine />, tool: 'line' },
    { icon: <FaEraser />, tool: 'eraser' },
  ]

  const brushColors = ['black', 'red', 'green', 'blue', 'yellow', 'purple', 'orange', 'white']

  return (
    <div className={`${className} text-black px-3 py-3`}>
      <h1 className='text-sm font-normal'>Tool bar</h1>
      <div className='flex'>
        <div className='mt-3 space-x-2 space-y-2'>
          {/* tool bar actions */}
          {toolBarActions.map((item, index) => (
            <button key={index} onClick={item.onClick} className={tootBarBtnClassName + " " + 'border-gray-300'}>{item.icon}</button>
          ))}

          {/* //tool bar toolitems */}
          {toolBarItems.map((item, index) => (
            <button key={index} onClick={() => setTool(item.tool)} className={`${tootBarBtnClassName} ${tool == item.tool ? 'border-blue-500' : 'border-gray-300 '}`}>{item.icon}</button>
          ))}

          {/* //brush size */}
          <div className={`${tootBarBtnClassName} border-gray-300 inline-flex items-center space-x-2 px-3`}>
            <input type="range" value={bruseSize / 2} onChange={(e) => { setBruseSize(e.target.value * 2) }} />
            <p className='text-xs'>{bruseSize} px</p>
          </div>

          {/* //brush colors */}
          <div className='inline space-x-2'>
            {brushColors.map((color, index) => <button key={index} onClick={() => setBrushColor(color)} type='button' className={`h-6 w-6 border-2 ${color === brushColor ? ' border-blue-500' : 'border-gray-300 '} rounded-md cursor-pointer`} style={{ backgroundColor: color }}></button>)}
          </div>
        </div>
      </div>
    </div>

  )
}

export default ToolBar