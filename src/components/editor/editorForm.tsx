"use client";

import { Button } from "@/components/ui/button";
import { Editor, useEditorStore } from "@/store/editorStore";
import * as Dialog from "@radix-ui/react-dialog";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ProfileImageCrop from "./ProfileImageCrop";
import { generateEnglishFilename } from "@/lib/fileUtils";

interface EditorFormProps {
  initialEditor?: Editor;
  onClose: () => void;
}

const EditorForm = ({ initialEditor, onClose }: EditorFormProps) => {
  const editorStore = useEditorStore();
  const { data: session } = useSession();
  const [editorData, setEditorData] = useState<Editor>(
    initialEditor
      ? {
          ...initialEditor,
          instagramUrl: initialEditor.instagramUrl || "",
          youtubeUrl: initialEditor.youtubeUrl || "",
          xUrl: initialEditor.xUrl || "",
          linkedinUrl: initialEditor.linkedinUrl || "",
          websiteUrl: initialEditor.websiteUrl || "",
        }
      : {
          editorId: "",
          editorName: "",
          description: "",
          articleImage: "",
          introduceImage: "",
          instagramUrl: "",
          youtubeUrl: "",
          xUrl: "",
          linkedinUrl: "",
          websiteUrl: "",
        }
  );

  const [avatar, setAvatar] = useState<File | null>(null);
  const [rectAvatar, setRectAvatar] = useState<File | null>(null);
  const [getAvatarBlob, setGetAvatarBlob] = useState<
    (() => Promise<Blob | null>) | Promise<Blob | null> | null
  >(null);
  const [getRectAvatarBlob, setGetRectAvatarBlob] = useState<
    (() => Promise<Blob | null>) | Promise<Blob | null> | null
  >(null);

  // 디버깅: 함수 상태 확인
  useEffect(() => {}, [getAvatarBlob, getRectAvatarBlob]);

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
    // 이름 필수 검증
    if (!editorData.editorName.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    const formData = new FormData();

    // 이름, 설명, 활성화 상태를 필드로 추가
    formData.append("name", editorData.editorName);
    formData.append("description", editorData.description);
    formData.append("isActivate", "true");

    // SNS 링크들 추가 (빈 값이 아닌 경우만)
    if (editorData.instagramUrl?.trim()) {
      formData.append("instagramUrl", editorData.instagramUrl.trim());
    }
    if (editorData.youtubeUrl?.trim()) {
      formData.append("youtubeUrl", editorData.youtubeUrl.trim());
    }
    if (editorData.xUrl?.trim()) {
      formData.append("xUrl", editorData.xUrl.trim());
    }
    if (editorData.linkedinUrl?.trim()) {
      formData.append("linkedinUrl", editorData.linkedinUrl.trim());
    }
    if (editorData.websiteUrl?.trim()) {
      formData.append("websiteUrl", editorData.websiteUrl.trim());
    }

    // 작성자 이메일 추가 (새로 생성하는 경우)
    if (!initialEditor && session?.user?.email) {
      formData.append("createdBy", session.user.email);
      console.log("작성자 이메일 추가:", session.user.email);
    } else {
      console.log("작성자 이메일 추가 안됨:", {
        isEdit: !!initialEditor,
        hasEmail: !!session?.user?.email,
        email: session?.user?.email,
      });
    }

    const imageFiles: File[] = [];

    if (getAvatarBlob) {
      console.log("원형 이미지 blob 생성 시도...");
      try {
        let blob = null;
        // Promise인지 함수인지 확인
        if (typeof getAvatarBlob === "function") {
          const result = getAvatarBlob();

          blob = await result;
        } else if (getAvatarBlob && typeof getAvatarBlob.then === "function") {
          blob = await getAvatarBlob;
        } else {
          throw new Error("getAvatarBlob is neither function nor Promise");
        }

        if (blob) {
          const file = new File([blob], generateEnglishFilename('.png'), {
            type: "image/png",
          });
          imageFiles.push(file);
        } else {
        }
      } catch (error) {
        console.error("원형 이미지 blob 생성 중 오류:", error);
      }
    } else {
    }

    // 소개용 이미지(사각형) 처리

    if (getRectAvatarBlob) {
      try {
        let blob = null;
        // Promise인지 함수인지 확인
        if (typeof getRectAvatarBlob === "function") {
          const result = getRectAvatarBlob();

          blob = await result;
        } else if (
          getRectAvatarBlob &&
          typeof getRectAvatarBlob.then === "function"
        ) {
          blob = await getRectAvatarBlob;
        } else {
          throw new Error("getRectAvatarBlob is neither function nor Promise");
        }

        if (blob) {
          const file = new File([blob], generateEnglishFilename('.png'), {
            type: "image/png",
          });
          imageFiles.push(file);
        } else {
        }
      } catch (error) {
        console.error("직사각형 이미지 blob 생성 중 오류:", error);
      }
    } else {
    }

    // 이미지 파일을 FormData에 추가
    imageFiles.forEach((file) => {
      formData.append("files", file);
    });

    // 이미지가 없는 경우 확인 (수정 모드에서는 기존 이미지가 유지되므로 확인 안함)
    if (imageFiles.length === 0 && !initialEditor) {
      const confirm = window.confirm(
        "이미지가 없이 에디터를 추가하시겠습니까?\n나중에 수정할 수 있습니다."
      );
      if (!confirm) return;
    }

    try {
      for (let pair of formData.entries()) {
      }

      // 에디터 등록/수정 API 호출
      if (initialEditor) {
        await editorStore.updateEditor(initialEditor.editorId, formData);
      } else {
        await editorStore.addEditor(formData);
      }
      onClose();
    } catch (error) {
      console.error("에디터 추가 실패:", error);
      alert("에디터 추가에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg max-h-[90vh] overflow-y-auto relative my-8">
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
              <div>
                <input
                  className="p-2 border rounded-lg w-full"
                  type="text"
                  placeholder="이름 (필수)"
                  value={editorData.editorName}
                  onChange={(e) =>
                    setEditorData({ ...editorData, editorName: e.target.value })
                  }
                  required
                />
                {!editorData.editorName.trim() && (
                  <p className="text-red-500 text-xs mt-1">
                    이름은 필수 입력 항목입니다.
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <p className="font-medium">기사 하단 프로필 이미지 (원형)</p>
                <p className="text-xs text-gray-500">50x50 크기로 표시됩니다</p>
              </div>
              <input
                className="p-2 border rounded-lg w-full"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, false)}
              />
              {/* 기존 이미지 표시 (수정 모드) */}
              {initialEditor && !avatar && initialEditor.articleImage && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">
                    현재 원형 이미지:
                  </p>
                  <img
                    src={initialEditor.articleImage}
                    alt="현재 원형 이미지"
                    className="w-32 h-32 rounded-full object-cover mx-auto border-2 border-gray-300"
                  />
                  <p className="text-xs text-gray-500 text-center mt-1">
                    새 이미지를 업로드하면 교체됩니다
                  </p>
                </div>
              )}
              {avatar && (
                <ProfileImageCrop
                  imageFile={avatar}
                  isCircle={true}
                  onCropReady={setGetAvatarBlob}
                  aspectRatio={1}
                  cropSize={{ width: 200, height: 200 }}
                />
              )}
              <div className="space-y-1">
                <p className="font-medium">
                  에디터 소개 페이지 이미지 (직사각형)
                </p>
                <p className="text-xs text-gray-500">
                  372x213 비율로 표시됩니다
                </p>
              </div>
              <input
                className="p-2 border rounded-lg w-full"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, true)}
              />
              {/* 기존 이미지 표시 (수정 모드) */}
              {initialEditor && !rectAvatar && initialEditor.introduceImage && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">
                    현재 직사각형 이미지:
                  </p>
                  <img
                    src={initialEditor.introduceImage}
                    alt="현재 직사각형 이미지"
                    className="w-72 h-40 object-cover mx-auto border-2 border-gray-300 rounded-lg"
                  />
                  <p className="text-xs text-gray-500 text-center mt-1">
                    새 이미지를 업로드하면 교체됩니다
                  </p>
                </div>
              )}
              {rectAvatar && (
                <ProfileImageCrop
                  imageFile={rectAvatar}
                  isCircle={false}
                  onCropReady={setGetRectAvatarBlob}
                  aspectRatio={372 / 213}
                  cropSize={{ width: 372, height: 213 }}
                />
              )}
              <textarea
                className="p-2 border rounded-lg w-full resize-y"
                placeholder="소개 문구"
                rows={3}
                value={editorData.description}
                onChange={(e) =>
                  setEditorData({
                    ...editorData,
                    description: e.target.value,
                  })
                }
              />

              {/* SNS 링크 섹션 */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <h3 className="font-medium text-gray-700">
                  SNS 링크 (선택사항)
                </h3>
                <p className="text-xs text-gray-500">
                  입력된 SNS 링크만 에디터 프로필에 표시됩니다
                </p>

                <div className="space-y-2">
                  <input
                    className="p-2 border rounded-lg w-full"
                    type="url"
                    placeholder="Instagram URL (예: https://instagram.com/username)"
                    value={editorData.instagramUrl || ""}
                    onChange={(e) =>
                      setEditorData({
                        ...editorData,
                        instagramUrl: e.target.value,
                      })
                    }
                  />

                  <input
                    className="p-2 border rounded-lg w-full"
                    type="url"
                    placeholder="YouTube URL (예: https://youtube.com/@channel)"
                    value={editorData.youtubeUrl || ""}
                    onChange={(e) =>
                      setEditorData({
                        ...editorData,
                        youtubeUrl: e.target.value,
                      })
                    }
                  />

                  <input
                    className="p-2 border rounded-lg w-full"
                    type="url"
                    placeholder="X (구 Twitter) URL (예: https://x.com/username)"
                    value={editorData.xUrl || ""}
                    onChange={(e) =>
                      setEditorData({
                        ...editorData,
                        xUrl: e.target.value,
                      })
                    }
                  />

                  <input
                    className="p-2 border rounded-lg w-full"
                    type="url"
                    placeholder="LinkedIn URL (예: https://linkedin.com/in/username)"
                    value={editorData.linkedinUrl || ""}
                    onChange={(e) =>
                      setEditorData({
                        ...editorData,
                        linkedinUrl: e.target.value,
                      })
                    }
                  />

                  <input
                    className="p-2 border rounded-lg w-full"
                    type="url"
                    placeholder="개인 웹사이트 URL (예: https://mywebsite.com)"
                    value={editorData.websiteUrl || ""}
                    onChange={(e) =>
                      setEditorData({
                        ...editorData,
                        websiteUrl: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
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
