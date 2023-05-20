import { Fragment, useEffect, useRef, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const SimpleDropdown = ({
    value,
    onChange,
    options,
    disabled,
    className = "",
}) => {

    const [selected, setSelected] = useState(value)
    const ref = useRef(null);

    useEffect(() => { setSelected(value) }, [value?.name])

    const handleOnChange = (e) => {
        setSelected(e)
        onChange(e)
    }

    return (
        <Listbox disabled={disabled} value={selected} onChange={handleOnChange}>
            {({ open }) => (
                <>
                    <div className={`${className} relative`}>
                        <Listbox.Button ref={ref} className={`flex items-center gap-x-2 p-2 text-sm font-medium text-gray-900 cursor-pointer rounded-md border border-gray-300 bg-white min-h-[34px] shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100`}>
                            {selected?.icon} 
                            {selected?.text}
                            <ChevronDownIcon className={`h-4 w-4 text-gray-600`} aria-hidden="true" />
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className={`text-[14px] absolute left-0 z-10 mt-1 max-h-60 min-w-[200px] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`}>
                                {options?.map((option) => (
                                    <Listbox.Option
                                        key={option.id}
                                        className={`flex items-center gap-x-4 text-sm font-normal ${selected?.id === option?.id ? 'text-white bg-blue-400' : 'text-gray-900 hover:bg-gray-100'} px-4 py-2  relative cursor-pointer select-none`}
                                        value={option}
                                    >
                                        {option?.icon}{option.text}

                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    )
}
export default SimpleDropdown