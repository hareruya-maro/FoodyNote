import './index.css';
import { Composition } from 'remotion';
import { MyComposition } from './Composition';

export const RemotionRoot: React.FC = () => {
    return (
        <Composition
            id="FoodyNoteDemo"
            component={MyComposition}
            durationInFrames={6060} // 3 mins 22 secs * 30 fps
            fps={30}
            width={1920}
            height={1080}
        />
    );
};
