"use client";

import React, { useRef, useState } from "react";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { canvasPreview } from "../imageUpload/canvasPreview";

interface ProfileImageCropProps {
  imageFile: File | null;
  isCircle: boolean;
  onCropReady: (getCroppedBlob: () => Promise<Blob | null>) => void;
  aspectRatio: number;
  cropSize: { width: number; height: number };
}

const ProfileImageCrop: React.FC<ProfileImageCropProps> = ({
  imageFile,
  isCircle,
  onCropReady,
  aspectRatio,
  cropSize,
}) => {
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const cropWidth = isCircle ? 70 : 80;
    const newCrop = centerCrop(
      makeAspectCrop(
        { unit: "%", width: cropWidth },
        aspectRatio,
        width,
        height
      ),
      width,
      height
    );
    setCrop(newCrop);

    // 즉시 completedCrop도 설정하여 함수 준비
    const pixelCrop = convertToPixelCrop(newCrop, width, height);
    setCompletedCrop(pixelCrop);
  }

  // 미리보기 업데이트 함수
  const updatePreview = React.useCallback(async () => {
    console.log("updatePreview 시작:", {
      hasImg: !!imgRef.current,
      hasCompletedCrop: !!completedCrop,
      hasCanvas: !!previewCanvasRef.current,
      completedCrop,
      scale,
      rotate,
    });

    if (!imgRef.current || !completedCrop || !previewCanvasRef.current) {
      console.log("updatePreview: 필수 요소 누락");
      return;
    }

    try {
      // 임시 캔버스로 크롭 미리보기 생성
      const tempCanvas = document.createElement("canvas");
      console.log("updatePreview: canvasPreview 호출 전");

      await canvasPreview(
        imgRef.current,
        tempCanvas,
        completedCrop,
        scale,
        rotate
      );

      console.log(
        "updatePreview: canvasPreview 완료, tempCanvas 크기:",
        tempCanvas.width,
        "x",
        tempCanvas.height
      );

      // 최종 캔버스에 결과 적용
      const canvas = previewCanvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.log("updatePreview: canvas context 없음");
        return;
      }

      canvas.width = cropSize.width;
      canvas.height = cropSize.height;
      console.log(
        "updatePreview: 최종 canvas 크기 설정:",
        cropSize.width,
        "x",
        cropSize.height
      );

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isCircle) {
        // 원형 마스크 적용
        console.log("updatePreview: 원형 마스크 적용");
        ctx.beginPath();
        ctx.arc(
          canvas.width / 2,
          canvas.height / 2,
          canvas.width / 2,
          0,
          Math.PI * 2
        );
        ctx.clip();
      }

      // 임시 캔버스를 최종 크기로 조정하여 그리기
      console.log("updatePreview: 최종 이미지 그리기");
      ctx.drawImage(
        tempCanvas,
        0,
        0,
        tempCanvas.width,
        tempCanvas.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      ctx.restore();
      onCropReady(getCroppedBlob);
      console.log("updatePreview: 미리보기 업데이트 완료");
    } catch (error) {
      console.error("미리보기 업데이트 오류:", error);
    }
  }, [completedCrop, cropSize, isCircle, rotate, scale]);

  // 크롭 영역이나 scale, rotate가 변경될 때마다 미리보기 업데이트
  React.useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  // 크롭된 이미지를 반환하는 함수
  const getCroppedBlob = React.useCallback(async (): Promise<Blob | null> => {
    if (!previewCanvasRef.current) {
      console.log("getCroppedBlob: canvas가 없음");
      return null;
    }

    const canvas = previewCanvasRef.current;
    console.log(
      "getCroppedBlob: canvas 크기:",
      canvas.width,
      "x",
      canvas.height
    );

    // canvas 내용 확인
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const hasContent = imageData.data.some((pixel) => pixel !== 0);
      console.log("getCroppedBlob: canvas에 내용이 있는가?", hasContent);
    }

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        console.log(
          "getCroppedBlob: blob 생성 결과:",
          blob,
          "크기:",
          blob?.size
        );
        resolve(blob);
      }, "image/png");
    });
  }, []);

  // 크롭 준비 완료를 부모에게 알림

  if (!src) return null;

  return (
    <div className="space-y-3">
      <div className="border rounded-lg p-4 bg-gray-50 overflow-hidden">
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspectRatio}
          className="max-h-96"
          circularCrop={isCircle}
        >
          <img
            ref={imgRef}
            alt="Crop me"
            src={src}
            onLoad={onImageLoad}
            className="max-h-96"
            style={{
              transform: `scale(${scale}) rotate(${rotate}deg)`,
              transformOrigin: "center",
            }}
          />
        </ReactCrop>
      </div>

      {/* 확대/축소 및 회전 컨트롤 */}
      <div className="space-y-2 px-2">
        <div>
          <label className="text-sm text-gray-600 flex items-center justify-between">
            <span>확대/축소</span>
            <span className="text-xs">{Math.round(scale * 100)}%</span>
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600 flex items-center justify-between">
            <span>회전</span>
            <span className="text-xs">{rotate}°</span>
          </label>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={rotate}
            onChange={(e) => setRotate(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* 미리보기 영역 */}
      <div className="flex justify-center">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700 mb-2">미리보기</p>
          <canvas
            ref={previewCanvasRef}
            className={`border-2 border-gray-300 shadow-sm ${
              isCircle ? "rounded-full" : "rounded-lg"
            }`}
            style={{
              width: isCircle ? 120 : 160,
              height: isCircle ? 120 : 90,
              objectFit: "contain",
            }}
          />
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center">
        {isCircle
          ? "원형 영역 안의 이미지가 프로필 사진으로 사용됩니다"
          : "선택한 영역이 에디터 소개 이미지로 사용됩니다"}
      </p>
    </div>
  );
};

export default ProfileImageCrop;
