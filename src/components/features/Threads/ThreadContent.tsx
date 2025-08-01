import { Thread } from "@/entities/thread/entity";
import { useEffect } from "react";

type Props = {
  thread: Thread;
};

export function ThreadContent({ thread }: Props) {
  function findThreadContentById(id: number) {
    thread.threadComments.forEach((comment) => {
      if (comment.id === id) {
        return comment;
      }
    });
  }

  useEffect(() => {
    findThreadContentById(thread.id);
  }, [thread]);

  return (
    <div className="flex flex-col pt-20">
      <h1 className="mb-4 text-2xl font-bold">Thread Content</h1>
      <p className="mb-4 text-gray-700">
        This is where the content of the thread will be displayed.
      </p>
      <p className="text-gray-500">
        More details about the thread can be added here.
      </p>
    </div>
  );
}
