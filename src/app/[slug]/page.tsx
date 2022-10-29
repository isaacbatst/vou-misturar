import { CanMixAnswer } from "@prisma/client";
import Link from "next/link";
import prisma from "../../prisma";

type Props = {
  params: { slug: string }
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

const MixPage = async ({ params: { slug } }: Props) => {
  const mix = await prisma.mix.findUnique({ where: { slug } })

  if(!mix) throw new Error('MIX_NOT_FOUND');

  const { canMix, description, products: [productA, productB], sources } = mix;
  const { friendlyText: canMixFriendlyText, className: canMixClassName } = canMixMap[canMix];

  return <div>
    <header className="bg-violet-900 text-white">
      <h1 className="font-bold py-4 text-center">Vou misturar...</h1>
    </header>
    <section className="bg-violet-500 text-white text-center py-6">
      <h2 className="font-bold text-lg mb-3">{ productA.name }</h2>
      <div className="font-normal text-sm mb-3">com</div>
      <h2 className="font-bold text-lg mb-3">{ productB.name }</h2>
    </section>
    <section className={`py-9 text-center ${canMixClassName}`}>
      <h2 className="font-bold text-2xl">{ canMixFriendlyText }</h2>
    </section>
    <section className="bg-stone-100 py-5 px-2 text-center">
      <h2 className="font-bold text-lg mb-3">Por que?</h2>
      <div className="font-light text-sm">{ description }</div>
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

export async function generateStaticParams() {
  const mixes = await prisma.mix.findMany();

  return mixes.map((mix) => ({
    slug: mix.slug,
  }));
}
