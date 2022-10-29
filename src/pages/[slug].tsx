import { CanMixAnswer, Mix } from "@prisma/client";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import prisma from "../prisma";

type Props = {
  mix: Mix
}

type CanMixMap = Record<CanMixAnswer, {
  friendlyText: string,
  className: string
}>

const canMixMap: CanMixMap = {
  depends: {
    friendlyText: 'Depende.',
    className: 'bg-orange-300'
  },
  no: {
    friendlyText: 'Não misture. 🚨',
    className: 'bg-orange-300'
  },
  yes: {
    friendlyText: 'Liberado. ✔️',
    className: 'bg-green-400'
  }
}

const MixPage: NextPage<Props> = ({ mix }) => {
  const { canMix, description, products: [productA, productB], sources, why } = mix;
  const { friendlyText: canMixFriendlyText, className: canMixClassName } = canMixMap[canMix];

  return <div>
    <Head>
      <title>Pode misturar {productA.name} e {productB.name}?</title>
      <meta
          name="description"
          content={description}
          key="desc"
        />
    </Head>
    <header className="bg-violet-900 text-white">
      <h1 className="font-bold py-4 text-center">Vou misturar...</h1>
    </header>
    <section className="bg-violet-900">
      <section className="bg-violet-500 text-white text-center py-6 rounded-t-3xl">
        <h2 className="font-bold text-lg">
        { productA.name } <span className="font-normal text-sm px-1">com</span> { productB.name }
        </h2>
      </section>
    </section>
    <section className={`py-9 text-center ${canMixClassName}`}>
      <h2 className="font-bold text-2xl">{ canMixFriendlyText }</h2>
    </section>
    <section className="bg-stone-100 py-5 px-2 text-center">
      <h2 className="font-bold text-lg mb-3">Por que?</h2>
      <div className="font-light text-sm">{ why }</div>
    </section>
    <section className="bg-white py-5 px-2 text-center">
      <h2 className="font-bold text-lg mb-3">Fontes</h2>
      {
        sources.map(source => (
          <div key={source.text} >
            <Link className="font-light text-sm underline text-blue-400 visited:text-purple-700 active:text-blue-700" 
              href={source.link}>
              {source.text}
            </Link>
          </div>
        ))
      }
    </section>
  </div>
}

export default MixPage;


export const getStaticPaths = async () => {
  const mixes = await prisma.mix.findMany();

  return {
    paths: mixes.map(mix => ({ params: { slug: mix.slug } })),
    fallback: false, // can also be true or 'blocking'
  }
}

type Params = { slug: string }

export const getStaticProps: GetStaticProps<Props, Params> = async (context) => {
  const mix = await prisma.mix.findUnique({ where: { slug: context.params?.slug } })

  if(!mix) throw new Error('MIX_NOT_FOUND')

  return {
    // Passed to the page component as props
    props: {  
      mix
    },
  }
}