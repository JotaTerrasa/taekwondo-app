import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, TrendingUp } from 'lucide-react';
import { Exam, exams } from '../consts/exams';
import { useProgress } from '../context/ProgressContext';

type FilterType = 'all' | 'gup' | 'dan';

export const Exams = () => {
  const { currentBelt, getCompletedCount, getProgressPercentage } = useProgress();
  const currentExam = exams.find((e) => e.id === currentBelt);
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredExams = useMemo(() => {
    if (filter === 'all') {
      return exams;
    }
    return exams.filter((exam) => exam.type === filter);
  }, [filter]);

  const gupCount = exams.filter((e) => e.type === 'gup').length;
  const danCount = exams.filter((e) => e.type === 'dan').length;

  return (
    <section className="flex flex-col gap-4 pt-4">
      {/* Tarjeta de progreso */}
      <div className="p-4 text-white rounded-xl bg-gradient-to-br from-primary-500 to-red-700">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5" />
          <span className="font-medium">Tu progreso</span>
        </div>
        <div className="flex items-center gap-4">
          {currentExam && (
            <img 
              src={currentExam.img} 
              alt={currentExam.range} 
              className="w-16 p-1 bg-white rounded-lg"
            />
          )}
          <div className="flex-1">
            <p className="text-sm opacity-90">Cinturón actual</p>
            <p className="font-semibold">{currentExam?.range || 'Sin seleccionar'}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-2 overflow-hidden rounded-full bg-white/30">
                <div 
                  className="h-full transition-all duration-500 bg-white rounded-full"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
              <span className="text-xs font-medium">{getCompletedCount()}/17</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-xl">Selecciona tu examen</h1>
        
        {/* Filtros */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-primary-300'
            }`}
          >
            Todos ({exams.length})
          </button>
          <button
            onClick={() => setFilter('gup')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'gup'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-primary-300'
            }`}
          >
            GUP ({gupCount})
          </button>
          <button
            onClick={() => setFilter('dan')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'dan'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-primary-300'
            }`}
          >
            DAN ({danCount})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredExams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>
    </section>
  );
};

const ExamCard = ({ exam }: { exam: Exam }) => {
  return (
    <Link
      to={`/exam/${exam.id}`}
      className="flex items-center justify-between px-4 py-6 bg-white rounded-full shadow-xs hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3">
        <img src={exam.img} alt={exam.range} width={80} />
        <h2 className="font-semibold text-gray-800">{exam.range}</h2>
      </div>
      <ChevronRight color="#191919" size={20} />
    </Link>
  );
};
