import { useState } from "react";
import { InvoiceEditor } from "./invoice/InvoiceEditor";
import { InvoicePreview } from "./invoice/InvoicePreview";
import { InvoiceData, Layer } from "@/types/invoice";

const initialData: InvoiceData = {
  invoiceNumber: "INV-2025-01",
  soNumber: "SO-2025-01",
  invoiceDate: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  companyName: "Dezprox Pvt Ltd",
  clientName: "LEV Labs",
  clientPhone: "+91 9876543210",
  clientEmail: "contact@levlabs.com",
  clientAddress: "123 Business Street, City, State 12345",
  bankName: "State Bank of India",
  accountName: "Dezprox LLP",
  accountNumber: "1234567890",
  ifscCode: "SBIN0001234",
  signatoryName: "N R Bharanidharan",
  signatoryRole: "Authorized Signatory",
  signatureImage: "",
  // Theme signatures: imported via public paths; cache-busted to avoid stale images
  signatures: [
    {
      id: "pub-1",
      name: "Agnel",
      src: "/Agnel_Signature.png?v=2",
      type: "image/png",
      size: 0,
      width: 0,
      height: 0,
    },
    {
      id: "pub-2",
      name: "Bharani",
      src: "/Bharani_signature.png?v=2",
      type: "image/png",
      size: 0,
      width: 0,
      height: 0,
    },
    {
      id: "pub-3",
      name: "Dinesh",
      src: "/dinesh_signature.png?v=2",
      type: "image/png",
      size: 0,
      width: 0,
      height: 0,
    },
    {
      id: "pub-4",
      name: "Mohan",
      src: "/Mohan_signature.png?v=2",
      type: "image/png",
      size: 0,
      width: 0,
      height: 0,
    },
  ],
  selectedSignatureName: "Agnel",
  layers: [
    {
      id: "1",
      title: "Project Work",
      responsibilityPercent: 100,
      items: [
        { id: "1", description: "Initial Project Work", qty: 1, rate: 5000, amount: 5000 }
      ],
      subtotal: 5000,
      remarks: "Project work completed"
    }
  ],
  grandTotal: 5000,
  // default amounts; can be edited from the editor when enabled
  dueAmount: 5000,
  paidAmount: 0,
  showDueAmount: true,
  showPaidAmount: true
};

export const InvoiceBuilder = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(initialData);

  const updateInvoiceData = (newData: Partial<InvoiceData>) => {
    setInvoiceData(prev => ({ ...prev, ...newData }));
  };

  const addLayer = () => {
    const newLayer: Layer = {
      id: Date.now().toString(),
      title: "New Layer",
      responsibilityPercent: 0,
      items: [],
      subtotal: 0,
      remarks: ""
    };
    
    const newLayers = [...invoiceData.layers, newLayer];
    setInvoiceData(prev => ({
      ...prev,
      layers: newLayers,
      grandTotal: calculateGrandTotal(newLayers)
    }));
  };

  const updateLayer = (layerId: string, updates: Partial<Layer>) => {
    const newLayers = invoiceData.layers.map(layer => 
      layer.id === layerId ? { ...layer, ...updates } : layer
    );
    
    setInvoiceData(prev => ({
      ...prev,
      layers: newLayers,
      grandTotal: calculateGrandTotal(newLayers)
    }));
  };

  const deleteLayer = (layerId: string) => {
    const newLayers = invoiceData.layers.filter(layer => layer.id !== layerId);
    setInvoiceData(prev => ({
      ...prev,
      layers: newLayers,
      grandTotal: calculateGrandTotal(newLayers)
    }));
  };

  const calculateGrandTotal = (layers: Layer[]) => {
    return layers.reduce((total, layer) => total + layer.subtotal, 0);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Invoice Builder</h1>
          <p className="text-sm text-muted-foreground">Layer-by-Layer Method</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InvoiceEditor
            invoiceData={invoiceData}
            onUpdateData={updateInvoiceData}
            onAddLayer={addLayer}
            onUpdateLayer={updateLayer}
            onDeleteLayer={deleteLayer}
          />
          
          <InvoicePreview invoiceData={invoiceData} />
        </div>
      </div>
    </div>
  );
};
