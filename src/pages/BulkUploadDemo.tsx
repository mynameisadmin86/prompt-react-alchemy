import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DynamicBulkUpload } from '@/components/DynamicBulkUpload';
import { ColumnConfig, ValidationResult, UploadSummary } from '@/types/bulkUpload';
import { toast } from 'sonner';

export default function BulkUploadDemo() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Define column configuration for the upload
  const columnsConfig: ColumnConfig[] = [
    {
      fieldName: 'wagonNumber',
      displayName: 'Wagon Number',
      validationRules: {
        type: 'string',
        required: true,
        minLength: 3,
        maxLength: 20
      }
    },
    {
      fieldName: 'wagonType',
      displayName: 'Wagon Type',
      validationRules: {
        type: 'string',
        required: true
      }
    },
    {
      fieldName: 'capacity',
      displayName: 'Capacity (tons)',
      validationRules: {
        type: 'number',
        required: true,
        min: 1,
        max: 1000
      }
    },
    {
      fieldName: 'manufactureYear',
      displayName: 'Manufacture Year',
      validationRules: {
        type: 'number',
        required: false,
        min: 1900,
        max: new Date().getFullYear()
      }
    },
    {
      fieldName: 'status',
      displayName: 'Status',
      validationRules: {
        type: 'string',
        required: true,
        customValidator: (value: string) => {
          const validStatuses = ['active', 'maintenance', 'retired'];
          return validStatuses.includes(value.toLowerCase()) 
            ? null 
            : `Status must be one of: ${validStatuses.join(', ')}`;
        }
      }
    },
    {
      fieldName: 'ownerEmail',
      displayName: 'Owner Email',
      validationRules: {
        type: 'email',
        required: false,
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      }
    }
  ];

  // Simulate file upload to backend
  const handleUpload = async (file: File): Promise<any[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(`File ${file.name} uploaded successfully`);
    
    // Return mock processed data or throw error for demo
    return [
      {
        wagonNumber: 'WAG001',
        wagonType: 'Freight',
        capacity: 50,
        manufactureYear: 2020,
        status: 'active',
        ownerEmail: 'owner@example.com'
      },
      {
        wagonNumber: 'WAG002',
        wagonType: 'Passenger',
        capacity: 80,
        manufactureYear: 2018,
        status: 'maintenance',
        ownerEmail: 'invalid-email' // This will cause validation error
      }
    ];
  };

  // Validate uploaded data
  const handleValidate = (data: any[], columnsConfig: ColumnConfig[]): ValidationResult => {
    const errors: any[] = [];
    const validRows: any[] = [];
    const invalidRows: any[] = [];

    data.forEach((row, index) => {
      let hasError = false;
      const rowErrors: any[] = [];

      columnsConfig.forEach(config => {
        const value = row[config.fieldName];
        const rules = config.validationRules;

        if (!rules) return;

        // Check required fields
        if (rules.required && (!value || value.toString().trim() === '')) {
          errors.push({
            row: index + 1,
            column: config.displayName,
            error: 'This field is required',
            value: value
          });
          hasError = true;
        }

        if (value) {
          // Type validation
          if (rules.type === 'number' && isNaN(Number(value))) {
            errors.push({
              row: index + 1,
              column: config.displayName,
              error: 'Must be a valid number',
              value: value
            });
            hasError = true;
          }

          if (rules.type === 'email' && rules.regex && !rules.regex.test(value)) {
            errors.push({
              row: index + 1,
              column: config.displayName,
              error: 'Must be a valid email address',
              value: value
            });
            hasError = true;
          }

          // Length validation
          if (rules.minLength && value.toString().length < rules.minLength) {
            errors.push({
              row: index + 1,
              column: config.displayName,
              error: `Minimum length is ${rules.minLength}`,
              value: value
            });
            hasError = true;
          }

          if (rules.maxLength && value.toString().length > rules.maxLength) {
            errors.push({
              row: index + 1,
              column: config.displayName,
              error: `Maximum length is ${rules.maxLength}`,
              value: value
            });
            hasError = true;
          }

          // Number range validation
          if (rules.type === 'number') {
            const numValue = Number(value);
            if (rules.min && numValue < rules.min) {
              errors.push({
                row: index + 1,
                column: config.displayName,
                error: `Minimum value is ${rules.min}`,
                value: value
              });
              hasError = true;
            }

            if (rules.max && numValue > rules.max) {
              errors.push({
                row: index + 1,
                column: config.displayName,
                error: `Maximum value is ${rules.max}`,
                value: value
              });
              hasError = true;
            }
          }

          // Custom validation
          if (rules.customValidator) {
            const customError = rules.customValidator(value, row);
            if (customError) {
              errors.push({
                row: index + 1,
                column: config.displayName,
                error: customError,
                value: value
              });
              hasError = true;
            }
          }
        }
      });

      if (hasError) {
        invalidRows.push(row);
      } else {
        validRows.push(row);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      validRows,
      invalidRows
    };
  };

  // Handle import completion
  const handleImportComplete = (summary: UploadSummary) => {
    toast.success(`Import completed: ${summary.successCount} records imported, ${summary.errorCount} errors`);
    console.log('Import Summary:', summary);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bulk Upload Demo</h1>
          <p className="text-muted-foreground">
            Demonstrate the DynamicBulkUpload component with wagon data
          </p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)}>
          Start Bulk Upload
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Component Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Step-by-step workflow</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Drag & drop upload</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Auto column mapping</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Data validation</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Error correction</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Progress tracking</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Import summary</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-medium">Accepted File Types</h4>
              <p className="text-sm text-muted-foreground">.csv, .xlsx, .xls</p>
            </div>
            <div>
              <h4 className="font-medium">Max File Size</h4>
              <p className="text-sm text-muted-foreground">2 MB</p>
            </div>
            <div>
              <h4 className="font-medium">Required Fields</h4>
              <p className="text-sm text-muted-foreground">
                Wagon Number, Wagon Type, Capacity, Status
              </p>
            </div>
            <div>
              <h4 className="font-medium">Optional Fields</h4>
              <p className="text-sm text-muted-foreground">
                Manufacture Year, Owner Email
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sample Data Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-2 text-left">Wagon Number</th>
                  <th className="border border-border p-2 text-left">Wagon Type</th>
                  <th className="border border-border p-2 text-left">Capacity (tons)</th>
                  <th className="border border-border p-2 text-left">Manufacture Year</th>
                  <th className="border border-border p-2 text-left">Status</th>
                  <th className="border border-border p-2 text-left">Owner Email</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-2">WAG001</td>
                  <td className="border border-border p-2">Freight</td>
                  <td className="border border-border p-2">50</td>
                  <td className="border border-border p-2">2020</td>
                  <td className="border border-border p-2">active</td>
                  <td className="border border-border p-2">owner1@example.com</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">WAG002</td>
                  <td className="border border-border p-2">Passenger</td>
                  <td className="border border-border p-2">80</td>
                  <td className="border border-border p-2">2018</td>
                  <td className="border border-border p-2">maintenance</td>
                  <td className="border border-border p-2">owner2@example.com</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <DynamicBulkUpload
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        acceptedFileTypes={['.csv', '.xlsx', '.xls']}
        maxFileSizeMB={2}
        templateUrl="/sample-template.xlsx"
        columnsConfig={columnsConfig}
        onUpload={handleUpload}
        onValidate={handleValidate}
        onImportComplete={handleImportComplete}
        allowMultipleFiles={false}
        enableMapping={true}
      />
    </div>
  );
}