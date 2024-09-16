"use client";
import AuthorForm from "@/components/authors/authorForm";
import AuthorList from "@/components/authors/authorList";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const AuthorPage = () => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNew = () => {
    setIsAdding(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">에디터 관리</h1>
      <AuthorList />
      <div className="mt-8">
        <Button onClick={handleAddNew} className="w-full">
          새 에디터 추가
        </Button>
      </div>
      {isAdding && <AuthorForm onClose={() => setIsAdding(false)} />}
    </div>
  );
};

export default AuthorPage;
