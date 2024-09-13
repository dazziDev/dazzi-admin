"use client";
import { Button } from "@/components/ui/button";
import { Author, useProfileStore } from "@/store/editorStore";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";

// 백엔드 구현이 안되어있기때문에 일단 임시로 프론트에서 데이터를 관리하도록 구현
const Profile = () => {
  const { authors, addAuthor, updateAuthor, deleteAuthor } = useProfileStore();
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [newAuthor, setNewAuthor] = useState({
    name: "",
    src: "",
    rectSrc: "",
    introduction: "",
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [rectAvatar, setRectAvatar] = useState<File | null>(null);
  const editorRef = useRef<AvatarEditor>(null);
  const rectEditorRef = useRef<AvatarEditor>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isRect: boolean = false
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isRect) {
        setRectAvatar(file);
      } else {
        setAvatar(file);
      }
    }
  };

  const handleAddOrUpdate = () => {
    let imgSrc = newAuthor.src;
    let rectImgSrc = newAuthor.src;

    if (editorRef.current && avatar) {
      const canvas = editorRef.current.getImageScaledToCanvas().toDataURL();
      imgSrc = canvas;
    }

    if (rectEditorRef.current && rectAvatar) {
      const rectCanvas = rectEditorRef.current
        .getImageScaledToCanvas()
        .toDataURL();
      rectImgSrc = rectCanvas;
    }

    if (editingAuthor) {
      updateAuthor({ ...editingAuthor, src: imgSrc, rectSrc: rectImgSrc });
    } else {
      addAuthor({
        ...newAuthor,
        src: imgSrc,
        rectSrc: rectImgSrc,
        id: Date.now(),
      });
    }

    setEditingAuthor(null);
    setNewAuthor({ name: "", src: "", rectSrc: "", introduction: "" });
    setAvatar(null);
    setRectAvatar(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setNewAuthor(author);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingAuthor(null);
    setNewAuthor({ name: "", src: "", rectSrc: "", introduction: "" });
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">프로필 관리</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {authors.map((author) => (
          <div key={author.id} className="p-4 bg-white shadow rounded-lg">
            <Image
              src={author.src}
              alt={author.name}
              width={100}
              height={100}
              className="rounded-full mx-auto"
            />
            <h2 className="mt-2 text-center font-semibold text-lg">
              {author.name}
            </h2>
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
              <Button onClick={() => handleEdit(author)}>수정</Button>
              <Button
                variant="destructive"
                onClick={() => deleteAuthor(author.id)}
              >
                삭제
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Button onClick={handleAddNew} className="w-full">
          새 프로필 추가
        </Button>
      </div>

      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
          <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4 ">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg max-h-screen overflow-y-auto relative">
              <Dialog.Title className="text-lg font-medium mb-4">
                {editingAuthor ? "프로필 수정" : "새로운 프로필 추가"}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="absolute top-2 right-3 text-gray-500"
                  aria-label="Close"
                >
                  X
                </button>
              </Dialog.Close>
              <div className="grid grid-cols-1 gap-4">
                <input
                  className="p-2 border rounded-lg w-full"
                  type="text"
                  placeholder="이름"
                  value={newAuthor.name}
                  onChange={(e) =>
                    setNewAuthor({ ...newAuthor, name: e.target.value })
                  }
                />
                <p className="p-0 m-0">
                  기사 하단에 붙이는 프로필이미지[원 모양]
                </p>
                <input
                  className="p-2 border rounded-lg w-full"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, false)}
                />
                {avatar && (
                  <div className="mt-4 mb-4">
                    <AvatarEditor
                      ref={editorRef}
                      image={avatar}
                      width={200}
                      height={200}
                      border={50}
                      borderRadius={100}
                      color={[255, 255, 255, 0.6]}
                      scale={1.2}
                      rotate={0}
                    />
                  </div>
                )}
                <p className="p-0 m-0">에디터 프로필 사진[직사각형]</p>
                <input
                  className="p-2 border rounded-lg w-full"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, true)}
                />
                {rectAvatar && (
                  <div className="mt-4 mb-4">
                    <AvatarEditor
                      ref={rectEditorRef}
                      image={rectAvatar}
                      width={372}
                      height={213}
                      border={20}
                      borderRadius={0}
                      color={[255, 255, 255, 0.6]}
                      scale={1.2}
                      rotate={0}
                    />
                  </div>
                )}
                <input
                  className="p-2 border rounded-lg w-full"
                  type="text"
                  placeholder="소개 문구"
                  value={newAuthor.introduction}
                  onChange={(e) =>
                    setNewAuthor({ ...newAuthor, introduction: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleAddOrUpdate} className="w-full mb-5 mt-4">
                {editingAuthor ? "프로필 업데이트" : "프로필 추가"}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default Profile;
