import { fetchCategories } from "@/app/api/categories";
import { MultipleSelector, Option } from "@/components/ui/multiSelect";
import { useArticleStore } from "@/store/articleStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useEffect, useMemo, useState } from "react";
import AddCategoryModal from "./addCategoryModal";

const CategoryInput = () => {
  const { categoryList, setCategoryList } = useCategoryStore();
  const { setSelectedCategories } = useArticleStore();
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const categories = await fetchCategories();
        setCategoryList(categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setError("카테고리 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    initialize();
  }, [setCategoryList]);

  const editorStoreSelectedCategories = useArticleStore(
    (state) => state.selectedCategories
  );

  const options: Option[] = useMemo(() => {
    return [...categoryList].map((category) => ({
      label: category.categoryName,
      value: category.permalink,
    }));
  }, [categoryList]);

  useEffect(() => {
    // selectedCategories가 변경될 때 selectedOptions 업데이트
    const newSelectedOptions = options.filter((option) =>
      editorStoreSelectedCategories.includes(option.value)
    );
    // 변경이 있을 때만 업데이트
    if (
      newSelectedOptions.length !== selectedOptions.length ||
      !newSelectedOptions.every(
        (opt, index) => opt.value === selectedOptions[index]?.value
      )
    ) {
      setSelectedOptions(newSelectedOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorStoreSelectedCategories, options]);

  const handleChange = (options: Option[]) => {
    setSelectedOptions(options);
    // 단일 카테고리 선택이므로 첫 번째 값
    const selectedPermalink = options[0]?.value;
    // permalink로 저장
    setSelectedCategories([selectedPermalink]);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (isLoading) {
    return <p className="text-gray-500">카테고리 로딩 중...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="mb-4 relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        카테고리
      </label>
      <div className="flex items-center">
        <div className="flex-1">
          <MultipleSelector
            options={options}
            value={selectedOptions}
            onChange={handleChange}
            placeholder="카테고리를 선택하세요"
            key={options.map((opt) => opt.value).join(",")}
          />
        </div>
        <button
          type="button"
          onClick={openModal}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          추가
        </button>
      </div>
      <p className="text-sm text-gray-500 mt-1">
        작성할 기사가 속할(한) 카테고리를 선택(추가)하세요.
      </p>
      {isModalOpen && <AddCategoryModal onClose={closeModal} />}
    </div>
  );
};

export default CategoryInput;
