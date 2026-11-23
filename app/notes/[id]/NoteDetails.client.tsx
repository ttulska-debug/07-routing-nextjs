"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { fetchNoteById } from "@/lib/api";

export default function NoteDetailsClient() {
  const { id } = useParams<{ id: string }>();

  const {
    data: note,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isPending) {
    return <p>Loading note...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <main>
      <h1>{note.title}</h1>

      <p>{note.content}</p>

      <p>
        Tag: {note.tag}
      </p>

      <p>
        Created: {new Date(note.createdAt).toLocaleDateString("uk-UA")}
      </p>
    </main>
  );
}