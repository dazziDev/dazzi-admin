"use client";

import { Button } from "@/components/ui/button";
import { Editor, useEditorStore } from "@/store/editorStore";
import * as Dialog from "@radix-ui/react-dialog";
import { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";

interface EditorFormProps {
  initialEditor?: Editor;
  onClose: () => void;
}

const EditorForm = ({ initialEditor, onClose }: EditorFormProps) => {
  const { addEditor } = useEditorStore();
  const [editorData, setEditorData] = useState<Editor>(
    initialEditor || {
      editorId: "",
      editorName: "",
      description: "",
      articleImage: "",
      introduceImage: "",
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

    // 이름, 설명, 활성화 상태를 필드로 추가
    formData.append("name", editorData.editorName);
    formData.append("description", editorData.description);
    formData.append("isActivate", "true");

    const imageFiles: File[] = [];

    // 프로필 이미지(원형) 처리
    if (avatar && editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const avatarBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => resolve(blob));
      });
      if (avatarBlob) {
        const file = new File([avatarBlob], "articleImage.png", {
          type: "image/png",
        });
        imageFiles.push(file);
      }
    }

    // 소개용 이미지(사각형) 처리
    if (rectAvatar && rectEditorRef.current) {
      const canvas = rectEditorRef.current.getImageScaledToCanvas();
      const rectBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => resolve(blob));
      });
      if (rectBlob) {
        const file = new File([rectBlob], "introduceImage.png", {
          type: "image/png",
        });
        imageFiles.push(file);
      }
    }

    // 이미지 파일을 FormData에 추가
    imageFiles.forEach((file) => {
      formData.append("files", file);
    });

    // FormData 확인 (디버깅용)
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    // 에디터 등록 API 호출
    await addEditor(formData);

    onClose();
  };

  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4 ">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg max-h-screen overflow-y-auto relative">
            <Dialog.Title className="text-lg font-medium mb-4">
              {initialEditor ? "에디터 수정" : "새로운 에디터 추가"}
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
                value={editorData.editorName}
                onChange={(e) =>
                  setEditorData({ ...editorData, editorName: e.target.value })
                }
              />
              <p className="p-0 m-0">
                기사 하단에 붙이는 프로필 이미지 [원 모양]
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
              <p className="p-0 m-0">에디터 프로필 사진 [직사각형]</p>
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
                value={editorData.description}
                onChange={(e) =>
                  setEditorData({
                    ...editorData,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <Button onClick={handleSubmit} className="w-full mb-5 mt-4">
              {initialEditor ? "에디터 업데이트" : "에디터 추가"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditorForm;
