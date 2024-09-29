import { Button } from "@/components/ui/button";
import { Author, useAuthorStore } from "@/store/authorStore";
import Image from "next/image";
import { useState } from "react";
import AuthorForm from "./authorForm";

interface AuthorCardProps {
  author: Author;
}

const AuthorCard = ({ author }: AuthorCardProps) => {
  const { deleteAuthor } = useAuthorStore();
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    await deleteAuthor(author.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <Image
        src={author.src}
        alt={author.name}
        width={100}
        height={100}
        className="rounded-full mx-auto"
      />
      <h2 className="mt-2 text-center font-semibold text-lg">{author.name}</h2>
      <p className="text-center text-gray-600">{author.introduction}</p>
      <div className="mt-4 text-center">프로필 이미지↓</div>
      {author.rectSrc && (
        <div className="mt-4">
          <Image
            src={author.rectSrc}
            alt={`${author.name} 직사각형 이미지`}
            width={339}
            height={194}
            className="mx-auto"
            style={{
              width: "339px",
              height: "194px",
              borderRadius: "12px",
              objectFit: "cover",
            }}
          />
        </div>
      )}
      <div className="mt-4 flex justify-center space-x-2">
        <Button onClick={handleEdit}>수정</Button>
        <Button variant="destructive" onClick={handleDelete}>
          삭제
        </Button>
      </div>
      {isEditing && (
        <AuthorForm
          initialAuthor={author}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default AuthorCard;
