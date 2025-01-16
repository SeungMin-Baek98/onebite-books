"use client";

import { deleteReviewAction } from "@/actions/delete-review.action";
import { useActionState, useEffect, useRef } from "react";

export default function ReviewItemDeleteButton({
  bookId,
  reviewId,
}: {
  bookId: number;
  reviewId: number;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    deleteReviewAction,
    null
  );

  useEffect(() => {
    if (state && !state.error) {
      alert(state.error);
    }
  }, [state]);

  const handleDelete = () => {
    const confirmDelete = window.confirm("댓글을 정말 삭제하시겠습니까?");
    if (confirmDelete) {
      formRef.current?.requestSubmit();
    }
  };

  return (
    <form ref={formRef} action={formAction}>
      <input name="reviewId" value={reviewId} hidden readOnly />
      <input name="bookId" value={bookId} hidden readOnly />
      {isPending ? <div>...</div> : <div onClick={handleDelete}>삭제하기</div>}
    </form>
  );
}
