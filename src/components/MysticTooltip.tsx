import React from 'react';
import { Tooltip } from '@base-ui-components/react/tooltip';
import { motion } from 'motion/react';

interface MysticTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export const MysticTooltip: React.FC<MysticTooltipProps> = ({
  content,
  children,
  side = 'top',
}) => {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger className="inline-flex cursor-pointer">
        {children}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner side={side} sideOffset={8}>
          <Tooltip.Popup>
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: side === 'top' ? 6 : -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: side === 'top' ? 6 : -6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="z-[9999] px-3 py-2 text-xs font-serif text-amber-100 bg-neutral-950/95 border border-amber-500/40 rounded-xl shadow-[0_8px_25px_rgba(0,0,0,0.6)] backdrop-blur-md max-w-xs text-center pointer-events-none relative"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none rounded-xl" />
              <div className="relative z-10">
                {content}
              </div>
              <Tooltip.Arrow className="fill-neutral-950 stroke-amber-500/40" />
            </motion.div>
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
};
