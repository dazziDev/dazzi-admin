import { useEditorStore } from "@/store/editorStore";
import Image from "next/image";
import { useState } from "react";
// 이학찬-LeeHakchan
// 이현우-LeeHyunwoo
// 황용하-HwangYongha
// 정현탁-JungHyuntak
// 박정훈-ParkJunghoon
// 박동민-ParkDongmin
// 박형일-ParkHyungil
// 장태호-JangTaeho
const avatars = [
  { name: "이현우", src: "/admin/ParkJunghoon.webp" },
  { name: "황용하", src: "/admin/ParkJunghoon.webp" },
  { name: "이학찬", src: "/admin/ParkJunghoon.webp" },
  { name: "박동민", src: "/admin/ParkDongmin.webp" },
  { name: "정현탁", src: "/admin/ParkJunghoon.webp" },
  { name: "장태호", src: "/admin/ParkJunghoon.webp" },
  { name: "박형일", src: "/admin/ParkJunghoon.webp" },
  { name: "박정훈", src: "/admin/ParkJunghoon.webp" },
];

const AvatarSelector = () => {
  const { setSelectedAuthor } = useEditorStore();
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const handleAvatarClick = (name: string) => {
    const selectedAvatar = avatars.find((avatar) => avatar.name === name);
    if (selectedAvatar) {
      setSelectedName(name);
      setSelectedAuthor(selectedAvatar);
    }
  };

  return (
    <div className="flex justify-center space-x-4 mt-4 mb-4">
      {avatars.map((avatar) => (
        <div
          key={avatar.name}
          className={`group cursor-pointer text-center transition-transform duration-300 ${
            selectedName === avatar.name ? "scale-110" : "opacity-50"
          }`}
          onClick={() => handleAvatarClick(avatar.name)}
        >
          <div className="relative">
            <Image
              src={avatar.src}
              alt={avatar.name}
              width={60}
              height={60}
              className={`rounded-full shadow-md transition-all duration-300 ${
                selectedName === avatar.name
                  ? "ring-4 ring-blue-500 opacity-100"
                  : "group-hover:opacity-75 group-hover:brightness-110"
              }`}
            />
          </div>
          <p
            className={`mt-2 text-sm font-semibold transition-all duration-300 ${
              selectedName === avatar.name
                ? "text-gray-900"
                : "text-gray-500 group-hover:text-gray-700"
            }`}
          >
            {avatar.name}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AvatarSelector;
