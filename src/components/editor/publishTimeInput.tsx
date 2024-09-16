import { useEditorStore } from "@/store/editorStore";
import { ko } from "date-fns/locale";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PublishTimeInput = () => {
  const { setPublishTime, setIsSubmitDisabled } = useEditorStore();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [isInvalidTime, setIsInvalidTime] = useState(false);
  const [timeUntilPublish, setTimeUntilPublish] = useState("");

  const handleChange = (date: Date | null) => {
    setStartDate(date);
    if (date) {
      // yyyymmddhhmm 형식 확인해야함
      // yyyymmddhhmm 형식 확인해야함
      // yyyymmddhhmm 형식 확인해야함
      const formattedDate = date
        .toISOString()
        .replace(/[-:]/g, "")
        .slice(0, 12);
      setPublishTime(formattedDate);
    } else {
      // 즉시 공개라는 의미임(undefined)
      setPublishTime(undefined);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const updateTimeUntilPublish = () => {
      if (startDate) {
        const now = new Date();
        if (startDate <= now) {
          setIsInvalidTime(true);
          setTimeUntilPublish("");
          setIsSubmitDisabled(true);
        } else {
          setIsInvalidTime(false);
          const diff = startDate.getTime() - now.getTime();

          const totalSeconds = Math.floor(diff / 1000);
          const days = Math.floor(totalSeconds / (60 * 60 * 24));
          const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
          const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
          const seconds = totalSeconds % 60;

          setTimeUntilPublish(
            `기사 공개까지 ${days}일 ${hours}시간 ${minutes}분 ${seconds}초 남았습니다.`
          );
          setIsSubmitDisabled(false);
        }
      } else {
        setIsInvalidTime(false);
        setTimeUntilPublish("");
        setIsSubmitDisabled(false);
      }
    };
    // 초기 실행
    updateTimeUntilPublish();
    // 1초마다 업데이트
    intervalId = setInterval(updateTimeUntilPublish, 1000);
    // 컴포넌트 언마운트 시 인터벌 제거
    return () => clearInterval(intervalId);
  }, [startDate, setIsSubmitDisabled]);

  return (
    <div className="mb-4">
      <label
        htmlFor="publishTime"
        className="block text-sm font-medium text-gray-700"
      >
        기사 공개 시간
      </label>
      <DatePicker
        id="publishTime"
        selected={startDate}
        onChange={handleChange}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={30}
        dateFormat="yyyy-MM-dd HH:mm"
        locale={ko}
        placeholderText="공개 시간을 선택하세요"
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
      />
      {isInvalidTime && (
        <p className="text-red-500 text-sm mt-1">
          선택한 시간은 현재 시간보다 이전입니다.
        </p>
      )}
      {!isInvalidTime && timeUntilPublish && (
        <p className="text-green-500 text-sm mt-1">{timeUntilPublish}</p>
      )}
    </div>
  );
};

export default PublishTimeInput;
