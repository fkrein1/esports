interface GameBannerProps {
  bannerUrl: string;
  title: string;
  addsCount: number;
  index: number;
}

export function GameBanner(props: GameBannerProps) {
  const keenSliderNumber = `number-slide${props.index}`
  return (
    <div className={`keen-slider__slide relative rounded-lg overflow-hidden ${keenSliderNumber}`}>
      <img src={props.bannerUrl} alt="" />
      <div className="w-full pt-16 pb-4 px-4 bg-game-gradient absolute bottom-0 left-0 right-0">
        <strong className="font-bold text-white block">{props.title}</strong>
        <span className="text-zinc-300 text-sm">
          {props.addsCount} anúncio(s)
        </span>
      </div>
    </div>
  );
}
