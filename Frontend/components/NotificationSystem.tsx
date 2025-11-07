import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    title?: string;
}

const NotificationSystem: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        // Listen for various notification events
        const handlers = {
            orderStatusUpdate: (e: CustomEvent) => {
                addNotification({
                    type: 'info',
                    title: 'Order Update',
                    message: `Order #${e.detail.orderId} status: ${e.detail.status}`
                });
            },
            priceDropAlert: (e: CustomEvent) => {
                addNotification({
                    type: 'success',
                    title: 'Price Drop Alert',
                    message: `${e.detail.productName} is now ${e.detail.newPrice}!`
                });
            },
            stockAlert: (e: CustomEvent) => {
                addNotification({
                    type: 'warning',
                    title: 'Stock Alert',
                    message: `Only ${e.detail.quantity} left of ${e.detail.productName}`
                });
            },
            cartReminder: (e: CustomEvent) => {
                addNotification({
                    type: 'info',
                    title: 'Cart Reminder',
                    message: 'Items in your cart are waiting for you!'
                });
            }
        };

        // Add event listeners
        Object.entries(handlers).forEach(([event, handler]) => {
            window.addEventListener(event, handler as EventListener);
        });

        // Cleanup
        return () => {
            Object.entries(handlers).forEach(([event, handler]) => {
                window.removeEventListener(event, handler as EventListener);
            });
        };
    }, []);

    const addNotification = (notification: Omit<Notification, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        setNotifications(prev => [...prev, { ...notification, id }]);
        setTimeout(() => removeNotification(id), 5000); // Auto remove after 5 seconds
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            <AnimatePresence>
                {notifications.map(notification => (
                    <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: -50, scale: 0.3 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                        className={`
                            p-4 rounded-lg shadow-lg w-80 bg-white dark:bg-gray-800
                            border-l-4 ${getNotificationStyles(notification.type)}
                        `}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                {notification.title && (
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {notification.title}
                                    </h3>
                                )}
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {notification.message}
                                </p>
                            </div>
                            <button
                                onClick={() => removeNotification(notification.id)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

const getNotificationStyles = (type: Notification['type']) => {
    switch (type) {
        case 'success':
            return 'border-green-500 bg-green-50 dark:bg-green-900/20';
        case 'error':
            return 'border-red-500 bg-red-50 dark:bg-red-900/20';
        case 'warning':
            return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
        default:
            return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
};

export default NotificationSystem;