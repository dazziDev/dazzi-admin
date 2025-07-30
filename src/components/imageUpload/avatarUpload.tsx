import { Button } from "@/components/ui/button";
import { convertFileToEnglishName } from "@/lib/fileUtils";
import { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";

const AvatarUpload = ({
  onImageSave,
}: {
  onImageSave: (imageSrc: string) => void;
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [scale, setScale] = useState<number>(1);
  const editorRef = useRef<AvatarEditor>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // 파일명을 영어로 변환
      const convertedFile = convertFileToEnglishName(e.target.files[0]);
      setImage(convertedFile);
    }
  };

  const handleSave = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas().toDataURL();
      onImageSave(canvas);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input type="file" onChange={handleImageChange} />
      {image && (
        <AvatarEditor
          ref={editorRef}
          image={image}
          width={250}
          height={250}
          border={50}
          borderRadius={125}
          scale={scale}
        />
      )}
      <input
        type="range"
        value={scale}
        min="1"
        max="2"
        step="0.01"
        onChange={(e) => setScale(parseFloat(e.target.value))}
        className="mt-4"
      />
      <Button onClick={handleSave} className="mt-4">
        저장
      </Button>
    </div>
  );
};

export default AvatarUpload;
