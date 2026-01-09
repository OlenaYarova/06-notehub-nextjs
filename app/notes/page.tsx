import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from "@tanstack/react-query";

interface NoteProps{
  params: Promise<{ id: string }>;
}

export default async function NotesPages({ params }: NoteProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

   await queryClient.prefetchQuery({
    queryKey: ["notes",1, ''],
    queryFn:()=> fetchNotes(1, ''),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
    
}
