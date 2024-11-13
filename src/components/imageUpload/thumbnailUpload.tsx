"use client";

import { Button } from "@/components/ui/button";
import { useArticleStore } from "@/store/articleStore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { canvasPreview } from "./canvasPreview";

interface ThumbnailUploadProps {}

const ThumbnailUpload: React.FC<ThumbnailUploadProps> = () => {
  const { setThumbnail, thumbnail } = useArticleStore();

  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(16 / 9);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [isCropConfirmed, setIsCropConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      setError("유효하지 않은 파일 형식이거나 크기가 너무 큽니다.");
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSrc(reader.result as string);
        // 새 이미지 선택 시 상태 초기화
        setCrop(undefined);
        setCompletedCrop(undefined);
        setIsCropConfirmed(false);
        setThumbnail(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    if (aspect) {
      const centeredCrop = centerCrop(
        makeAspectCrop(
          {
            unit: "%",
            width: 90,
          },
          aspect,
          width,
          height
        ),
        width,
        height
      );
      setCrop(centeredCrop);
      setCompletedCrop(convertToPixelCrop(centeredCrop, width, height));
    }
  };

  useEffect(() => {
    const preview = async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        try {
          await canvasPreview(
            imgRef.current,
            previewCanvasRef.current,
            completedCrop,
            scale,
            rotate
          );
        } catch (error) {
          setError("이미지 처리 중 오류가 발생했습니다.");
        }
      }
    };
    preview();
  }, [completedCrop, scale, rotate]);

  const handleConfirmCrop = async () => {
    if (!previewCanvasRef.current) return;

    setLoading(true);
    previewCanvasRef.current.toBlob((blob) => {
      if (blob) {
        const croppedImageUrl = URL.createObjectURL(blob);
        setThumbnail(croppedImageUrl); // 스토어에 저장
        setIsCropConfirmed(true);
      } else {
        setError("이미지를 처리할 수 없습니다.");
      }
      setLoading(false);
    }, "image/jpeg");
  };

  const handleEditCrop = () => {
    setIsCropConfirmed(false);
  };

  const handleReset = () => {
    setSrc(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setIsCropConfirmed(false);
    setThumbnail(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleDeleteThumbnail = () => {
    setThumbnail(null);
    setIsCropConfirmed(false);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      {/* 드래그 앤 드롭 영역 */}
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 mb-4 cursor-pointer ${
          isDragActive ? "border-blue-500" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-500">이미지를 여기에 드롭하세요...</p>
        ) : (
          <p>여기를 클릭하거나 이미지를 드래그하여 업로드하세요.</p>
        )}
      </div>

      {/* 또는 버튼을 통한 파일 선택 */}
      <div className="flex justify-center mb-4">
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-indigo-500 text-white px-4 py-2 rounded"
        >
          이미지 선택
        </Button>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const files = e.target.files;
            if (files) {
              onDrop(Array.from(files), []);
            }
          }}
          ref={fileInputRef}
          className="hidden"
        />
      </div>

      {/* 크롭 옵션 */}
      {src && !isCropConfirmed && (
        <>
          <div className="flex space-x-2 mb-4">
            <Button
              onClick={() => setAspect(16 / 9)}
              className={`${
                aspect === 16 / 9 ? "bg-blue-600" : "bg-blue-500"
              } text-white px-4 py-2 rounded`}
            >
              메인 기사용 자르기 (가로 직사각형)
            </Button>
            <Button
              onClick={() => setAspect(122 / 185)}
              className={`${
                aspect === 122 / 185 ? "bg-green-600" : "bg-green-500"
              } text-white px-4 py-2 rounded`}
            >
              보통 기사용 자르기 (세로형)
            </Button>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <span>확대/축소:</span>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* 이미지 크롭 영역 */}
          <div className="relative max-w-full max-h-[400px] overflow-hidden border border-gray-300 rounded-md mb-4">
            <ReactCrop
              crop={crop}
              onChange={(newCrop) => setCrop(newCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              ruleOfThirds
              disabled={isCropConfirmed}
            >
              <img
                ref={imgRef}
                src={src}
                alt="Thumbnail"
                onLoad={handleImageLoad}
                className="object-contain"
                style={{
                  transform: `scale(${scale}) rotate(${rotate}deg)`,
                  maxWidth: "100%",
                  maxHeight: "400px",
                }}
              />
            </ReactCrop>
          </div>

          {/* 미리보기 캔버스 */}
          {completedCrop && (
            <div className="mt-4">
              <h3 className="mb-2 font-semibold">자르기된 이미지 미리보기:</h3>
              <canvas
                ref={previewCanvasRef}
                style={{
                  border: "1px solid black",
                  objectFit: "contain",
                  width: completedCrop.width,
                  height: completedCrop.height,
                }}
              />
            </div>
          )}

          {/* 크롭 확정 및 수정 버튼 */}
          <div className="mt-4 flex space-x-2">
            {!isCropConfirmed ? (
              <Button
                onClick={handleConfirmCrop}
                disabled={!completedCrop || loading}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {loading ? "처리 중..." : "자르기 확정"}
              </Button>
            ) : (
              <Button
                onClick={handleEditCrop}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                자르기 재수정
              </Button>
            )}
            <Button
              onClick={handleReset}
              variant="secondary"
              className="px-4 py-2 rounded"
            >
              재업로드
            </Button>
          </div>
        </>
      )}

      {/* 자르기 완료 후 썸네일 표시 및 삭제 버튼 */}
      {isCropConfirmed && thumbnail && (
        <div className="mt-4 text-center">
          <h3 className="mb-2 font-semibold">업로드된 썸네일:</h3>
          <img
            src={thumbnail}
            alt="Uploaded Thumbnail"
            className="mx-auto rounded-md shadow-md"
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <div className="mt-4">
            <Button
              onClick={handleDeleteThumbnail}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              썸네일 삭제
            </Button>
          </div>
        </div>
      )}

      {/* 에러 메시지 표시 */}
      {error && (
        <div className="mt-4 text-red-500 text-center">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default ThumbnailUpload;
