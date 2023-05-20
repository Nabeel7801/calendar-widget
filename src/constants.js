import { QueueListIcon, Squares2X2Icon, ViewColumnsIcon } from '@heroicons/react/20/solid'
import { MonthView, WeekView, DayView, AgendaView } from 'components/views'

export const TodayDate = new Date()

export const CalendarModes = [
    {
        id: 'DAY',
        text: 'Day',
        view: <DayView />,
        icon: <QueueListIcon className='w-4 h-4' />
    },
    {
        id: 'WEEK',
        text: 'Week',
        view: <WeekView />,
        icon: <ViewColumnsIcon className='w-4 h-4' />
    },
    {
        id: 'MONTH',
        text: 'Month',
        view: <MonthView />,
        icon: <Squares2X2Icon className='w-4 h-4' />
    },
    {
        id: 'AGENDA',
        text: 'Agenda',
        view: <AgendaView />,
        icon: <QueueListIcon className='w-4 h-4' />
    },
]