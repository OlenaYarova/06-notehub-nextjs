'use client';
import css from '@/app/notes/NotesPage.module.css';
import SearchBox from '@/components/SearchBox/SearchBox'
import NoteList from "@/components/NoteList/NoteList"
import Pagination from '@/components/Pagination/Pagination'
import React, { useEffect, useState } from 'react'
import { fetchNotes } from '@/lib/api'
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import toast, { Toaster } from 'react-hot-toast'
import {useDebouncedCallback} from 'use-debounce'
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

type NotesClientsProps={
    page: number;
    query: string;
  
}

export default function NotesClient({page, query}: NotesClientsProps) {
	const [currentPage, setCurrentPage] = useState(page);
	const [currentQuery, setCurrentQuery] = useState(query);
	const [isModalOpen, setIsModalOpen] = useState(false);
	
function openModal(): void{
	setIsModalOpen(true);
}
	function closeModal(): void{
		setIsModalOpen(false);
}

	const { data, isSuccess } = useQuery({
		queryKey: ["notes", currentPage, currentQuery],
		queryFn: () => fetchNotes(currentPage, currentQuery),
		placeholderData: keepPreviousData,
		refetchOnMount:false,
	})

	useEffect(() => {
		if (isSuccess && data && data.notes.length === 0) {
			toast.error('No notes.');
		}
	}, [isSuccess, data]
	);

	const notes = data?.notes || [];
	const totalPages = data?.totalPages || 0;

	
	const handleChangeQuery = useDebouncedCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setCurrentPage(1),
			setCurrentQuery(event.target.value.trim())
		}, 1000
	);
	

	return (
		<div className={css.app}>
			<header className={css.toolbar}>
				<SearchBox onChange={handleChangeQuery} />
				{totalPages > 1 &&
					(
						<Pagination
							totalPages={totalPages}
							page={page}
							onSetPage={setCurrentPage}
						/>
					
					)}
				<button className={css.button} onClick={openModal}> Create note </button>
			</header>
			
			{notes.length > 0 && <NoteList notes={notes} />}
			{isModalOpen && (
				<Modal onClose={closeModal}>
					<NoteForm onCloseModal={closeModal} />
				</Modal>
			)}
			<Toaster />
			
		</div>
	);
}

