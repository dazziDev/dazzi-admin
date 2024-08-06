"use client";
import dynamic from "next/dynamic";

const CustomEditor = dynamic(() => import("@/components/editor/customEditor"), {
  ssr: false,
});
const Editor: React.FC = () => (
  <div>
    <CustomEditor />
  </div>
);

export default Editor;
