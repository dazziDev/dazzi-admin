import {
  addCategory as apiAddCategory,
  fetchCategories,
} from "@/app/api/categories"; // API 함수 rename
import { AddCategoryRequest } from "@/app/types/category";
import { useCategoryStore } from "@/store/categoryStore";
import { useState } from "react";

interface AddCategoryModalProps {
  onClose: () => void;
  onSuccess?: (permalink: string) => void;
}

const AddCategoryModal = ({ onClose, onSuccess }: AddCategoryModalProps) => {
  const {
    categoryList,
    setCategoryList,
    addCategory: addCategoryToStore,
  } = useCategoryStore();

  const [categoryName, setCategoryName] = useState("");
  const [permalink, setPermalink] = useState("");
  const [priority, setPriority] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const newCategory: AddCategoryRequest = {
        title: categoryName,
        permalink,
        priority: String(priority),
      };

      // 퍼머링크 중복 확인
      if (categoryList.some((cat) => cat.permalink === permalink)) {
        setError("이미 존재하는 퍼머링크입니다.");
        setIsSubmitting(false);
        return;
      }

      // 새로운 카테고리 추가
      await apiAddCategory(newCategory);

      // 카테고리 리스트 재조회 후 상태 업데이트
      const updatedCategories = await fetchCategories();
      setCategoryList(updatedCategories); // 상태 업데이트
      
      // 성공 콜백 호출 (새로 추가된 카테고리의 permalink 전달)
      if (onSuccess) {
        onSuccess(permalink);
      }
      
      onClose();
    } catch (err: any) {
      if (err.response) {
        setError(
          `서버 오류: ${err.response.data.message || "알 수 없는 오류"}`
        );
      } else if (err.request) {
        setError("네트워크 오류: 서버에 연결할 수 없습니다.");
      } else {
        setError("카테고리 추가에 실패했습니다.");
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* 모달 내용 */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold text-lg"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          카테고리 추가
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              카테고리명
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              placeholder="카테고리명을 입력하세요"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              퍼머링크
            </label>
            <input
              type="text"
              value={permalink}
              onChange={(e) => setPermalink(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              placeholder="퍼머링크를 입력하세요"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              출력순위
            </label>
            <input
              type="number"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              required
              min={0}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              placeholder="출력순위를 입력하세요"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "추가 중..." : "확인"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
