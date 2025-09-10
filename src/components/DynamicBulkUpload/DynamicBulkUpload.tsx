import React, { useState, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  Check, 
  X, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight,
  Trash2,
  Edit2,
  Info
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { cn } from '@/lib/utils';
import { 
  DynamicBulkUploadProps, 
  BulkUploadFile, 
  ColumnMapping, 
  ValidationResult,
  UploadSummary,
  UploadError
} from '@/types/bulkUpload';

type UploadStep = 'information' | 'upload' | 'review' | 'completion';

export default function DynamicBulkUpload({
  acceptedFileTypes = ['.csv', '.xlsx', '.xls'],
  maxFileSizeMB = 2,
  templateUrl,
  columnsConfig,
  onUpload,
  onValidate,
  onImportComplete,
  allowMultipleFiles = false,
  enableMapping = false,
  className,
  isOpen,
  onClose
}: DynamicBulkUploadProps) {
  const [currentStep, setCurrentStep] = useState<UploadStep>('information');
  const [files, setFiles] = useState<BulkUploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [uploadSummary, setUploadSummary] = useState<UploadSummary | null>(null);
  const [editingData, setEditingData] = useState<any[]>([]);
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);
  const [editingCell, setEditingCell] = useState<{rowIndex: number, field: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (selectedFiles: FileList) => {
    const newFiles: BulkUploadFile[] = [];
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      // Validate file type
      const isValidType = acceptedFileTypes.some(type => 
        file.name.toLowerCase().endsWith(type.replace('.', ''))
      );
      
      if (!isValidType) {
        alert(`Invalid file type. Accepted types: ${acceptedFileTypes.join(', ')}`);
        continue;
      }
      
      // Validate file size
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        alert(`File size exceeds ${maxFileSizeMB}MB limit`);
        continue;
      }
      
      if (!allowMultipleFiles && files.length > 0) {
        setFiles([]); // Replace existing file
      }
      
      const uploadFile: BulkUploadFile = {
        id: `${Date.now()}-${i}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date(),
        status: 'pending',
        progress: 0
      };
      
      newFiles.push(uploadFile);
    }
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Process files
    for (const uploadFile of newFiles) {
      await processFile(uploadFile);
    }
  }, [acceptedFileTypes, maxFileSizeMB, allowMultipleFiles, files.length]);

  const processFile = async (uploadFile: BulkUploadFile) => {
    try {
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { ...f, status: 'uploading', progress: 30 } : f
      ));

      // Read file content
      const data = await readFileData(uploadFile.file);
      
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { ...f, progress: 60 } : f
      ));

      // Upload file
      const processedData = await onUpload(uploadFile.file);
      
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { 
          ...f, 
          status: 'completed', 
          progress: 100,
          data: processedData || data
        } : f
      ));
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { ...f, status: 'error', progress: 0 } : f
      ));
    }
  };

  const readFileData = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          
          if (file.name.endsWith('.csv')) {
            // Parse CSV
            const text = data as string;
            const lines = text.split('\n').filter(line => line.trim());
            const headers = lines[0].split(',').map(h => h.trim());
            const rows = lines.slice(1).map(line => {
              const values = line.split(',').map(v => v.trim());
              const row: any = {};
              headers.forEach((header, index) => {
                row[header] = values[index] || '';
              });
              return row;
            });
            resolve(rows);
          } else {
            // Parse Excel
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            resolve(jsonData);
          }
        } catch (error) {
          reject(error);
        }
      };
      
      if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
      } else {
        reader.readAsBinaryString(file);
      }
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const autoMapColumns = (fileHeaders: string[]) => {
    const mappings: ColumnMapping[] = [];
    
    fileHeaders.forEach(header => {
      const bestMatch = columnsConfig.find(config => 
        config.displayName.toLowerCase() === header.toLowerCase() ||
        config.fieldName.toLowerCase() === header.toLowerCase()
      );
      
      if (bestMatch) {
        mappings.push({
          sourceColumn: header,
          targetColumn: bestMatch.fieldName,
          confidence: 1.0
        });
      } else {
        // Find partial matches
        const partialMatch = columnsConfig.find(config =>
          config.displayName.toLowerCase().includes(header.toLowerCase()) ||
          header.toLowerCase().includes(config.displayName.toLowerCase())
        );
        
        if (partialMatch) {
          mappings.push({
            sourceColumn: header,
            targetColumn: partialMatch.fieldName,
            confidence: 0.7
          });
        }
      }
    });
    
    setColumnMappings(mappings);
  };

  const validateData = () => {
    const allData = files.flatMap(f => f.data || []);
    const result = onValidate(allData, columnsConfig);
    setValidationResult(result);
    setEditingData([...allData]);
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'information':
        setCurrentStep('upload');
        break;
      case 'upload':
        if (files.length > 0 && files.every(f => f.status === 'completed')) {
          validateData();
          setCurrentStep('review');
        }
        break;
      case 'review':
        const summary: UploadSummary = {
          totalRows: validationResult?.validRows.length || 0 + validationResult?.invalidRows.length || 0,
          successCount: validationResult?.validRows.length || 0,
          errorCount: validationResult?.invalidRows.length || 0,
          duplicateCount: 0,
          errors: validationResult?.errors || []
        };
        setUploadSummary(summary);
        onImportComplete(summary);
        setCurrentStep('completion');
        break;
    }
  };

  const handlePrevious = () => {
    switch (currentStep) {
      case 'upload':
        setCurrentStep('information');
        break;
      case 'review':
        setCurrentStep('upload');
        break;
      case 'completion':
        setCurrentStep('review');
        break;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'information':
        return true;
      case 'upload':
        return files.length > 0 && files.every(f => f.status === 'completed');
      case 'review':
        return validationResult !== null;
      case 'completion':
        return false;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'information': return 'Bulk Upload Information';
      case 'upload': return 'File Upload';
      case 'review': return 'Data Review & Error Correction';
      case 'completion': return 'Upload Complete';
    }
  };

  const renderInformationStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <FileSpreadsheet className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Bulk Upload Process</h3>
        <p className="text-muted-foreground">
          Upload your files and map columns to import data efficiently
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-green-600" />
            <span>Supported formats: {acceptedFileTypes.join(', ')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-green-600" />
            <span>Maximum file size: {maxFileSizeMB}MB</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-green-600" />
            <span>Required columns: {columnsConfig.filter(c => c.validationRules?.required).map(c => c.displayName).join(', ')}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUploadStep = () => (
    <div className="space-y-6">
      {templateUrl && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => window.open(templateUrl, '_blank')}>
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </div>
      )}
      
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          "hover:border-primary/50 cursor-pointer"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">
          <span className="text-primary">Click to Upload</span> or drag and drop
        </p>
        <p className="text-sm text-muted-foreground">
          {acceptedFileTypes.join(' or ')} (Maximum File Size {maxFileSizeMB} MB)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFileTypes.join(',')}
          multiple={allowMultipleFiles}
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              Attached Files
              <Badge variant="secondary">{files.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <FileSpreadsheet className="h-8 w-8 text-green-600" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)} • {file.uploadDate.toLocaleDateString()}
                    </p>
                    {file.status === 'uploading' && (
                      <Progress value={file.progress} className="mt-2" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {file.status === 'completed' && (
                      <Badge variant="default" className="bg-green-600">
                        <Check className="h-3 w-3 mr-1" />
                        Uploaded
                      </Badge>
                    )}
                    {file.status === 'error' && (
                      <Badge variant="destructive">
                        <X className="h-3 w-3 mr-1" />
                        Error
                      </Badge>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeFile(file.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const updateCellValue = (rowIndex: number, field: string, value: any) => {
    setEditingData(prev => {
      const newData = [...prev];
      newData[rowIndex] = { ...newData[rowIndex], [field]: value };
      return newData;
    });
    
    // Re-validate after edit
    const updatedResult = onValidate(editingData, columnsConfig);
    setValidationResult(updatedResult);
  };

  const getCellError = (rowIndex: number, field: string): string | null => {
    if (!validationResult?.errors) return null;
    
    const error = validationResult.errors.find(err => 
      err.row === rowIndex + 1 && err.column === field
    );
    return error?.error || null;
  };

  const hasRowError = (rowIndex: number): boolean => {
    if (!validationResult?.errors) return false;
    return validationResult.errors.some(err => err.row === rowIndex + 1);
  };

  const getFilteredData = () => {
    if (!showErrorsOnly) return editingData;
    
    return editingData.filter((_, index) => hasRowError(index));
  };

  const renderEditableCell = (row: any, field: string, rowIndex: number) => {
    const error = getCellError(rowIndex, field);
    const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.field === field;
    const cellValue = row[field] || '';

    if (isEditing) {
      return (
        <Input
          value={cellValue}
          onChange={(e) => updateCellValue(rowIndex, field, e.target.value)}
          onBlur={() => setEditingCell(null)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') {
              setEditingCell(null);
            }
          }}
          className="h-8"
          autoFocus
        />
      );
    }

    return (
      <div
        className={cn(
          "min-h-8 flex items-center cursor-pointer p-1 rounded",
          error && "bg-red-50 border border-red-200",
          "hover:bg-muted"
        )}
        onClick={() => setEditingCell({ rowIndex, field })}
      >
        <span className={cn(error && "text-red-700")}>{String(cellValue)}</span>
        {error && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3 w-3 text-red-500 ml-1 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">{error}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  };

  const renderReviewStep = () => (
    <div className="space-y-6">
      {validationResult && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{validationResult.validRows.length}</p>
                <p className="text-sm text-muted-foreground">Valid Records</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{validationResult.invalidRows.length}</p>
                <p className="text-sm text-muted-foreground">Records with Errors</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{editingData.length}</p>
                <p className="text-sm text-muted-foreground">Total Records</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Data Preview & Error Correction</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={showErrorsOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowErrorsOnly(!showErrorsOnly)}
              >
                {showErrorsOnly ? 'Show All Rows' : 'Show Errors Only'}
              </Button>
              <Badge variant="secondary">
                {getFilteredData().length} of {editingData.length} rows
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground mb-3">
            Click on any cell to edit. Cells with errors are highlighted in red.
          </div>
          <ScrollArea className="h-96 w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  {columnsConfig.map((config) => (
                    <TableHead key={config.fieldName} className="min-w-32">
                      {config.displayName}
                      {config.validationRules?.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredData().map((row, index) => {
                  const originalIndex = showErrorsOnly 
                    ? editingData.findIndex(item => item === row)
                    : index;
                  const rowHasError = hasRowError(originalIndex);
                  
                  return (
                    <TableRow
                      key={originalIndex}
                      className={cn(
                        rowHasError && "bg-red-50/50 hover:bg-red-50"
                      )}
                    >
                      <TableCell className="font-mono text-xs">
                        <div className="flex items-center gap-1">
                          {originalIndex + 1}
                          {rowHasError && (
                            <AlertTriangle className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      {columnsConfig.map((config) => (
                        <TableCell key={config.fieldName}>
                          {renderEditableCell(row, config.fieldName, originalIndex)}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {validationResult && validationResult.errors.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Found {validationResult.errors.length} validation errors. 
            Click on highlighted cells to correct the data before proceeding.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderCompletionStep = () => (
    <div className="space-y-6 text-center">
      <div>
        <Check className="mx-auto h-16 w-16 text-green-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Upload Complete!</h3>
        <p className="text-muted-foreground">Your data has been successfully processed</p>
      </div>

      {uploadSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Import Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xl font-bold text-green-600">{uploadSummary.successCount}</p>
                <p className="text-sm text-muted-foreground">Successfully Imported</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-red-600">{uploadSummary.errorCount}</p>
                <p className="text-sm text-muted-foreground">Failed Records</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2 justify-center">
        <Button variant="outline" onClick={() => {
          setCurrentStep('information');
          setFiles([]);
          setValidationResult(null);
          setUploadSummary(null);
        }}>
          Upload More Files
        </Button>
        <Button onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("max-w-4xl max-h-[90vh]", className)}>
        <DialogHeader>
          <DialogTitle>{getStepTitle()}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {currentStep === 'information' && renderInformationStep()}
          {currentStep === 'upload' && renderUploadStep()}
          {currentStep === 'review' && renderReviewStep()}
          {currentStep === 'completion' && renderCompletionStep()}
        </div>

        {currentStep !== 'completion' && (
          <>
            <Separator />
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 'information'}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}