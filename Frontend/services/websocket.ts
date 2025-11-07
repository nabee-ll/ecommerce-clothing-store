let socket: WebSocket | null = null;
let reconnectTimer: NodeJS.Timeout;

export const connectWebSocket = (userId: string) => {
    if (socket) return;

    socket = new WebSocket(`ws://localhost:5000/ws/${userId}`);

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
            case 'ORDER_STATUS_UPDATE':
                dispatchEvent(new CustomEvent('orderStatusUpdate', { detail: data.payload }));
                break;
            case 'PRICE_DROP':
                dispatchEvent(new CustomEvent('priceDropAlert', { detail: data.payload }));
                break;
            case 'STOCK_ALERT':
                dispatchEvent(new CustomEvent('stockAlert', { detail: data.payload }));
                break;
            case 'CART_REMINDER':
                dispatchEvent(new CustomEvent('cartReminder', { detail: data.payload }));
                break;
        }
    };

    socket.onclose = () => {
        socket = null;
        // Attempt to reconnect after 5 seconds
        reconnectTimer = setTimeout(() => connectWebSocket(userId), 5000);
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
};

export const disconnectWebSocket = () => {
    if (socket) {
        socket.close();
        socket = null;
    }
    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
    }
};