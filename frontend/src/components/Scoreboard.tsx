import { motion, AnimatePresence } from 'framer-motion';
import { TeamScore } from '../types';
import { TeamCard } from './TeamCard';
import './Scoreboard.css';

interface ScoreboardProps {
  teams: TeamScore[];
}

export function Scoreboard({ teams }: ScoreboardProps) {
  return (
    <div className="scoreboard">
      <AnimatePresence>
        {teams.map((teamScore) => (
          <motion.div
            key={teamScore.team.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              layout: { duration: 0.5, ease: 'easeInOut' },
              opacity: { duration: 0.3 },
              y: { duration: 0.3 }
            }}
          >
            <TeamCard teamScore={teamScore} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
