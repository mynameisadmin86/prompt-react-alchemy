
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SideDrawer } from '@/components/ui/side-drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const SideDrawerDemo = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
    setCurrentStep(1);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setCurrentStep(1);
  };

  const handleNextStep = () => {
    setCurrentStep(2);
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      handleCloseDrawer();
    }
  };

  const handleSave = () => {
    console.log('Saving form data:', formData);
    alert('Form data saved!');
    handleCloseDrawer();
  };

  const handleCancel = () => {
    setFormData({ name: '', email: '', message: '' });
    handleCloseDrawer();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Step 1: Basic Information</h3>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Step 2: Additional Details</h3>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Enter your message"
                rows={5}
              />
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <h4 className="font-medium text-sm">Summary:</h4>
              <p className="text-sm text-gray-600">Name: {formData.name || 'Not provided'}</p>
              <p className="text-sm text-gray-600">Email: {formData.email || 'Not provided'}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getFooterButtons = () => {
    if (currentStep === 1) {
      return [
        {
          label: 'Cancel',
          variant: 'ghost' as const,
          action: handleCancel
        },
        {
          label: 'Next',
          variant: 'default' as const,
          action: handleNextStep,
          disabled: !formData.name || !formData.email
        }
      ];
    } else {
      return [
        {
          label: 'Cancel',
          variant: 'ghost' as const,
          action: handleCancel
        },
        {
          label: 'Save',
          variant: 'default' as const,
          action: handleSave
        }
      ];
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Side Drawer Demo</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Examples</h2>
          <p className="text-gray-600 mb-6">
            Click the button below to open a side drawer with a multi-step form.
          </p>
          
          <Button onClick={handleOpenDrawer}>
            Open Side Drawer
          </Button>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium mb-2">Features Demonstrated:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Slides in from the left</li>
                <li>• Smooth 300ms transition</li>
                <li>• Back button navigation</li>
                <li>• Close button and ESC key</li>
                <li>• Outside click to close</li>
                <li>• Scrollable body content</li>
                <li>• Sticky footer with buttons</li>
                <li>• Responsive (full width on mobile)</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium mb-2">Configuration Options:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Custom title</li>
                <li>• Toggle back/close buttons</li>
                <li>• Configurable footer buttons</li>
                <li>• Custom button variants</li>
                <li>• Outside click behavior</li>
                <li>• Custom styling support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Side Drawer */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onBack={handleBackStep}
        title={`Contact Form - Step ${currentStep}`}
        showBackButton={true}
        showCloseButton={true}
        showFooter={true}
        footerButtons={getFooterButtons()}
        closeOnOutsideClick={true}
      >
        {renderStepContent()}
      </SideDrawer>
    </div>
  );
};

export default SideDrawerDemo;
