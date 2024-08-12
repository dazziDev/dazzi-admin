"use client";
import dynamic from "next/dynamic";

const CustomEditor = dynamic(() => import("@/components/editor/customEditor"), {
  ssr: false,
});

const EditorPage: React.FC = () => {
  return <CustomEditor />;
};

export default EditorPage;
