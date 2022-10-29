import Link from "next/link";
import prisma from "../../prisma";

type Props = {
  params: { slug: string }
}

const MixPage = async ({ params: { slug } }: Props) => {
  const mix = await prisma.mix.findUnique({ where: { slug } })

  if(!mix) throw new Error('MIX_NOT_FOUND');

  const { canMix, description, products: [productA, productB], sources } = mix;

  return <div>
    <header className="bg-violet-900"><h1>Vou misturar...</h1></header>
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

export async function generateStaticParams() {
  const mixes = await prisma.mix.findMany();

  return mixes.map((mix) => ({
    slug: mix.slug,
  }));
}
