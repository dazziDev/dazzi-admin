"use client";
import dynamic from "next/dynamic";

const CustomEditor = dynamic(() => import("@/components/editor/customEditor"), {
  ssr: false,
});

const EditorPage = () => {
  return <CustomEditor />;
};

export default EditorPage;
