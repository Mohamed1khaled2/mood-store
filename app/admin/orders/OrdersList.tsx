"use client";

import React, { useState, useTransition } from "react";
import { Order } from "@/data/db";
import { updateOrderStatus, deleteOrder } from "@/app/admin/actions";

type OrdersListProps = {
  initialOrders: Order[];
};

type FilterStatus = "all" | Order["status"];

export default function OrdersList({ initialOrders }: OrdersListProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, newStatus);
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      } catch (err) {
        console.error("Failed to update status", err);
      }
    });
  };

  const handleDelete = (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order? This action is permanent.")) return;

    startTransition(async () => {
      try {
        await deleteOrder(orderId);
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }
      } catch (err) {
        console.error("Failed to delete order", err);
      }
    });
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === "all") return true;
    return o.status === filter;
  });

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <span className="px-2.5 py-1 text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100 rounded-lg">Pending</span>;
      case "shipped":
        return <span className="px-2.5 py-1 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 rounded-lg">Shipped</span>;
      case "delivered":
        return <span className="px-2.5 py-1 text-xs font-bold bg-green-50 text-green-700 border border-green-100 rounded-lg">Delivered</span>;
      case "cancelled":
        return <span className="px-2.5 py-1 text-xs font-bold bg-red-50 text-red-700 border border-red-100 rounded-lg">Cancelled</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* List Container */}
      <div className={`${selectedOrder ? "lg:col-span-8" : "lg:col-span-12"} space-y-6`}>
        {/* Status Filters */}
        <div className="flex gap-2 border-b border-gray-100 pb-1 overflow-x-auto">
          {(["all", "pending", "shipped", "delivered", "cancelled"] as FilterStatus[]).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                filter === st
                  ? "border-[#8c5a3c] text-[#8c5a3c]"
                  : "border-transparent text-gray-500 hover:text-gray-950"
              }`}
            >
              {st} ({st === 'all' ? orders.length : orders.filter(o => o.status === st).length})
            </button>
          ))}
        </div>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl">
            <span className="text-3xl">📦</span>
            <p className="text-sm font-bold text-gray-900 mt-3">No orders found</p>
            <p className="text-xs text-gray-500 mt-1">There are no orders matching the selected filter.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-100">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Governorate</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs text-gray-900">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`hover:bg-gray-50/50 cursor-pointer transition ${
                        selectedOrder?.id === order.id ? "bg-gray-50/80" : ""
                      }`}
                    >
                      <td className="p-4 font-bold text-[#8c5a3c]">{order.id}</td>
                      <td className="p-4">
                        <div className="font-semibold">{order.customerName}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{order.customerPhone}</div>
                      </td>
                      <td className="p-4 font-medium text-gray-600">{order.customerGovernorate}</td>
                      <td className="p-4 font-bold">LE {order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="p-4">{getStatusBadge(order.status)}</td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1.5">
                          {order.status === "pending" && (
                            <button
                              onClick={() => handleStatusChange(order.id, "shipped")}
                              className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded text-[10px] transition cursor-pointer"
                            >
                              Ship
                            </button>
                          )}
                          {order.status === "shipped" && (
                            <button
                              onClick={() => handleStatusChange(order.id, "delivered")}
                              className="px-2 py-1 bg-green-50 text-green-700 hover:bg-green-100 font-bold rounded text-[10px] transition cursor-pointer"
                            >
                              Deliver
                            </button>
                          )}
                          {order.status !== "delivered" && order.status !== "cancelled" && (
                            <button
                              onClick={() => handleStatusChange(order.id, "cancelled")}
                              className="px-2 py-1 bg-red-50 text-red-700 hover:bg-red-100 font-bold rounded text-[10px] transition cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="px-2 py-1 hover:bg-gray-100 text-gray-500 hover:text-red-600 font-bold rounded text-[10px] transition cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Details Sidebar Pane */}
      {selectedOrder && (
        <div className="lg:col-span-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6 sticky top-8">
          <div className="flex justify-between items-center border-b border-gray-50 pb-4">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Details</span>
              <h2 className="text-lg font-bold text-gray-900">{selectedOrder.id}</h2>
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-950 transition cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Customer Info */}
          <div className="space-y-3.5 border-b border-gray-50 pb-5 text-xs">
            <h3 className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Customer Details</h3>
            <div className="space-y-1.5 text-gray-900">
              <div><span className="text-gray-500 font-medium">Name:</span> <strong className="font-semibold">{selectedOrder.customerName}</strong></div>
              <div><span className="text-gray-500 font-medium">Phone:</span> <strong className="font-semibold">{selectedOrder.customerPhone}</strong></div>
              <div><span className="text-gray-500 font-medium">Governorate:</span> <strong className="font-semibold">{selectedOrder.customerGovernorate}</strong></div>
              <div><span className="text-gray-500 font-medium">Address:</span> <p className="text-gray-600 mt-1 leading-relaxed">{selectedOrder.customerAddress}</p></div>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3.5 border-b border-gray-50 pb-5 text-xs">
            <h3 className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Items Ordered</h3>
            <div className="space-y-3">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-gray-900">
                  <div>
                    <span className="font-semibold">{item.name.en}</span>
                    <span className="text-gray-400 font-bold ml-1.5">x{item.quantity}</span>
                  </div>
                  <span className="font-semibold text-gray-700">{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-2.5 text-xs border-b border-gray-50 pb-5 text-gray-900">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold">LE {selectedOrder.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span className="font-semibold">
                {selectedOrder.shippingFee === 0 ? "Free" : `LE ${selectedOrder.shippingFee}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-1.5">
              <span>Total</span>
              <span className="text-[#8c5a3c]">LE {selectedOrder.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Quick Status Adjustments */}
          <div className="flex gap-2">
            <select
              value={selectedOrder.status}
              disabled={isPending}
              onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as Order["status"])}
              className="flex-1 h-10 px-3 text-xs font-semibold text-gray-950 border border-gray-200 bg-white rounded-xl focus:outline-none focus:border-[#8c5a3c]"
            >
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={() => handleDelete(selectedOrder.id)}
              disabled={isPending}
              className="h-10 px-4 border border-red-200 hover:bg-red-50 text-red-600 font-semibold rounded-xl text-xs transition cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
