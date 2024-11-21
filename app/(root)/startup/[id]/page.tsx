import StartupCard, { startupCardType } from "@/components/StartupCard";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import {
  PLAYLIST_BY_SLUG_QUERY,
  STARTUP_BY_ID_QUERY,
} from "@/sanity/lib/queries";
import markdownit from "markdown-it";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const experimental_ppr = true;

const md = markdownit();

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const [post, { select: editorPosts }] = await Promise.all([
    client.fetch(STARTUP_BY_ID_QUERY, { id }),
    client.fetch(PLAYLIST_BY_SLUG_QUERY, {
      slug: "editor-picks",
    }),
  ]);

  if (!post) {
    return notFound();
  }

  const parsedContent = md.render(post?.pitch || "");

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>
      <section className="section_container">
        <img
          src={post.image}
          alt="thumbnail"
          className="w-full h-auto rounded-xl"
        />

        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex items-center gap-2  mb-3"
            >
              <Image
                src={post.author?.image}
                width={64}
                height={64}
                alt="avatar"
                className="rounded-full drop-shadow-lg"
              />
              <div>
                <p className="text-20-medium ">{post.author?.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{post.author?.username}
                </p>
              </div>
            </Link>
            <p className="category-tag">{post.category}</p>
          </div>
          <h3 className="text-30-bold">Pitch Details</h3>
          {parsedContent ? (
            <article
              dangerouslySetInnerHTML={{ __html: parsedContent }}
              className="prose"
            />
          ) : (
            <p className="no-result">No pitch details provided</p>
          )}
        </div>

        <hr className="divider" />

        {/* TODO: Editor selected startups */}
        {editorPosts.length > 0 && (
          <div className="max-w-4xl mx-auto ">
            <p className="text-30-semibold">Editor Picks</p>
            <ul className="mt-7 card_grid-sm">
              {editorPosts.map((post: startupCardType) => (
                <StartupCard key={post._id} post={post} />
              ))}
            </ul>
          </div>
        )}

        <div className="flex bg-black-200 w-full justify-start">
          <Suspense fallback={<Skeleton className="view_skeleton" />}>
            <View id={post._id} />
          </Suspense>
        </div>
      </section>
    </>
  );
};

export default page;
