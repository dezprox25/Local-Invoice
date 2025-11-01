import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { InvoiceItem } from "@/types/invoice";

interface ItemsTableProps {
  items: InvoiceItem[];
  onUpdateItem: (itemId: string, updates: Partial<InvoiceItem>) => void;
  onDeleteItem: (itemId: string) => void;
}

export const ItemsTable = ({ items, onUpdateItem, onDeleteItem }: ItemsTableProps) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No items added yet. Click "Add Item" to get started.
      </div>
    );
  }

  return (
    <div className=" overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#2A732D]">
            <tr>
              <th className="px-4 py-2 br-1 border border-white text-white text-left text-sm font-medium">Description</th>
              <th className="px-4 py-2 br-1 border border-white text-white text-left text-sm font-medium w-20">Qty</th>
              <th className="px-4 py-2 br-1 border border-white text-white text-left text-sm font-medium w-28">Rate</th>
              <th className="px-4 py-2 br-1 border border-white text-white text-left text-sm font-medium w-32">Amount</th>
              <th className="px-4 py-2 br-1 border border-white text-white w-12">action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">
                  <Input
                    value={item.description}
                    onChange={(e) => onUpdateItem(item.id, { description: e.target.value })}
                    placeholder="Item description"
                    className="h-8 rounded-none border-0 outline-none focus:border-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </td>
                <td className="px-4 py-2">
                  <Input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => onUpdateItem(item.id, { qty: Number(e.target.value) })}
                    className="h-8 rounded-none border-0 outline-none focus:border-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </td>
                <td className="px-4 py-2">
                  <Input
                    type="number"
                    min="0"
                    value={item.rate}
                    onChange={(e) => onUpdateItem(item.id, { rate: Number(e.target.value) })}
                    className="h-8 rounded-none border-0 outline-none focus:border-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </td>
                <td className="px-4 py-2">
                  <span className="font-medium">₹{item.amount.toLocaleString()}</span>
                </td>
                <td className="px-4 py-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteItem(item.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
