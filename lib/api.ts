import axios, { type AxiosResponse } from "axios";
import type { Note, NoteTag } from "@/types/note";

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export type CreateNoteResponse = Note;
export type DeleteNoteResponse = Note;

export async function fetchNotes({
  page,
  perPage,
  search = "",
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const response: AxiosResponse<FetchNotesResponse> =
    await api.get("/notes", {
      params: {
        page,
        perPage,
        ...(search.trim()
          ? { search: search.trim() }
          : {}),
      },
    });

  return response.data;
}

export async function fetchNoteById(
  id: string
): Promise<Note> {
  const response: AxiosResponse<Note> =
    await api.get(`/notes/${id}`);

  return response.data;
}


export async function createNote(
  payload: CreateNotePayload
): Promise<CreateNoteResponse> {
  const response: AxiosResponse<CreateNoteResponse> =
    await api.post("/notes", payload);

  return response.data;
}

export async function deleteNote(
  id: string
): Promise<DeleteNoteResponse> {
  const response: AxiosResponse<DeleteNoteResponse> =
    await api.delete(`/notes/${id}`);

  return response.data;
}