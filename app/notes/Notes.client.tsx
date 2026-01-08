'use client';


import css from './App.module.css'
import SearchBox from '../SearchBox/SearchBox'
import NoteList from "@/components/NoteList/NoteList"
import Pagination from '@/components/Pagination/Pagination'
import React, { useEffect, useState } from 'react'
import { fetchNotes } from '../../services/noteService'
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import toast, { Toaster } from 'react-hot-toast'
import {useDebouncedCallback} from 'use-debounce'
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import Modal from "../Modal/Modal";
import NoteForm from "@/components/NoteForm";

function App() {
	const [page, setPage] = useState(1);
	const [query, setQuery] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	
function openModal(): void{
	setIsModalOpen(true);
}
	function closeModal(): void{
		setIsModalOpen(false);
}

	const { data, isLoading, isFetching, isSuccess, isError } = useQuery({
		queryKey: ["notes", page, query],
		queryFn: () => fetchNotes(page, query),
		placeholderData: keepPreviousData,
	})

	useEffect(() => {
		if (isSuccess && data && data.notes.length === 0) {
			toast.error('No notes.');
		}
	}, [isSuccess, data]
	);

	const notes = data?.notes || [];
	const totalPages = data?.totalPages || 0;

	const isAnyLoading = isLoading || isFetching;

	const handleChangeQuery = useDebouncedCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setPage(1),
				setQuery(event.target.value.trim())
		}, 1000
	);
	

	return (
		<div className={css.app}>
			<header className={css.toolbar}>
				{/* <button className={css.button} onClick={openModal}>
					Create note +</button> */}

				<SearchBox onChange={handleChangeQuery} />
				{totalPages > 1 &&
					(
						<Pagination
							totalPages={totalPages}
							page={page}
							onSetPage={setPage}
						/>
					
					)}
				<button className={css.button} onClick={openModal}> Create note </button>
			</header>
			{isAnyLoading && <Loader />}
			{isError && <ErrorMessage />}
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
export default App
