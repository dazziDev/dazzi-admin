import axiosInstance from "@/app/admin/api/axiosInstance";
import { Author, initialAuthors } from "@/store/authorStore";
import { useEditorStore } from "@/store/editorStore";
import Image from "next/image";
import { useEffect, useState } from "react";

const AvatarSelector = () => {
  const { selectedAuthor, setSelectedAuthor } = useEditorStore();
  // 삭제예정 위의것 사용
  const [authors, setAuthors] = useState<Author[]>(initialAuthors);

  useEffect(() => {
    // 에디터 리스트 가져와서 사용
    const fetchAuthors = async () => {
      try {
        const response = await axiosInstance.get("/authors/list");
        const authorsData: Author[] = response.data;
        setAuthors(authorsData);
      } catch (error) {
        console.error("Failed to fetch authors:", error);
      }
    };

    fetchAuthors();
  }, []);

  const handleAvatarClick = (author: Author) => {
    setSelectedAuthor(author);
  };

  return (
    <div className="flex justify-center space-x-4 mt-4 mb-4">
      {authors.map((author) => (
        <div
          key={author.id}
          className={`group cursor-pointer text-center transition-transform duration-300 ${
            selectedAuthor?.id === author.id ? "scale-110" : "opacity-50"
          }`}
          onClick={() => handleAvatarClick(author)}
        >
          <div className="relative">
            <Image
              src={author.src}
              alt={author.name}
              width={60}
              height={60}
              className={`rounded-full shadow-md transition-all duration-300 ${
                selectedAuthor?.id === author.id
                  ? "ring-4 ring-blue-500 opacity-100"
                  : "group-hover:opacity-75 group-hover:brightness-110"
              }`}
            />
          </div>
          <p
            className={`mt-2 text-sm font-semibold transition-all duration-300 ${
              selectedAuthor?.id === author.id
                ? "text-gray-900"
                : "text-gray-500 group-hover:text-gray-700"
            }`}
          >
            {author.name}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AvatarSelector;
