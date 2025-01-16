import style from "./page.module.css";
import ReviewItem from "@/components/review-item";
import ReviewEditor from "@/components/review-editor";
import Image from "next/image";

import { notFound } from "next/navigation";
import { BookData, ReviewData } from "@/types";

type Params = Promise<{ id: string }>;

export async function generateStaticParams() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book`
    );

    if (!response.ok) {
      console.error(`Failed to fetch books: ${response.statusText}`);
      return []; // 빈 배열 반환
    }

    const books: BookData[] = await response.json();

    return books.map((book) => ({ id: book.id.toString() }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return []; // 에러 시 빈 배열 반환
  }
}

async function BookDetail({ bookId }: { bookId: string }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${bookId}`,
    { cache: "force-cache" }
  );

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    return <div>오류가 발생하였습니다...</div>;
  }

  const book = await response.json();

  const { title, subTitle, description, author, publisher, coverImgUrl } = book;

  return (
    <section>
      <div
        className={style.cover_img_container}
        style={{ backgroundImage: `url('${coverImgUrl}')` }}
      >
        <Image
          src={coverImgUrl}
          width={240}
          height={300}
          alt={`도서 ${title}의 표지 이미지`}
        />
      </div>
      <div className={style.title}>{title}</div>
      <div className={style.subTitle}>{subTitle}</div>
      <div className={style.author}>
        {author} | {publisher}
      </div>
      <div className={style.description}>{description}</div>
    </section>
  );
}

async function ReviewList({ bookId }: { bookId: string }) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review/book/${bookId}`,
      { next: { tags: [`review-${bookId}`] } }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch reviews: ${response.status} ${response.statusText}`
      );
      return (
        <section>
          <div>리뷰 데이터를 불러오는 데 실패했습니다.</div>
        </section>
      );
    }

    const reviews: ReviewData[] = await response.json();

    if (!reviews || reviews.length === 0) {
      return <section>리뷰가 없습니다.</section>;
    }

    return (
      <section>
        {reviews.map((review) => (
          <ReviewItem key={review.id} {...review} />
        ))}
      </section>
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return (
      <section>
        <div>리뷰 데이터를 불러오는 데 실패했습니다.</div>
      </section>
    );
  }
}

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${id}`
  );

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const book: BookData = await response.json();

  return {
    title: `${book.title} - 한입북스`,
    description: `${book.description}`,
    openGraph: {
      title: `${book.title} - 한입북스`,
      description: `${book.description}`,
      image: [book.coverImgUrl],
    },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;
  return (
    <div className={style.container}>
      <BookDetail bookId={id} />
      <ReviewEditor bookId={id} />
      <ReviewList bookId={id} />
    </div>
  );
}
