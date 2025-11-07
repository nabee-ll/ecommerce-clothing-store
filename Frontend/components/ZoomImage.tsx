import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ZoomImageProps {
    src: string;
    alt: string;
    width?: string;
    height?: string;
    magnification?: number;
    className?: string;
}

const ZoomImage: React.FC<ZoomImageProps> = ({
    src,
    alt,
    width = '100%',
    height = 'auto',
    magnification = 2,
    className = ''
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const imageRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current) return;

        const { left, top, width, height } = imageRef.current.getBoundingClientRect();
        
        // Calculate relative position (0 to 1)
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        
        // Keep values between 0 and 1
        const boundedX = Math.max(0, Math.min(1, x));
        const boundedY = Math.max(0, Math.min(1, y));
        
        setPosition({ x: boundedX, y: boundedY });
    };

    const calculateZoomStyle = () => {
        const scale = magnification;
        const xPercent = position.x * 100;
        const yPercent = position.y * 100;
        
        return {
            transform: `scale(${scale})`,
            transformOrigin: `${xPercent}% ${yPercent}%`
        };
    };

    return (
        <motion.div
            ref={imageRef}
            className={`relative overflow-hidden cursor-zoom-in ${className}`}
            style={{ width, height }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
        >
            <motion.img
                src={src}
                alt={alt}
                className="w-full h-full object-cover transition-transform duration-200"
                style={isHovered ? calculateZoomStyle() : undefined}
                animate={isHovered ? { scale: magnification } : { scale: 1 }}
                transition={{ type: "tween", duration: 0.2 }}
            />
            
            {/* Overlay to show zoom level */}
            {isHovered && (
                <div className="absolute inset-0 bg-black bg-opacity-10 pointer-events-none" />
            )}
            
            {/* Loading state */}
            <div className="absolute inset-0 bg-gray-200 animate-pulse" 
                 style={{ display: 'none' }}>
                <div className="flex items-center justify-center h-full">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </motion.div>
    );
};

export default ZoomImage;