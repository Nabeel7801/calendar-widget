import React, { useRef, useEffect, useState } from 'react';
import { format, addDays } from 'date-fns'
import { JsonCalendar } from 'json-calendar';
import TailwindDatepicker from 'flowbite-datepicker/Datepicker';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import useClickAwayListener from 'hooks/useClickAwayListener'

import { setSelectedDate } from 'redux/reducers/app';
import { useDispatch, useSelector } from 'react-redux';

const DatePicker = () => {

    const dispatch = useDispatch();

    const { selectedDate } = useSelector((state) => state.app);

    const [calendar, setCalendar] = useState(new JsonCalendar({ today: new Date(), languageCode: "en", firstDayOfWeek: 1 }));
    const [currentCalendarDate, setCurrentCalendarDate] = useState(selectedDate)

    const pickerRef = useRef()

    useEffect(() => {
        if (!pickerRef?.current) return;
        new TailwindDatepicker(pickerRef.current, {
            format: 'dd/mm/yyyy',
            language: 'en'
        }) 
    }, [])

    const handleOnClick = (x) => {
        const date = addDays(new Date(selectedDate), x)
        dispatch(
            setSelectedDate(date)
        )
    }

    const updateSelectedDate = (e) => {
        if (!e.target.value) return;
        const [dd, mm, yyyy] = e.target.value?.split('/')
        const date = new Date(yyyy, String(parseInt(mm)-1), dd);
        dispatch(
            setSelectedDate(date)
        )
    }

    return (
        <div className='flex items-center gap-x-2'>
            <div onClick={() => handleOnClick(-1)} className='rounded-full p-2 hover:bg-gray-100 cursor-pointer'>
                <ChevronLeftIcon className='w-5 h-5 text-gray-900' />
            </div>
            
            <div className='relative'>
                <input
                    datepicker="true"
                    datepicker-autohide="true"
                    readOnly
                    ref={pickerRef}
                    type="text"
                    value={format(new Date(selectedDate), 'dd/MM/yyyy')}
                    className="text-sm border-none focus:border-none outline-none focus:outline-none text-center font-medium text-gray-900 cursor-pointer"
                    placeholder="Select date"
                    onSelect={updateSelectedDate}
                    id="datepickerId"
                />
            </div>
            
            <div onClick={() => handleOnClick(1)} className='rounded-full p-2 hover:bg-gray-100 cursor-pointer'>
                <ChevronRightIcon className='w-5 h-5 text-gray-900' />
            </div>
        </div>
    )
}

export default DatePicker