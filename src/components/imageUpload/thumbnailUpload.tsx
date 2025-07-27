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
  const {
    landscapeThumbnail,
    setLandscapeThumbnail,
    portraitThumbnail,
    setPortraitThumbnail,
  } = useArticleStore();

  // 썸네일이 S3 URL인지 확인 (편집 모드에서 기존 썸네일)
  const isExistingLandscape =
    landscapeThumbnail &&
    (landscapeThumbnail.includes("amazonaws.com") ||
      landscapeThumbnail.includes("s3"));
  const isExistingPortrait =
    portraitThumbnail &&
    (portraitThumbnail.includes("amazonaws.com") ||
      portraitThumbnail.includes("s3"));

  // 크롭 워크플로우 상태
  const [currentStep, setCurrentStep] = useState<
    "upload" | "crop-landscape" | "crop-portrait" | "completed"
  >("upload");
  const [originalSrc, setOriginalSrc] = useState<string | null>(null); // 원본 이미지
  const [src, setSrc] = useState<string | null>(null); // 현재 크롭 중인 이미지
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 10,
    y: 10,
    width: 80,
    height: 45,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  // 현재 단계에 따른 aspect 비율
  const [aspect, setAspect] = useState<number | undefined>(16 / 9);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 메모리 누수 방지를 위한 URL cleanup
  const urlCleanupRef = useRef<string[]>([]);

  // 크롭 단계 변경시 aspect 비율 자동 설정
  useEffect(() => {
    let newAspect: number;
    if (currentStep === "crop-landscape") {
      newAspect = 16 / 9; // 가로형: 16:9
    } else if (currentStep === "crop-portrait") {
      newAspect = 3 / 4; // 세로형: 3:4
    } else {
      return; // 크롭 단계가 아니면 리턴
    }

    setAspect(newAspect);

    // 이미지가 있다면 crop도 새로 계산
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      const cropWidth = currentStep === "crop-landscape" ? 90 : 60;
      const newCrop = centerCrop(
        makeAspectCrop(
          { unit: "%", width: cropWidth },
          newAspect,
          width,
          height
        ),
        width,
        height
      );
      setCrop(newCrop);
      setCompletedCrop(convertToPixelCrop(newCrop, width, height));
    }
  }, [currentStep]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      setError("유효하지 않은 파일 형식이거나 크기가 너무 큽니다.");
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        setOriginalSrc(imageUrl); // 원본 이미지 저장
        setSrc(imageUrl);
        setCurrentStep("crop-landscape"); // 가로형 크롭부터 시작
        setCompletedCrop(undefined);
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

        // URL 추적을 위해 배열에 추가
        urlCleanupRef.current.push(croppedImageUrl);

        if (currentStep === "crop-landscape") {
          // 가로형 크롭 완료 → 세로형 크롭 단계로
          setLandscapeThumbnail(croppedImageUrl);
          setSrc(originalSrc); // 원본 이미지로 다시 설정
          setCurrentStep("crop-portrait");
          setCompletedCrop(undefined); // 크롭 초기화
          console.log("✅ 가로형 크롭 완료, 세로형 크롭 단계로 진입");
        } else if (currentStep === "crop-portrait") {
          // 세로형 크롭 완료 → 완료 단계로
          setPortraitThumbnail(croppedImageUrl);
          setCurrentStep("completed");
          setSrc(null);
          console.log("✅ 세로형 크롭 완료, 전체 과정 완료");
        }
      } else {
        setError("이미지를 처리할 수 없습니다.");
      }
      setLoading(false);
    }, "image/jpeg");
  };


  const handleReset = () => {
    setOriginalSrc(null);
    setSrc(null);
    setCrop({
      unit: "%",
      x: 10,
      y: 10,
      width: 80,
      height: 45,
    });
    setCompletedCrop(undefined);
    setCurrentStep("upload");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteThumbnail = (type: "landscape" | "portrait") => {
    if (type === "landscape") {
      // 기존 URL 정리
      if (landscapeThumbnail && landscapeThumbnail.startsWith("blob:")) {
        URL.revokeObjectURL(landscapeThumbnail);
      }
      setLandscapeThumbnail(null);
    } else {
      // 기존 URL 정리
      if (portraitThumbnail && portraitThumbnail.startsWith("blob:")) {
        URL.revokeObjectURL(portraitThumbnail);
      }
      setPortraitThumbnail(null);
    }
  };

  const handleStartNewUpload = () => {
    // 메모리 정리
    cleanupUrls();
    // 기존 썸네일들 삭제하고 새로 시작
    setLandscapeThumbnail(null);
    setPortraitThumbnail(null);
    handleReset();
  };

  // URL 정리 함수
  const cleanupUrls = () => {
    urlCleanupRef.current.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });
    urlCleanupRef.current = [];
  };

  // 컴포넌트 언마운트 시 메모리 정리
  useEffect(() => {
    return () => {
      cleanupUrls();
    };
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">
        📸 썸네일 업로드 (가로형/세로형 모두 필수)
      </h3>

      {/* 진행 단계 표시 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">진행 상태:</span>
          <span className="text-sm text-gray-600">
            {currentStep === "upload" && "이미지 선택 대기"}
            {currentStep === "crop-landscape" && "가로형 썸네일 크롭 중"}
            {currentStep === "crop-portrait" && "세로형 썸네일 크롭 중"}
            {currentStep === "completed" && "완료"}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{
              width: `${
                {
                  "upload": 0,
                  "crop-landscape": 33,
                  "crop-portrait": 66,
                  "completed": 100,
                }[currentStep]
              }%`,
            }}
          ></div>
        </div>
      </div>

      {/* 완료된 썸네일들 표시 */}
      {(landscapeThumbnail || portraitThumbnail) && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2 flex items-center">
              🖼️ 가로형 썸네일 (PC용)
              {landscapeThumbnail && (
                <span className="ml-2 text-green-600">✅</span>
              )}
            </h4>
            {landscapeThumbnail ? (
              <div className="text-center">
                <img
                  src={landscapeThumbnail}
                  alt="가로형 썸네일"
                  className="mx-auto rounded border w-full max-w-xs"
                  style={{ height: "auto" }}
                />
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteThumbnail("landscape")}
                  className="mt-2"
                >
                  삭제
                </Button>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">대기 중...</div>
            )}
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2 flex items-center">
              📱 세로형 썸네일 (모바일용)
              {portraitThumbnail && (
                <span className="ml-2 text-green-600">✅</span>
              )}
            </h4>
            {portraitThumbnail ? (
              <div className="text-center">
                <img
                  src={portraitThumbnail}
                  alt="세로형 썸네일"
                  className="mx-auto rounded border w-full max-w-48"
                  style={{ height: "auto" }}
                />
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteThumbnail("portrait")}
                  className="mt-2"
                >
                  삭제
                </Button>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">대기 중...</div>
            )}
          </div>
        </div>
      )}

      {/* 이미지 업로드 영역 */}
      {currentStep === "upload" && (
        <div className="border border-gray-300 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-4">📁 이미지 선택</h4>
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
        </div>
      )}

      {/* 크롭 영역 */}
      {(currentStep === "crop-landscape" || currentStep === "crop-portrait") &&
        src && (
          <div className="border border-gray-300 rounded-lg p-4 mb-4">
            <h4 className="font-semibold mb-4">
              📐{" "}
              {currentStep === "crop-landscape"
                ? "가로형 썸네일 (16:9)"
                : "세로형 썸네일 (3:4)"}{" "}
              크롭
            </h4>

            {/* 현재 설정된 비율 안내 */}
            <div className="mb-4 p-3 bg-gray-100 rounded-lg">
              <p className="text-sm font-medium text-gray-700">
                📐 현재 편집 중:{" "}
                {currentStep === "crop-landscape"
                  ? "가로형 썸네일 (PC용 16:9)"
                  : "세로형 썸네일 (모바일용 3:4)"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {currentStep === "crop-landscape"
                  ? "PC에서 최적화된 가로 비율로 자동 설정됩니다."
                  : "모바일에서 최적화된 세로 비율로 자동 설정됩니다."}
              </p>
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
                <h3 className="mb-2 font-semibold">
                  자르기된 이미지 미리보기:
                </h3>
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

            {/* 크롭 확정 버튼 */}
            <div className="mt-4 flex space-x-2">
              <Button
                onClick={handleConfirmCrop}
                disabled={!completedCrop || loading}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {loading
                  ? "처리 중..."
                  : currentStep === "crop-landscape"
                  ? "가로형 크롭 완료"
                  : "세로형 크롭 완료"}
              </Button>
              <Button
                onClick={handleReset}
                variant="secondary"
                className="px-4 py-2 rounded"
              >
                처음부터 다시
              </Button>
            </div>
          </div>
        )}

      {/* 완료 상태 */}
      {currentStep === "completed" && (
        <div className="text-center py-8">
          <div className="text-green-600 text-2xl mb-2">✅</div>
          <h4 className="font-semibold text-lg mb-2">썸네일 등록 완료!</h4>
          <p className="text-gray-600 mb-4">
            가로형/세로형 썸네일이 모두 등록되었습니다.
          </p>
          <Button
            onClick={handleStartNewUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            새로운 이미지로 다시 등록
          </Button>
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
