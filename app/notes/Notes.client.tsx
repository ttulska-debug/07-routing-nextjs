"use client";

import { useState } from "react";

import {
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";

import { useDebouncedCallback } from "use-debounce";

import { fetchNotes } from "@/lib/api";

import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";

import css from "../../components/NotePage/NotePage.module.css";

const PER_PAGE = 12;

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateSearch = useDebouncedCallback(
    (value: string) => {
      setSearch(value);
      setPage(1);
    },
    400
  );

  const {
    data,
    isPending,
    isError,
    error,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search,
      }),
    placeholderData: keepPreviousData,
  });

  return (
    <main className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={updateSearch} />

        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <button
          className={css.button}
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      {isPending && (
        <p className={css.message}>
          Loading notes...
        </p>
      )}

      {isError && (
        <p className={css.error}>
          Could not load notes: {error.message}
        </p>
      )}

      {isPlaceholderData && (
        <p className={css.message}>
          Loading notes...
        </p>
      )}

      {!isPending &&
        !isError &&
        !isPlaceholderData &&
        data?.notes.length === 0 && (
          <p className={css.message}>
            No notes found. Create your first note!
          </p>
        )}

      {data && data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </main>
  );
}