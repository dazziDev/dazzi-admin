"use client";

import { Button } from "@/components/ui/button";
import { Author, useAuthorStore } from "@/store/authorStore";
import * as Dialog from "@radix-ui/react-dialog";
import { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";

interface AuthorFormProps {
  initialAuthor?: Author;
  onClose: () => void;
}

const AuthorForm = ({ initialAuthor, onClose }: AuthorFormProps) => {
  const { addAuthor, updateAuthor } = useAuthorStore();
  const [authorData, setAuthorData] = useState<Author>(
    initialAuthor || {
      id: 0,
      name: "",
      introduction: "",
      src: "",
      rectSrc: "",
    }
  );

  const [avatar, setAvatar] = useState<File | null>(null);
  const [rectAvatar, setRectAvatar] = useState<File | null>(null);
  const editorRef = useRef<AvatarEditor>(null);
  const rectEditorRef = useRef<AvatarEditor>(null);

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

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", authorData.name);
    formData.append("introduction", authorData.introduction);

    const promises = [];

    if (avatar && editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      promises.push(
        new Promise<void>((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) {
              formData.append("circleImage", blob, "circleImage.png");
            }
            resolve();
          });
        })
      );
    }

    if (rectAvatar && rectEditorRef.current) {
      const canvas = rectEditorRef.current.getImageScaledToCanvas();
      promises.push(
        new Promise<void>((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) {
              formData.append("rectImage", blob, "rectImage.png");
            }
            resolve();
          });
        })
      );
    }

    await Promise.all(promises);

    if (initialAuthor) {
      // Update author
      await updateAuthor(initialAuthor.id, formData);
    } else {
      // Add new author
      await addAuthor(formData);
    }

    onClose();
  };

  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4 ">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg max-h-screen overflow-y-auto relative">
            <Dialog.Title className="text-lg font-medium mb-4">
              {initialAuthor ? "프로필 수정" : "새로운 프로필 추가"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="absolute top-2 right-3 text-gray-500"
                aria-label="Close"
                onClick={onClose}
              >
                X
              </button>
            </Dialog.Close>
            <div className="grid grid-cols-1 gap-4">
              <input
                className="p-2 border rounded-lg w-full"
                type="text"
                placeholder="이름"
                value={authorData.name}
                onChange={(e) =>
                  setAuthorData({ ...authorData, name: e.target.value })
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
                value={authorData.introduction}
                onChange={(e) =>
                  setAuthorData({
                    ...authorData,
                    introduction: e.target.value,
                  })
                }
              />
            </div>
            <Button onClick={handleSubmit} className="w-full mb-5 mt-4">
              {initialAuthor ? "프로필 업데이트" : "프로필 추가"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AuthorForm;
