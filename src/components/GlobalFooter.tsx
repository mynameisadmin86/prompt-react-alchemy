import React from 'react';
import { Button } from '@/components/ui/button';
import { useFooterStore } from '@/stores/footerStore';
import * as Icons from 'lucide-react';

export const GlobalFooter = () => {
  const { config } = useFooterStore();

  if (!config.visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-background border-t shadow-lg">
      {/* Left Buttons */}
      <div className="flex items-center gap-2">
        {config.leftButtons.map((button, index) => {
          if (button.type === 'Icon' && button.iconName) {
            const IconComponent = Icons[button.iconName as keyof typeof Icons] as React.ComponentType<any>;
            return (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={button.onClick}
                disabled={button.disabled}
                className="text-muted-foreground hover:text-foreground"
              >
                {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
                {button.label}
              </Button>
            );
          }
          return null;
        })}
      </div>

      {/* Right Buttons */}
      <div className="flex items-center gap-3">
        {config.rightButtons.map((button, index) => (
          <Button
            key={index}
            variant={index === config.rightButtons.length - 1 ? 'default' : 'outline'}
            size="sm"
            onClick={button.onClick}
            disabled={button.disabled || button.loading}
            className={index === config.rightButtons.length - 1 ? 'bg-primary hover:bg-primary/90' : ''}
          >
            {button.loading && <Icons.Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
