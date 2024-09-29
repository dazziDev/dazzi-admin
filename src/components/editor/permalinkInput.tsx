import { Input } from "@/components/ui/input";
import { useEditorStore } from "@/store/editorStore";

const PermalinkInput = () => {
  const { permalink, setPermalink } = useEditorStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPermalink(e.target.value);
  };

  return (
    <div className="mb-4">
      <label
        htmlFor="permalink"
        className="block text-sm font-medium text-gray-700"
      >
        기사 이름 (Permalink)
      </label>
      <Input
        id="permalink"
        type="text"
        value={permalink}
        onChange={handleChange}
        placeholder="Permalink를 입력하세요"
      />
      <p className="text-sm text-gray-500 mt-1">
        Permalink는 URL에 사용될 고유한 문자열입니다. e.x
        (the-best-sushi-in-tokyo)
      </p>
    </div>
  );
};

export default PermalinkInput;
