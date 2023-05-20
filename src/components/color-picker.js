import React, { useState } from 'react'
import { BlockPicker } from 'react-color'
import useClickAwayListener from 'hooks/useClickAwayListener'

function ColorPicker({ list, color, onChange, defaultColor="#1C64F2" }) {

    const [colorPickerOpen, setColorPickerOpen] = useState(false);

    const colorPickerRef = useClickAwayListener(() => {
        if (!colorPickerOpen) return;
        setColorPickerOpen(null)
    })

    return (
        <div ref={colorPickerRef} className="relative color-picker">
            <div className="cursor-pointer flex items-center w-[120px] rounded-md border px-[12px] py-[8px]" onClick={() => setColorPickerOpen(true)} >
                <div title={(color || defaultColor).toUpperCase()} style={{ backgroundColor: color || defaultColor }} className={`w-[24px] h-[24px] rounded-[8px]`} />
                <span className="ml-2 text-sm text-gray-900 font-normal">{color || defaultColor}</span>
            </div>

            {colorPickerOpen &&
                <div className='absolute left-[130px] bottom-0 shadow-lg z-[2]'>
                    <BlockPicker 
                        triangle="hide"
                        color={color || defaultColor}
                        onChangeComplete={onChange}
                        colors={list}
                    />
                </div>
            }
        </div>
    )
}

export default ColorPicker