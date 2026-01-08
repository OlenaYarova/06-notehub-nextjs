import { fetchNotes } from "@/lib/api";

const Notes = async () => {
	// 3. Виконуємо запит
  const notes = await fetchNotes();
  console.log("notes", notes);

  return <div>Notes page</div>;
}

export default Notes;