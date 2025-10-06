import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SmartGrid } from '@/components/SmartGrid';
import { useOrderStore } from '@/datastore/orderStore';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { GridColumnConfig } from '@/types/smartgrid';
import { Order } from '@/api/types';

const OrderListPage = () => {
  const navigate = useNavigate();
  const { orderList, loading, error, loadOrders, deleteOrder } = useOrderStore();

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const columns: GridColumnConfig[] = [
    {
      key: 'orderNumber',
      label: 'Order Number',
      type: 'Text',
      width: 150,
      sortable: true,
      filterable: true,
    },
    {
      key: 'customerName',
      label: 'Customer',
      type: 'Text',
      width: 200,
      sortable: true,
      filterable: true,
    },
    {
      key: 'product',
      label: 'Product',
      type: 'Text',
      width: 200,
      sortable: true,
      filterable: true,
    },
    {
      key: 'quantity',
      label: 'Quantity',
      type: 'Text',
      width: 100,
      sortable: true,
      filterable: true,
    },
    {
      key: 'totalAmount',
      label: 'Total Amount',
      type: 'Text',
      width: 150,
      sortable: true,
      filterable: true,
    },
    {
      key: 'status',
      label: 'Status',
      type: 'Badge',
      width: 130,
      sortable: true,
      filterable: true,
      statusMap: {
        pending: 'warning',
        processing: 'info',
        shipped: 'secondary',
        delivered: 'success',
        cancelled: 'destructive',
      },
    },
    {
      key: 'orderDate',
      label: 'Order Date',
      type: 'Date',
      width: 150,
      sortable: true,
      filterable: true,
    },
  ];

  const handleRowClick = (row: Order) => {
    navigate(`/edit-order/${row.id}`);
  };

  const handleDelete = async (row: Order) => {
    if (window.confirm(`Are you sure you want to delete order ${row.orderNumber}?`)) {
      await deleteOrder(row.id);
      toast.success('Order deleted successfully');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Order Management</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage and track all orders
              </p>
            </div>
            <Button onClick={() => navigate('/create-order')}>
              <Plus className="mr-2 h-4 w-4" />
              Create Order
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-6 py-6 overflow-hidden">
        <div className="h-full bg-card rounded-lg border">
          {loading && orderList.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-muted-foreground">Loading orders...</div>
            </div>
          ) : (
            <SmartGrid
              data={orderList}
              columns={columns}
              onRowClick={handleRowClick}
              gridTitle="Orders"
              showCreateButton={false}
              searchPlaceholder="Search orders..."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderListPage;
