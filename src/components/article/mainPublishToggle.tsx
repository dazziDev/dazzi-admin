"use client";
import { useArticleStore } from "@/store/articleStore";

const MainPublishToggle = () => {
  const isPublish = useArticleStore((state) => state.isPublish);
  const isMainPublish = useArticleStore((state) => state.isMainPublish);
  const setIsMainPublish = useArticleStore((state) => state.setIsMainPublish);

  const handleToggle = () => {
    setIsMainPublish(!isMainPublish);
  };

  return (
    <div className="mb-4">
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          checked={isMainPublish}
          onChange={handleToggle}
          disabled={!isPublish}
          className="form-checkbox h-5 w-5 text-blue-600 disabled:opacity-50"
        />
        <span className="ml-2 text-gray-700">메인 공개</span>
      </label>
      {!isPublish && (
        <p className="text-sm text-red-500">
          공개하지 않으면 메인 공개할 수 없습니다.
        </p>
      )}
    </div>
  );
};

export default MainPublishToggle;
