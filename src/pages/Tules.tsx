import { Link } from 'react-router-dom';
import { tuls, Tul } from '../consts/tuls';

export const Tules = () => {
  return (
    <section className="flex flex-col gap-2 pt-4">
      <h1 className="text-xl">Selecciona tu tul</h1>
      <article className="grid grid-cols-2 gap-3">
        {tuls.map((tul) => (
          <TulCard key={tul.id} tul={tul} />
        ))}
      </article>
    </section>
  );
};

const TulCard = ({ tul }: { tul: Tul }) => {
  return (
    <Link
      to={`/tul/${tul.id}`}
      className="flex flex-col gap-4 pb-4 bg-white rounded-b-md"
    >
      <img src="/imgs/Rectangle.png" alt="Tul" />
      <div className="flex flex-col px-6">
        <h2 className="text-lg font-medium">{tul.name}</h2>
        <p className="text-sm">{tul.moves} movimientos</p>
      </div>
    </Link>
  );
};
