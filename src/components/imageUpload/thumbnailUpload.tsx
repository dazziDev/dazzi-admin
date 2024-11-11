"use client";
import { Button } from "@/components/ui/button";
import { useArticleStore } from "@/store/articleStore";
import React, { useRef, useState } from "react";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "tailwindcss/tailwind.css";
import { canvasPreview } from "./canvasPreview";

const ThumbnailUpload = () => {
  const { setThumbnail } = useArticleStore();
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(16 / 9);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [isCropConfirmed, setIsCropConfirmed] = useState(false);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
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

  React.useEffect(() => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      canvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        completedCrop,
        scale,
        rotate
      );
    }
  }, [completedCrop, scale, rotate]);

  const handleConfirmCrop = async () => {
    if (!previewCanvasRef.current) return;

    const canvas = previewCanvasRef.current;
    canvas.toBlob((blob) => {
      if (blob) {
        const croppedImageUrl = URL.createObjectURL(blob);
        setThumbnail(croppedImageUrl); // 스토어에 저장
        setIsCropConfirmed(true);
      }
    }, "image/jpeg");
  };

  const handleEditCrop = () => {
    setIsCropConfirmed(false);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageLoad}
        className="mb-4"
      />

      <div className="flex space-x-2 mb-4">
        <Button
          onClick={() => setAspect(16 / 9)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          메인 기사용 자르기 (가로 직사각형)
        </Button>
        <Button
          onClick={() => setAspect(122 / 185)}
          className="bg-green-500 text-white px-4 py-2 rounded"
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

      {src && (
        <div className="relative max-w-full max-h-[400px] overflow-hidden border border-gray-300 rounded-md mb-4">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            ruleOfThirds
            disabled={isCropConfirmed}
          >
            <img
              ref={imgRef}
              src={src}
              alt="Thumbnail"
              onLoad={onImageLoad}
              className="object-contain"
              style={{
                transform: `scale(${scale}) rotate(${rotate}deg)`,
                maxWidth: "100%",
                maxHeight: "400px",
              }}
            />
          </ReactCrop>
        </div>
      )}

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

      <div className="mt-4 flex space-x-2">
        {!isCropConfirmed ? (
          <Button
            onClick={handleConfirmCrop}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            자르기 확정
          </Button>
        ) : (
          <Button
            onClick={handleEditCrop}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            자르기 재수정
          </Button>
        )}
      </div>
    </div>
  );
};

export default ThumbnailUpload;
