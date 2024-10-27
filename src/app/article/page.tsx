"use client";
import dynamic from "next/dynamic";

const CustomArticle = dynamic(
  () => import("@/components/article/customArticle"),
  {
    ssr: false,
  }
);

const ArticlePage = () => {
  return <CustomArticle />;
};

export default ArticlePage;
