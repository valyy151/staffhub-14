'use client'
import type { StaffScheduleOutput } from '@/trpc/shared'
import Heading from '../ui/heading'
import { Calendar } from 'react-calendar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { calculateHours, formatDate, formatDay } from '@/app/lib/utils'
import { Shift } from '@/app/lib/types'
import { useEffect, useState } from 'react'
import { api } from '@/trpc/react'
import Spinner from '../ui/spinner'
import ShiftRow from './shift-row'
import Link from 'next/link'
import 'react-calendar/dist/Calendar.css'

// const PDFButton = dynamic(() => import('@/app/_components/PDFButton'), {
// 	ssr: false,
// })

export default function StaffSchedule({ employee }: { employee: StaffScheduleOutput }) {
	const [value, setValue] = useState(new Date())

	const [month, setMonth] = useState(value.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }))

	const [shifts, setShifts] = useState(employee?.shifts)

	const { refetch, isFetching } = api.shift.schedule.useQuery(
		{ id: employee?.id as string, month: value },
		{
			enabled: false,
		}
	)

	useEffect(() => {
		if (value.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) === month) {
			return
		}

		refetch().then(({ data }) => {
			if (data) {
				setShifts(data)
				setMonth(value.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }))
			}
		})
	}, [value])

	return (
		<section className='flex'>
			<div>
				<Heading
					size={'xs'}
					className='mb-4 ml-2'>
					{employee?.name}, {month} - {calculateHours(shifts as Shift[])}
				</Heading>
				<div className='border max-h-[49.3rem] overflow-y-scroll'>
					<Table className='min-w-[40vw]'>
						<TableHeader className='sticky top-0 bg-background shadow shadow-border dark:shadow-md dark:shadow-border'>
							<TableRow className='hover:bg-inherit'>
								<TableHead className='border-r'>Day</TableHead>
								<TableHead className='border-r'>Date</TableHead>
								<TableHead className='text-right'>Shift</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{shifts.map((shift) => (
								<TableRow
									key={shift.workDayId}
									className='hover:bg-inherit'>
									<TableCell
										className={`border-r ${(formatDay(shift.date, 'short') === 'Sat' && 'font-bold text-rose-500') || (formatDay(shift.date, 'short') === 'Sun' && 'font-bold text-rose-500')}`}>
										<Link
											href={`/days/${shift.workDayId}/shifts`}
											className={`py-3 pr-2 underline-offset-2 hover:underline`}>
											{formatDay(shift.date, 'short')}
										</Link>
									</TableCell>
									<TableCell
										className={`border-r font-medium  ${
											(formatDay(shift.date, 'short') === 'Sat' && 'font-bold text-rose-500') || (formatDay(shift.date, 'short') === 'Sun' && 'font-bold text-rose-500')
										}`}>
										<Link
											href={`/days/${shift.workDayId}/shifts`}
											className={`py-3 pr-2 underline-offset-2 hover:underline`}>
											{formatDate(shift.date, 'long')}
										</Link>
									</TableCell>

									<ShiftRow
										shift={shift}
										employee={employee}
									/>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>

			<div className='relative ml-8 mt-12'>
				<Calendar
					value={value}
					view={'month'}
					maxDetail='year'
					className='h-fit'
					next2Label={null}
					prev2Label={null}
					activeStartDate={value}
					onChange={(value) => setValue(value as Date)}
				/>

				{/* <PDFButton
					employee={employee}
					value={value}
					month={month}
				/> */}

				{isFetching && (
					<div className='mt-4'>
						<Spinner noMargin />
					</div>
				)}
			</div>
		</section>
	)
}
