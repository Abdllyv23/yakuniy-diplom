import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function Alerts() {
  const { alerts } = useApp();
  return (
    <div className="alerts">
      <AnimatePresence>
        {alerts.map((a) => (
          <motion.div key={a.id} className={`alert ${a.type}`} initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 80, opacity: 0 }}>
            {a.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
