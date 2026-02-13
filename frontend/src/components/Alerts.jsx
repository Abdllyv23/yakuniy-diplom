import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function Alerts() {
  const { alerts } = useApp();
  return (
    <div className="alerts">
      <AnimatePresence>
        {alerts.map((a) => (
          <motion.div key={a.id} className={`alert ${a.type}`} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {a.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
