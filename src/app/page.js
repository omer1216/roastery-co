import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import StoryStrip from "@/components/home/StoryStrip";
import SignaturePicks from "@/components/home/SignaturePicks";
import Testimonials from "@/components/home/Testimonials";
import Reveal from "@/components/Reveal";
import { getPopularItems } from "@/lib/menu";

export const revalidate = 60;

export default async function HomePage() {
  const popularItems = await getPopularItems();

  return (
    <>
      <Hero />
      <Reveal>
        <HowItWorks />
      </Reveal>
      <Reveal>
        <StoryStrip />
      </Reveal>
      <Reveal>
        <SignaturePicks items={popularItems} />
      </Reveal>
      <Reveal>
        <Testimonials />
      </Reveal>
    </>
  );
}