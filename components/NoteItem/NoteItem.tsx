import Link from "next/link";
import type { Note } from "@/types/note";

type Props = {
  item: Note;
  onDelete: (id: string) => void;
};

const NoteItem = ({ item, onDelete }: Props) => {
  return (
    <li>
      <h2>{item.title}</h2>

      <p>{item.content}</p>

      <div>
        <Link href={`/notes/${item.id}`}>
          View details
        </Link>

        <button
          type="button"
          onClick={() => onDelete(item.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default NoteItem;