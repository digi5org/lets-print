"use client";

import { useState } from "react";

export default function TrackShipment({ onBack }) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingError, setTrackingError] = useState('');

  // Mock shipment data - in production, this would come from an API
  const shipments = [
    {
      trackingNumber: "TRK123456789",
      orderId: "ORD-1018",
      product: "Flyers - 500pc",
      status: "In Transit",
      currentLocation: "Distribution Center - New York",
      estimatedDelivery: "Dec 12, 2024",
      timeline: [
        { status: "Order Placed", date: "Dec 8, 2024, 10:30 AM", completed: true },
        { status: "Processing", date: "Dec 8, 2024, 2:15 PM", completed: true },
        { status: "Shipped", date: "Dec 9, 2024, 9:00 AM", completed: true },
        { status: "In Transit", date: "Dec 10, 2024, 3:45 PM", completed: true, current: true },
        { status: "Out for Delivery", date: "Pending", completed: false },
        { status: "Delivered", date: "Pending", completed: false },
      ]
    },
    {
      trackingNumber: "TRK987654321",
      orderId: "ORD-1023",
      product: "Business Cards",
      status: "Processing",
      currentLocation: "Production Facility - Los Angeles",
      estimatedDelivery: "Dec 15, 2024",
      timeline: [
        { status: "Order Placed", date: "Dec 10, 2024, 10:30 AM", completed: true },
        { status: "Processing", date: "Dec 10, 2024, 2:15 PM", completed: true, current: true },
        { status: "Shipped", date: "Pending", completed: false },
        { status: "In Transit", date: "Pending", completed: false },
        { status: "Out for Delivery", date: "Pending", completed: false },
        { status: "Delivered", date: "Pending", completed: false },
      ]
    },
  ];

  const handleTrackShipment = () => {
    setTrackingError('');
    setTrackingResult(null);

    if (!trackingNumber.trim()) {
      setTrackingError('Please enter a tracking number or order ID');
      return;
    }

    // Search for shipment by tracking number or order ID
    const found = shipments.find(
      s => s.trackingNumber.toLowerCase() === trackingNumber.toLowerCase() ||
           s.orderId.toLowerCase() === trackingNumber.toLowerCase()
    );

    if (found) {
      setTrackingResult(found);
    } else {
      setTrackingError('No shipment found with this tracking number or order ID');
    }
  };

  const handleReset = () => {
    setTrackingNumber('');
    setTrackingResult(null);
    setTrackingError('');
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="font-medium">Back to Dashboard</span>
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Track Shipment</h2>
        <p className="text-gray-600">Real-time tracking of your orders</p>
        
        {/* Search Section */}
        <div className="mt-6 flex gap-3">
          <input
            type="text"
            placeholder="Enter Order ID or Tracking Number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTrackShipment()}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleTrackShipment}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Track Order
          </button>
        </div>

        {/* Error Message */}
        {trackingError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700 text-sm">{trackingError}</p>
          </div>
        )}
      </div>

      {/* Tracking Results */}
      {trackingResult && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Back to Search Button */}
          <button
            onClick={handleReset}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Search Another Shipment</span>
          </button>

          {/* Shipment Info Header */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{trackingResult.product}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Order: <span className="font-semibold text-blue-600">{trackingResult.orderId}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Tracking: <span className="font-semibold font-mono">{trackingResult.trackingNumber}</span>
                  </span>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                trackingResult.status === 'Delivered' 
                  ? 'bg-green-100 text-green-700'
                  : trackingResult.status === 'In Transit'
                  ? 'bg-blue-100 text-blue-700'
                  : trackingResult.status === 'Processing'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-purple-100 text-purple-700'
              }`}>
                {trackingResult.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-xs text-blue-600 font-medium mb-1">Current Location</p>
                  <p className="text-sm font-semibold text-gray-900">{trackingResult.currentLocation}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
                <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-xs text-green-600 font-medium mb-1">Estimated Delivery</p>
                  <p className="text-sm font-semibold text-gray-900">{trackingResult.estimatedDelivery}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Tracking Timeline</h4>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-6 relative">
                {trackingResult.timeline.map((event, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 flex-shrink-0 ${
                      event.completed
                        ? event.current
                          ? 'bg-blue-500 animate-pulse'
                          : 'bg-green-500'
                        : 'bg-gray-300'
                    }`}>
                      {event.completed && !event.current ? (
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : event.current ? (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      ) : (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className={`font-semibold text-sm ${
                        event.completed ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {event.status}
                      </p>
                      <p className={`text-xs mt-1 ${
                        event.completed 
                          ? event.current 
                            ? 'text-blue-600 font-medium'
                            : 'text-gray-500'
                          : 'text-gray-400'
                      }`}>
                        {event.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex gap-3">
            <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Tracking Updates
            </button>
            <button className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Tracking
            </button>
          </div>
        </div>
      )}

      {/* Recent Shipments */}
      {!trackingResult && !trackingError && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Shipments</h3>
          <div className="space-y-3">
            {shipments.map((shipment) => (
              <div
                key={shipment.trackingNumber}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                onClick={() => {
                  setTrackingNumber(shipment.trackingNumber);
                  setTrackingResult(shipment);
                  setTrackingError('');
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{shipment.product}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Tracking: <span className="font-mono text-gray-700">{shipment.trackingNumber}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      shipment.status === 'Delivered' 
                        ? 'bg-green-100 text-green-700'
                        : shipment.status === 'In Transit'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {shipment.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-2">{shipment.estimatedDelivery}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
