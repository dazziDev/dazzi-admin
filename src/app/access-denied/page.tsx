export default function AccessDenied() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">접근이 제한되었습니다</h1>
        <p>이 계정으로는 접근할 수 없습니다. 관리자에게 문의하세요.</p>
      </div>
    </div>
  );
}
