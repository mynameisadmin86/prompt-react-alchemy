import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DrawerLayoutProps {
  title: string;
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  className?: string;
}

export const DrawerLayout: React.FC<DrawerLayoutProps> = ({
  title,
  leftPanel,
  rightPanel,
  footer,
  onClose,
  className
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "flex flex-col h-full bg-background shadow-2xl rounded-l-2xl overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30 sticky top-0 z-20">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Body - Split into Left and Right Panels */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 overflow-y-auto">
        {/* Left Panel */}
        <div className="space-y-4">
          {leftPanel}
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {rightPanel}
        </div>
      </div>

      {/* Footer */}
      {footer && (
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/30 sticky bottom-0 z-20">
          {footer}
        </div>
      )}
    </motion.div>
  );
};
