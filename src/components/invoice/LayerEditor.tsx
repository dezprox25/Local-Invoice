import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus } from "lucide-react";
import { Layer, InvoiceItem } from "@/types/invoice";
import { ItemsTable } from "./ItemsTable";

interface LayerEditorProps {
  layer: Layer;
  onUpdate: (updates: Partial<Layer>) => void;
  onDelete: () => void;
}

export const LayerEditor = ({ layer, onUpdate, onDelete }: LayerEditorProps) => {
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      qty: 1,
      rate: 0,
      amount: 0
    };

    const newItems = [...layer.items, newItem];
    const subtotal = calculateSubtotal(newItems);
    onUpdate({ items: newItems, subtotal });
  };

  const updateItem = (itemId: string, updates: Partial<InvoiceItem>) => {
    const newItems = layer.items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, ...updates };
        updatedItem.amount = updatedItem.qty * updatedItem.rate;
        return updatedItem;
      }
      return item;
    });

    const subtotal = calculateSubtotal(newItems);
    onUpdate({ items: newItems, subtotal });
  };

  const deleteItem = (itemId: string) => {
    const newItems = layer.items.filter(item => item.id !== itemId);
    const subtotal = calculateSubtotal(newItems);
    onUpdate({ items: newItems, subtotal });
  };

  const calculateSubtotal = (items: InvoiceItem[]) => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  return (
    <Card className="p-2 border-none bg-transprent shadow-none">
      <hr />
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 space-y-4">
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`layer-title-${layer.id}`}>Layer Title</Label>
              <Input
                id={`layer-title-${layer.id}`}
                value={layer.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor={`layer-percent-${layer.id}`}>Responsibility %</Label>
              <Input
                id={`layer-percent-${layer.id}`}
                type="number"
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                max="100"
                value={layer.responsibilityPercent}
                onChange={(e) => onUpdate({ responsibilityPercent: Number(e.target.value) })}
              />
            </div>
          </div> */}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="ml-2 text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <Label>Items</Label>
          <Button onClick={addItem} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add Item
          </Button>
        </div>
        <ItemsTable
          items={layer.items}
          onUpdateItem={updateItem}
          onDeleteItem={deleteItem}
        />
      </div>

      <div className="mb-4 hidden">
        <Label htmlFor={`layer-remarks-${layer.id}`}>Remarks</Label>
        <Textarea
          id={`layer-remarks-${layer.id}`}
          value={layer.remarks}
          onChange={(e) => onUpdate({ remarks: e.target.value })}
          rows={2}
        />
      </div>

      <div className="flex justify-end items-center pt-4 border-t">
        <span className="text-sm font-medium mr-2">Subtotal:</span>
        <span className="text-lg font-bold">₹{layer.subtotal.toLocaleString()}</span>
      </div>
    </Card>
  );
};
