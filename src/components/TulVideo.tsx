import SimplePlayer from '../common/Video';
import { Tul } from '../consts/tuls';

export const TulVideo = ({ selectedTul }: { selectedTul: Tul }) => {
  console.log('Selected Tul:', selectedTul);
  return <SimplePlayer />;
};
