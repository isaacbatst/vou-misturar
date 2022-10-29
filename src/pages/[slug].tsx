import { Mix } from "@prisma/client";
import { GetStaticProps } from "next";
import Link from "next/link";
import prisma from "../prisma";

type Props = {
  mix: Mix
}

const MixPage: React.FC<Props> = ({ mix }) => {
  const { canMix, description, products: [productA, productB], sources } = mix;

  return <div>
    <header><h1>Vou misturar...</h1></header>
    <section>
      <div>{ productA.name }</div>
      <div>com</div>
      <div>{ productB.name }</div>
    </section>
    <section>
      { canMix }
    </section>
    <section>
      <h2>Por que?</h2>
      <div>{ description }</div>
    </section>
    <section>
      <h2>Fontes</h2>
      {
        sources.map(source => (
          <Link key={source.title} href={source.link}>{source.title}</Link>
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
