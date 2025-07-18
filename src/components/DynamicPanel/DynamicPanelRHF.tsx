import React from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FieldConfig } from '@/types/dynamicPanel';

interface FieldRendererRHFProps {
  config: FieldConfig;
  name: string;
}

const FieldRendererRHF: React.FC<FieldRendererRHFProps> = ({ config, name }) => {
  const { register, formState: { errors } } = useFormContext();
  const { fieldType, editable, placeholder, mandatory } = config;

  if (!editable) {
    return (
      <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded border min-h-[32px] flex items-center">
        -
      </div>
    );
  }

  const baseInputClasses = "h-8 text-xs border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
  
  const validation = {
    required: mandatory ? `${config.label} is required` : false
  };

  switch (fieldType) {
    case 'text':
      return (
        <Input
          type="text"
          placeholder={placeholder}
          className={baseInputClasses}
          {...register(name, validation)}
        />
      );

    case 'textarea':
      return (
        <Textarea
          placeholder={placeholder}
          className="min-h-[60px] text-xs border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          {...register(name, validation)}
        />
      );

    default:
      return (
        <Input
          type="text"
          placeholder={placeholder}
          className={baseInputClasses}
          {...register(name, validation)}
        />
      );
  }
};

interface DynamicPanelRHFProps {
  panelId: string;
  panelTitle: string;
  fields: FieldConfig[];
  defaultValues?: Record<string, any>;
  onSubmit?: (data: Record<string, any>) => void;
}

export const DynamicPanelRHF: React.FC<DynamicPanelRHFProps> = ({
  panelId,
  panelTitle,
  fields,
  defaultValues = {},
  onSubmit
}) => {
  const methods = useForm({
    defaultValues,
    shouldUnregister: false
  });

  const { handleSubmit, formState: { errors } } = methods;

  const visibleFields = fields
    .filter(field => field.visible)
    .sort((a, b) => a.order - b.order);

  const getFieldWidthClass = (fieldWidth?: 'third' | 'half' | 'two-thirds' | 'full') => {
    switch (fieldWidth) {
      case 'third':
        return 'col-span-4';
      case 'half':
        return 'col-span-6';
      case 'two-thirds':
        return 'col-span-8';
      case 'full':
      default:
        return 'col-span-12';
    }
  };

  const onFormSubmit = (data: Record<string, any>) => {
    onSubmit?.(data);
  };

  return (
    <FormProvider {...methods}>
      <Card className="col-span-12 border border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-purple-500 rounded"></div>
            <CardTitle className="text-sm font-medium text-gray-700">{panelTitle}</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="px-4 pb-4">
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="grid grid-cols-12 gap-4">
              {visibleFields.map((fieldConfig) => (
                <div key={fieldConfig.id} className={`space-y-1 ${getFieldWidthClass(fieldConfig.width)}`}>
                  <Label className="text-xs font-medium text-gray-600 block">
                    {fieldConfig.label}
                    {fieldConfig.mandatory && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </Label>
                  <FieldRendererRHF
                    config={fieldConfig}
                    name={fieldConfig.id}
                  />
                  {errors[fieldConfig.id] && (
                    <span className="text-xs text-red-500">
                      {errors[fieldConfig.id]?.message as string}
                    </span>
                  )}
                </div>
              ))}
            </div>
            
            {visibleFields.length === 0 && (
              <div className="text-center text-gray-500 py-8 text-sm">
                No visible fields configured.
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
};