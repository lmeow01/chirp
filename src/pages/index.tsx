import Head from "next/head";
import Link from "next/link";
import { RouterOutputs, api } from "~/utils/api";
import { SignIn, UserButton, useUser } from "@clerk/nextjs";
import Image  from 'next/image'

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingPage, LoadingSpinner, LoadingSpinning } from "~/components/loading";

dayjs.extend(relativeTime);


const CreatePostWizard = () => {
  const { user } = useUser();

  console.log(user)
  if (!user) return null;

  return (
    <div className="flex gap-3 w-full ">
      <Image src={user.imageUrl} alt="Profile Image" className="w-16 h-16 rounded-full" width={56} height={56} />
      <input placeholder="Type some emojis!" className="grow bg-transparent outline-none"/>
    </div>
  )
}

type PostWithUser = RouterOutputs["posts"]["getAll"][number]

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex border-b border-slate-400 p-4 gap-3">
      <Image src={author.imageUrl} className="w-16 h-16 rounded-full" alt={`@${author.username}'s profile picture`} width={56} height={56}/>
      <div className="flex flex-col">
        <div className="flex text-slate-300 gap-1">
          <span>{`@${author.username!}`} </span>
          <span className="font-thin">{`·   ${dayjs(post.createdAt).fromNow()}`}</span>
        </div>
        <span className="text-2xl">{post.content} </span>
      </div>
      
      </div>
  )
}

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage />

  if (!data) return <div>Something went wrong</div>

  return (
    <div className="flex flex-col">
      {data?.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  )
}

export default function Home() {
  const { user, isLoaded: userLoaded, isSignedIn }= useUser();

  // Start fetching asap
  api.posts.getAll.useQuery();

  // Return empty div if user isnt loaded
  if (!userLoaded) return <div />

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className= "w-full h-full border-x border-slate-400 md:max-w-2xl">
          <SignIn />
          <div className="border-b border-slate-400 p-4 ">
            <div className="flex justify-center">
              <CreatePostWizard />
            </div>
            
          </div>
          
          <Feed />
        </div>
        
      </main>
    </>
  );
}
