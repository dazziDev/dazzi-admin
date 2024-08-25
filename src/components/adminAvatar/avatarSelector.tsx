import { initialAuthors, useEditorStore } from "@/store/editorStore";
import Image from "next/image";
import { useState } from "react";

const AvatarSelector = () => {
  const { setSelectedAuthor } = useEditorStore();
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const handleAvatarClick = (name: string) => {
    const selectedAvatar = initialAuthors.find(
      (avatar) => avatar.name === name
    );
    if (selectedAvatar) {
      setSelectedName(name);
      setSelectedAuthor(selectedAvatar);
    }
  };

  return (
    <div className="flex justify-center space-x-4 mt-4 mb-4">
      {initialAuthors.map((avatar) => (
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
