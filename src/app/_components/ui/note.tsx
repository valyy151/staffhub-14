'use client'
import { useState } from 'react'
import { Button } from './button'
import { Trash2 } from 'lucide-react'
import { useToast } from './use-toast'
import { api } from '@/trpc/react'
import FormModal from './form-modal'
import { useRouter } from 'next/navigation'
import { Card, CardDescription } from './card'

type NoteProps = {
	employeeId: string
	note: { id: string; content: string; createdAt: Date }
}

export default function Note({ note, employeeId }: NoteProps) {
	const [showModal, setShowModal] = useState(false)

	const { toast } = useToast()

	const router = useRouter()

	const deleteNoteMutation = api.staffNote.delete.useMutation({
		onSuccess: () => {
			router.refresh()
			setShowModal(false)
			toast({ title: 'Note deleted successfully.' })
		},

		onError: () => {
			toast({
				title: 'There was a problem deleting the note.',
				variant: 'destructive',
			})
		},
	})

	return (
		<Card className='mb-2'>
			<CardDescription className='flex w-full min-w-[28rem] flex-col rounded-md border py-1 shadow bg-card'>
				<span className='px-2 text-justify font-medium'>{note.content}</span>

				<span className='border-b px-2 pb-2 text-xs font-light'>
					Added{' '}
					{note.createdAt.toLocaleString('en-GB', {
						day: 'numeric',
						month: 'short',
						year: 'numeric',
						hour: 'numeric',
						minute: 'numeric',
					})}
				</span>

				<Button
					onClick={() => setShowModal(true)}
					size={'sm'}
					variant={'link'}
					title='Delete note'
					className='w-fit px-2 py-5 font-semibold text-red-600 focus:ring-0 focus:ring-offset-0 dark:text-red-500'>
					{
						<Trash2
							size={18}
							className='mr-2 text-red-500'
						/>
					}{' '}
					Remove
				</Button>
			</CardDescription>
			{showModal && (
				<FormModal
					showModal={showModal}
					heading={'Delete note?'}
					cancel={() => setShowModal(false)}
					pending={deleteNoteMutation.isLoading}
					text={'Are you sure you want to delete this note?'}
					submit={() => deleteNoteMutation.mutate({ employeeId, id: note.id })}
				/>
			)}
		</Card>
	)
}
