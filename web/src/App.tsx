import * as Dialog from '@radix-ui/react-dialog';
import axios from 'axios';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { useEffect, useState } from 'react';
import { CreateAdBanner } from './components/CreateAdBanner';
import { CreateAdModal } from './components/CreateAdModal';
import { GameBanner } from './components/GameBanner';
import './styles/main.css';

export interface Game {
  id: string;
  title: string;
  bannerUrl: string;
  _count: {
    ads: number;
  };
}

function App() {
  const [options, setOptions] = useState({});
  const [games, setGames] = useState<Game[]>([]);
  const [ref] = useKeenSlider<HTMLDivElement>(options);

  useEffect(() => {
    const getGames = async () => {
      const response = await axios('http://localhost:3333/games');
      setGames(response.data);
      setTimeout(() => {
        setOptions({
          loop: true,
          mode: 'free-snap',
          slides: {
            perView: 6,
            spacing: 15,
          },
  
          breakpoints: {
            '(max-width: 1024px)': {
              slides: {
                perView: 3,
                spacing: 15,
              },
            },
            '(max-width: 640px)': {
              slides: {
                perView: 2,
                spacing: 15,
              },
            },
          },
        });
      }, 10);
    };
    getGames();
  }, []);

  return (
    <main className="mx-10 sm:mx-20">
      <div className="max-w-[1344px] flex flex-col items-center my-20 mx-auto">
        <img src="/logo.svg" className="h-32 h-sm:h-40" />
        <h1 className="text-6xl text-white font-black mt-20 text-center">
          Seu{' '}
          <span className="bg-nlw-gradient bg-clip-text text-transparent">
            duo
          </span>{' '}
          está aqui.
        </h1>

        <div className="keen-slider mt-20 flex" ref={ref}>
          {games.map((game) => (
            <GameBanner
              key={game.id}
              bannerUrl={game.bannerUrl}
              title={game.title}
              addsCount={game._count.ads}
            />
          ))}
        </div>
        <Dialog.Root >
          <CreateAdBanner />
          <CreateAdModal games={games} />
        </Dialog.Root>
      </div>
    </main>
  );
}

export default App;
