import { api } from '@/trpc/server'
import Note from '@/app/_components/ui/note'
import { formatDate, formatDay } from '@/app/lib/utils'
import CreateNote from '@/app/_components/ui/create-note'

export default async function WorkDayNotes({ params }: { params: { id: string } }) {
	const workDay = await api.workDay.getNotes.query({ id: params.id })
	return (
		<main className='px-4'>
			<h1 className='pb-1 text-xl font-semibold'>
				{formatDay(workDay.date, 'long')}, {formatDate(workDay.date, 'long')}
			</h1>
			<div className='mb-4 flex items-end justify-between'>
				{workDay.notes.length > 0 ? <h2 className='text-lg font-medium'>Notes</h2> : <h2 className='text-lg font-medium'>No Notes</h2>}
				<CreateNote
					type='workDay'
					id={workDay.id}
				/>
			</div>

			{workDay.notes.map((note) => (
				<Note
					note={note}
					type='workDay'
					key={note.id}
				/>
			))}
		</main>
	)
}
