"use client";

export default function NoteDetailsError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <p role="alert">
      Could not fetch note details. {error.message}
    </p>
  );
}