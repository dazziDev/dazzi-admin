import { useAuthorStore } from "@/store/authorStore";
import { useEffect } from "react";
import AuthorCard from "./authorCard";

const AuthorList = () => {
  const { authors, fetchAuthors } = useAuthorStore();

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {authors.map((author) => (
        <AuthorCard key={author.id} author={author} />
      ))}
    </div>
  );
};

export default AuthorList;
