import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Thread } from "@/entities/thread/entity";
import { Link } from "react-router-dom";

type Props = {
  threads: Thread[];
};

export function ThreadsPresenter({ threads }: Props) {

  const handleClickThreadsButton = () => {

  }

  return (
    <div className="flex flex-col pt-20">
      <Header bgColor="bg-black" />
      {threads.map((thread) => (
        <button
          key={thread.id}
          className="border-b border-gray-200 p-4 text-left"
          onClick={handleClickThreadsButton}
        >
          <h2 className="text-xl font-bold">{thread.title}</h2>
          <p className="text-gray-500">
            Created at: {new Date(thread.createdAt).toLocaleDateString()}
          </p>
        </button>
      ))}
      <Footer />
    </div>
  );
}
