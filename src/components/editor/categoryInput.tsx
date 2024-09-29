import { fetchCategories } from "@/app/api/categories";
import { MultipleSelector, Option } from "@/components/ui/multiSelect";
import { useEditorStore } from "@/store/editorStore";
import { useEffect, useMemo, useState } from "react";

const CategoryInput = () => {
  const {
    categoryList,
    selectedCategories,
    setCategoryList,
    setSelectedCategories,
  } = useEditorStore();

  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  useEffect(() => {
    // 카테고리 리스트 가져오기

    const initialize = async () => {
      const categories = await fetchCategories();
      setCategoryList(categories);
    };
    initialize();
  }, [setCategoryList]);

  const options: Option[] = useMemo(() => {
    return categoryList.map((category) => ({
      label: category.label,
      value: category.permalink,
    }));
  }, [categoryList]);

  useEffect(() => {
    // 스토어의 selectedCategories가 변경될 때 selectedOptions 업데이트
    const newSelectedOptions = options.filter((option) =>
      selectedCategories.includes(option.value)
    );
    // 현재의 selectedOptions와 비교하여 변경이 있을 때만 상태 업데이트
    if (
      newSelectedOptions.length !== selectedOptions.length ||
      !newSelectedOptions.every(
        (opt, index) => opt.value === selectedOptions[index]?.value
      )
    ) {
      setSelectedOptions(newSelectedOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories, options]);

  const handleChange = (options: Option[]) => {
    setSelectedOptions(options);
    const selectedPermalinks = options.map((option) => option.value);
    setSelectedCategories(selectedPermalinks);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">
        카테고리
      </label>
      <MultipleSelector
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        placeholder="카테고리를 선택하세요"
      />
      <p className="text-sm text-gray-500 mt-1">
        작성할 기사가 속할(한) 카테고리를 선택(추가)하세요.
      </p>
    </div>
  );
};

export default CategoryInput;
