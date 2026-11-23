"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { fetchNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";

import css from "@/components/NoteDetails/NoteDetails.module.css";

interface NotePreviewClientProps {
  id: string;
}

export default function NotePreviewClient({
  id,
}: NotePreviewClientProps) {
  const router = useRouter();

  const {
    data: note,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  return (
    <Modal onClose={() => router.back()}>
      {isPending && <p>Loading, please wait...</p>}

      {isError && <p>Something went wrong.</p>}

      {note && (
        <main className={css.main}>
          <div className={css.container}>
            <div className={css.item}>
              <div className={css.header}>
                <h2>{note.title}</h2>
              </div>

              <p className={css.tag}>{note.tag}</p>

              <p className={css.content}>{note.content}</p>

              <p className={css.date}>
                {new Date(note.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </main>
      )}
    </Modal>
  );
}



