"use server";

import { revalidateTag } from "next/cache";

export async function createReviewAction(_: any, formdata: FormData) {
  //FormDataEntryValue 는 기본적으로 type은 string or file type을 의미한다.
  const bookId = formdata.get("bookId")?.toString();
  const content = formdata.get("content")?.toString();
  const author = formdata.get("author")?.toString();

  if (!content || !author || !bookId) {
    return {
      status: false,
      error: "리뷰 내용과 작성자를 입력해주세요",
    };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review`,
      { method: "POST", body: JSON.stringify({ bookId, content, author }) }
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    //revalidatePath안에 인수로 넣은 경로를 토대로
    //next서버측에서 리뷰 작성시 재검증을 통하여 자동으로 새로고침을 한다.
    //실시간으로 리뷰가 작성되는 것을 볼 수 있다.

    //5. 태그 기준, 데이터 캐시 재검증
    revalidateTag(`review-${bookId}`);

    return {
      status: true,
      error: "",
    };
  } catch (error) {
    return {
      status: false,
      error: `리뷰 작성에 실패했습니다 ${error}`,
    };
  }
}
