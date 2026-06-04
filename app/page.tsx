import { Bento } from "@/components/bento";
import { TrexRunner } from "@/components/trex-runner";

export default function Home() {
  return (
    <>
      <div className="w-full flex items-center justify-center max-w-5xl mx-auto">
        <div className="flex w-full flex-col items-center overflow-hidden">
          <div className="w-full py-2  px-2 lg:py-10 lg:px-4">
            <Bento />
          </div>
          {/* Easter egg: the Chrome dino game, all the way at the bottom. */}
          <div className="w-full px-2 pb-8 lg:px-4 lg:pb-12">
            <TrexRunner />
          </div>
        </div>
      </div>
    </>
  );
}
