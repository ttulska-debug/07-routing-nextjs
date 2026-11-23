"use client";

import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createNote, type CreateNotePayload } from "@/lib/api";
import type { NoteTag } from "@/types/note";

import css from "./NoteForm.module.css";

const tags: NoteTag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Content must be at most 500 characters"),
  tag: Yup.mixed<NoteTag>()
    .oneOf(tags)
    .required("Tag is required"),
});

const initialValues: CreateNotePayload = {
  title: "",
  content: "",
  tag: "Todo",
};

interface NoteFormProps {
  onCancel: () => void;
}

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
  });

  const handleSubmit = async (
    values: CreateNotePayload,
    helpers: FormikHelpers<CreateNotePayload>
  ) => {
    try {
      await createMutation.mutateAsync(values);
      helpers.resetForm();
    } catch {
      // Помилка мутації обробляється нижче
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <label className={css.label} htmlFor="title">
            Title
          </label>
          <Field
            className={css.input}
            id="title"
            name="title"
            placeholder="Enter note title"
          />
          <ErrorMessage
            className={css.error}
            name="title"
            component="p"
          />

          <label className={css.label} htmlFor="content">
            Content
          </label>
          <Field
            className={css.textarea}
            as="textarea"
            id="content"
            name="content"
            placeholder="Enter note content"
          />
          <ErrorMessage
            className={css.error}
            name="content"
            component="p"
          />

          <label className={css.label} htmlFor="tag">
            Tag
          </label>
          <Field className={css.select} as="select" id="tag" name="tag">
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </Field>
          <ErrorMessage
            className={css.error}
            name="tag"
            component="p"
          />

          {createMutation.isError && (
            <p className={css.error}>
              Something went wrong. Please try again.
            </p>
          )}

          <div className={css.actions}>
            <button
              className={css.button}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              className={css.button}
              type="submit"
              disabled={isSubmitting || createMutation.isPending}
            >
              {isSubmitting || createMutation.isPending
                ? "Creating..."
                : "Create note"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}