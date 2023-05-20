import { addMinutes, format, getMilliseconds } from 'date-fns'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import * as _ from 'lodash'

function AgendaView() {
    
    const { selectedDate } = useSelector((state) => state.app)
    const { list } = useSelector((state) => state.events)

    const groupedList = useMemo(() => {
        const targetDate = format(new Date(selectedDate), 'dd/MM/yyyy')
        return list.filter(o => format(new Date(o.startDate), 'dd/MM/yyyy') === targetDate)
    }, [list, selectedDate])

    console.log(groupedList)
    return (
        <>
            <div className='w-full justify-between flex px-[64px] py-[12px] bg-[#F6F4F4]'>
                <p className='text-sm font-medium'>
                    {format(new Date(selectedDate), 'EEEE')}
                </p>

                <p className='text-sm font-medium'>
                    {format(new Date(selectedDate), 'MMM dd, yyyy')}
                </p>
            </div>

            {groupedList?.length ?
                groupedList?.map(o => 
                    <div className='text-sm flex items-center gap-x-8 px-16 py-4 border-b'>
                        <p>{format(new Date(o.startDate), 'p')} - {format(new Date(o.endDate), 'p')}</p>

                        <p style={{ backgroundColor: o.color }} className='w-4 h-4 rounded-full'></p>
                        <p>{o.title} - {o.description}</p>
                    </div>
                )
            :
                <p className='text-sm px-16 py-4 border-b'>No Event planned for this date</p>
            }

        </>
    )
}

export default AgendaView