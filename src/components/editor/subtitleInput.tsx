import { Input } from "@/components/ui/input";
import { useArticleStore } from "@/store/articleStore";

const SubtitleInput = () => {
  const { subtitle, setSubtitle } = useArticleStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubtitle(e.target.value);
  };

  return (
    <div className="mb-4">
      <label
        htmlFor="subtitle"
        className="block text-sm font-medium text-gray-700"
      >
        서브타이틀
      </label>
      <Input
        id="subtitle"
        type="text"
        value={subtitle}
        onChange={handleChange}
        placeholder="서브타이틀을 입력하세요"
      />
      <p className="text-sm text-gray-500 mt-1">
        서브타이틀은 기사 제목 아래에 표시됩니다. SEO에 유의하세요.(최대 글자는
        일단보류,,)
      </p>
    </div>
  );
};

export default SubtitleInput;
