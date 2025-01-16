"use client";

import { useRouter } from "next/navigation";
import { startTransition, useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.log(error.message);
  }, [error]);
  return (
    <div>
      <h3>검색과정에서 오류가 발생하였습니다.</h3>
      <button
        onClick={() => {
          startTransition(() => {
            router.refresh(); // 현재 페이지에 필요한 서버컴포넌들을 다시 실행하여 결과값을 화면에 update해주는 메서드. refresh() <-- error상태를 초기화 하지는 못한다.
            // 그래서 reset() 메서드를 다시 한 번 호출해 줘야 한다.

            reset(); // 에러 상태를 초기화하고 컴포넌트들을 다시 초기화한다.
          });
        }}
      >
        다시 시도
      </button>
    </div>
  );
}
