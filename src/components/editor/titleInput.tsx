import { Input } from "@/components/ui/input";
import { useEditorStore } from "@/store/editorStore";

const TitleInput = () => {
  const { title, setTitle } = useEditorStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <div className="mb-4">
      <label
        htmlFor="title"
        className="block text-sm font-medium text-gray-700"
      >
        기사 제목
      </label>
      <Input
        id="title"
        type="text"
        value={title}
        onChange={handleChange}
        placeholder="기사 제목을 입력하세요"
      />
      <p className="text-sm text-gray-500 mt-1">
        기사 제목은 썸네일에도 사용됩니다. SEO에 유의하세요. (최대 글자는
        일단보류,,)
      </p>
    </div>
  );
};

export default TitleInput;
