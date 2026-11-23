import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/queryClient";
import { fetchNoteById } from "@/lib/api";

import NotePreviewClient from "./NotePreview.client";

interface NotePreviewProps {
  id: string;
}

export default async function NotePreview({ id }: NotePreviewProps) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient id={id} />
    </HydrationBoundary>
  );
}



