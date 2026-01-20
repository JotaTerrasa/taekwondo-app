import { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, RotateCcw } from 'lucide-react';
import { VocabularyItem } from '../consts/vocabulary';

type QuizProps = {
  items: VocabularyItem[];
  onBack: () => void;
};

type QuizQuestion = {
  question: VocabularyItem;
  options: string[];
  correctAnswer: string;
};

export const Quiz = ({ items, onBack }: QuizProps) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    generateQuestions();
  }, [items]);

  const generateQuestions = () => {
    const shuffled = [...items].sort(() => Math.random() - 0.5).slice(0, 10);
    const newQuestions: QuizQuestion[] = shuffled.map((item) => {
      // Crear opciones incorrectas
      const wrongAnswers = items
        .filter((i) => i.spanish !== item.spanish)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((i) => i.spanish);

      const options = [...wrongAnswers, item.spanish].sort(() => Math.random() - 0.5);

      return {
        question: item,
        options,
        correctAnswer: item.spanish,
      };
    });

    setQuestions(newQuestions);
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setAnswered(false);
  };

  const handleAnswer = (answer: string) => {
    if (answered) return;

    setSelectedAnswer(answer);
    setAnswered(true);
    const correct = answer === questions[currentIndex].correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setAnswered(false);
      setIsCorrect(null);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    generateQuestions();
  };

  if (questions.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-12">
        <p className="theme-text-muted">No hay suficientes palabras para el quiz</p>
        <button
          onClick={onBack}
          className="text-primary-500 hover:underline"
        >
          Volver
        </button>
      </section>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <section className="flex flex-col items-center gap-6 pt-4">
        <div className="flex flex-col items-center gap-4 p-8 theme-bg-card rounded-xl shadow-lg">
          <div className="text-6xl font-bold text-primary-500">{percentage}%</div>
          <p className="text-xl font-semibold">
            {score} de {questions.length} correctas
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-3 text-white rounded-lg theme-btn"
            >
              <RotateCcw className="w-4 h-4" />
              Intentar de nuevo
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 theme-text-primary theme-bg-tertiary rounded-lg hover:theme-hover"
            >
              Volver
            </button>
          </div>
        </div>
      </section>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <section className="flex flex-col gap-6 pt-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary-500 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
        <div className="text-sm theme-text-muted">
          Pregunta {currentIndex + 1} de {questions.length}
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="w-full h-2 overflow-hidden theme-bg-tertiary rounded-full">
        <div
          className="h-full transition-all duration-300 rounded-full bg-primary-500"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Pregunta */}
        <div className="flex flex-col items-center gap-4 p-8 theme-bg-card rounded-xl shadow-lg">
        <div className="text-center">
          <p className="text-3xl font-bold theme-text-primary mb-2">
            {currentQuestion.question.korean}
          </p>
          <p className="text-lg theme-text-muted italic">
            {currentQuestion.question.pronunciation}
          </p>
        </div>

        <p className="text-sm text-gray-400">¿Cuál es el significado en español?</p>

        {/* Opciones */}
        <div className="grid w-full gap-3 mt-4">
          {currentQuestion.options.map((option, index) => {
            let buttonClass = 'p-4 text-left border-2 rounded-lg transition-all ';
            
            if (answered && option === currentQuestion.correctAnswer) {
              buttonClass += 'bg-green-50 border-green-500 text-green-700';
            } else if (answered && option === selectedAnswer && !isCorrect) {
              buttonClass += 'bg-red-50 border-red-500 text-red-700';
            } else if (selectedAnswer === option && !answered) {
              buttonClass += 'border-primary-500 bg-primary-50';
            } else {
              buttonClass += 'theme-border hover:border-primary-300 theme-bg-card';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={answered}
                className={buttonClass}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {answered && option === currentQuestion.correctAnswer && (
                    <Check className="w-5 h-5 text-green-500" />
                  )}
                  {answered && option === selectedAnswer && option !== currentQuestion.correctAnswer && (
                    <X className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Botón siguiente */}
        {answered && (
          <button
            onClick={handleNext}
            className="w-full px-6 py-3 mt-4 text-white rounded-lg theme-btn"
          >
            {currentIndex < questions.length - 1 ? 'Siguiente' : 'Ver resultados'}
          </button>
        )}
      </div>

      {/* Puntuación actual */}
      <div className="text-center text-sm theme-text-muted">
        Puntuación: {score} / {currentIndex + 1}
      </div>
    </section>
  );
};
