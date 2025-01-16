import BookItem from "@/components/book-item";

import { BookData } from "@/types";

import { Metadata } from "next";
import { Suspense } from "react";

type SearchParams = Promise<{ q?: string }>;

async function SearchResult({ q }: { q: string }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/search?q=${q}`,
    { cache: "force-cache" }
  );
  if (!response.ok) {
    return <div>오류가 발생하였습니다.</div>;
  }

  const book: BookData[] = await response.json();

  return (
    <div>
      {book.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { q } = await searchParams;

  return {
    title: `${q} : 한입북스 검색`,
    description: `${q}의 검색 결과입니다.`,
    openGraph: {
      title: `${q} : 한입북스 검색`,
      description: `${q}의 검색 결과입니다.`,
      images: ["/thumbnail.png"],
    },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense
      key={(await searchParams).q || ""}
      fallback={<div>로딩중 ...</div>}
    >
      <SearchResult q={(await searchParams).q || ""} />
    </Suspense>
  );
}
