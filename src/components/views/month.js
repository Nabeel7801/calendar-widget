import { addMinutes, format, startOfMonth,endOfMonth, addDays, getDaysInMonth } from 'date-fns'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import * as _ from 'lodash'

function MonthView() {
    
    const { selectedDate } = useSelector((state) => state.app)
    const { list } = useSelector((state) => state.events)

    const firstDayOfMonth = useMemo(() => startOfMonth(new Date(selectedDate)), [selectedDate])
    const monthDays = useMemo(() => getDaysInMonth(new Date(selectedDate)), [selectedDate])

    const groupedList = useMemo(() => {
        const targetDate = format(new Date(selectedDate), 'dd/MM/yyyy')
        const filteredByDate = list.filter(o => format(new Date(o.startDate), 'dd/MM/yyyy') === targetDate)

        const [dd, mm, yyyy] = targetDate.split('/');
        const date = new Date(yyyy, String(parseInt(mm)-1), dd, 0, 0);

        return _.range(48).reduce((result, x) => {
            const tempDate = addMinutes(date, x*30);

            return [...result, {
                id: format(tempDate, 'p'),
                events: list.filter(o => new Date(o.startDate).getTime() >= tempDate.getTime() && new Date(o.startDate).getTime() <= addMinutes(tempDate, 30).getTime())
            }]
        }, [])
    }, [list, selectedDate])

    return (
        <div className='mx-2'>
            <div className='grid grid-cols-7'>
                {["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"].map(day => 
                    <div className='border text-base p-4 text-center font-medium'>
                        {day}
                    </div>
                )}
            </div>


            <div className='grid grid-cols-7'>
                {_.range(firstDayOfMonth.getDay()).map(o => <div className='col-span-1 border h-[122px]'></div>)}
                {_.range(monthDays).map((o, i) => 
                    <div className={`${format(addDays(firstDayOfMonth, o), 'dd/MM/yyyy') === format(new Date(selectedDate), 'dd/MM/yyyy') && 'bg-gray-200'} border h-[122px] text-right p-1`}>
                        {i+1}
                    </div>
                )}
            </div>
            {/* {groupedList.map((o, i) => (
                
            ))} */}

        </div>
    )
}

export default MonthView