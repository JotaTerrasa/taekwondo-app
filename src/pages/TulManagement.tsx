import { useState } from 'react';
import { Button } from '../common/Button';
import { tuls } from '../consts/tuls';
import { TulVideo } from '../components/TulVideo';

export const TulManagement = () => {
  const [watchingTul, setWatchingTul] = useState<boolean>(false);

  const currentUrl = window.location.href;

  const selectedTul = tuls.find(
    (tul) => tul.id === currentUrl.split('/').at(-1)
  );

  if (!selectedTul) {
    return <div>Tul no encontrado</div>;
  }

  if (watchingTul) {
    return <TulVideo selectedTul={selectedTul} />;
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-medium">{selectedTul.name}</h1>
          <p className="text-xl">{selectedTul.korean_name}</p>
        </div>
        <p className="text-lg">{selectedTul.moves} movimientos</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xl font-semibold">Diagrama</p>
        <img src={selectedTul.diagram} alt="Diagrama del tul" />
      </div>
      <Button
        handleClick={() => {
          setWatchingTul(true);
        }}
      >
        Ver forma
      </Button>
      <div className="flex flex-col gap-2">
        <p className="text-xl font-semibold">Significado</p>
        <p>{selectedTul.meaning}</p>
      </div>
    </section>
  );
};
