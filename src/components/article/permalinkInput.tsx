import { Input } from "@/components/ui/input";
import { useArticleStore } from "@/store/articleStore";

interface PermalinkInputProps {
  mode?: "create" | "edit";
}

const PermalinkInput = ({ mode = "create" }: PermalinkInputProps) => {
  const { permalink, setPermalink } = useArticleStore();

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
        disabled={mode === "edit"}
      />
      <p className="text-sm text-gray-500 mt-1">
        {mode === "edit" 
          ? "수정 모드에서는 Permalink를 변경할 수 없습니다."
          : "Permalink는 URL에 사용될 고유한 문자열입니다. e.x (the-best-sushi-in-tokyo)"
        }
      </p>
    </div>
  );
};

export default PermalinkInput;
