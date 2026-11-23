import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/queryClient";
import { fetchNotes } from "@/lib/api";
import type { NoteTag } from "@/types/note";

import NotesClient from "./Notes.client";

type Props = {
  params: Promise<{ slug: string[] }>;
};

const tags: NoteTag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

export default async function NotesPage({ params }: Props) {
  const { slug } = await params;

  const selectedTag = slug[0];

  const tag: NoteTag | undefined =
    selectedTag === "all"
      ? undefined
      : tags.includes(selectedTag as NoteTag)
        ? (selectedTag as NoteTag)
        : undefined;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag ?? ""],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        search: "",
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}