'use client'
import { HeartPulseIcon } from 'lucide-react'
import { Button } from '../ui/button'
import type { StaffAbsenceOutput } from '@/trpc/shared'
import { useState } from 'react'
import { addDays, differenceInDays } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import { DatePickerWithRange } from '../ui/date-range-picker'
import { api } from '@/trpc/react'
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'

export default function NewAbsence({ employee, type }: { employee: StaffAbsenceOutput; type: 'vacation' | 'sick' }) {
	const [showCreate, setShowCreate] = useState(false)

	const [date, setDate] = useState<DateRange | undefined>({
		from: new Date(),
		to: addDays(new Date(), 5),
	})

	const { toast } = useToast()

	const router = useRouter()

	const mutation = type === 'vacation' ? api.vacation.create : api.sickLeave.create

	const toastText = type === 'vacation' ? 'Vacation' : 'Sick Leave'

	const createAbsence = mutation.useMutation({
		onSuccess: () => {
			toast({
				title: `${toastText} created`,
			})
			setShowCreate(false)
			router.refresh()
		},

		onError: () => {
			toast({
				title: `Error creating ${toastText}`,
				variant: 'destructive',
			})
		},
	})

	return (
		<>
			<Button
				onClick={() => setShowCreate(true)}
				className='ml-16'>
				<HeartPulseIcon
					size={20}
					className='mr-2'
				/>
				New {type === 'vacation' ? 'Vacation' : 'Sick Leave'}
			</Button>

			{showCreate && (
				<AlertDialog open>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>New {type === 'vacation' ? 'Vacation' : 'Sick Leave'} </AlertDialogTitle>
							<AlertDialogDescription>
								Days planned: <span>{differenceInDays(date?.to!, date?.from!) + 1 > 0 ? differenceInDays(date?.to!, date?.from!) + 1 : 0}</span>
							</AlertDialogDescription>
						</AlertDialogHeader>
						<DatePickerWithRange
							date={date}
							setDate={setDate}
						/>

						<AlertDialogFooter>
							<AlertDialogCancel onClick={() => setShowCreate(false)}>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => {
									createAbsence.mutate({
										employeeId: employee?.id as string,
										end: date?.to?.getTime() as number,
										start: date?.from?.getTime() as number,
									})
								}}
								disabled={createAbsence.isLoading}
								aria-disabled={createAbsence.isLoading}>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</>
	)
}
