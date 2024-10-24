"use client";
import { useArticleStore } from "@/store/articleStore";

const PublishToggle = () => {
  const isPublish = useArticleStore((state) => state.isPublish);
  const setIsPublish = useArticleStore((state) => state.setIsPublish);
  const setIsMainPublish = useArticleStore((state) => state.setIsMainPublish);

  const handleToggle = () => {
    setIsPublish(!isPublish);
    if (isPublish) {
      setIsMainPublish(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          checked={isPublish}
          onChange={handleToggle}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
        <span className="ml-2 text-gray-700">공개</span>
      </label>
    </div>
  );
};

export default PublishToggle;
