import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Neural Network Background Component
 * Adapted from Framer Component: https://framer.com/m/Neural-Network-Background-P2I2.js@1b7ndBSzmvZUlbORMECp
 */
export default function NeuralNetworkBackground(props) {
    const {
        nodeCount = 50,
        connectionDistance = 150,
        nodeColor = "#8b5cf6", // Default to app primary color (Violent)
        connectionColor = "#8b5cf6",
        nodeSize = 4,
        connectionWidth = 1,
        animationSpeed = 1,
        pulseSpeed = 2,
        mouseInteraction = true,
        mouseRadius = 200,
        showPulses = true,
        pulseIntensity = "medium",
        backgroundColor = "#0f172a", // Slate-900 matches the dark theme better
        nodeOpacity = 0.8,
        connectionOpacity = 0.3,
        movementSpeed = 0.5,
        glowEffect = true,
        waveEffect = true,
        waveSpeed = 3
    } = props;

    const canvasRef = useRef(null);
    const nodesRef = useRef([]);
    const pulsesRef = useRef([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const animationRef = useRef(null);
    const timeRef = useRef(0);

    // Size canvas immediately on mount and when parent resizes
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const sizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            // Reset canvas dimensions to match display size for sharp rendering
            canvas.width = rect.width;
            canvas.height = rect.height;
        };

        sizeCanvas();

        // Also handle resize
        const resizeObserver = new ResizeObserver(sizeCanvas);
        if (canvas.parentElement) {
            resizeObserver.observe(canvas.parentElement);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    // Initialize nodes
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        // Fallback dimensions if unmounted or hidden
        const width = rect.width || window.innerWidth;
        const height = rect.height || window.innerHeight;

        const nodes = [];
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * movementSpeed,
                vy: (Math.random() - 0.5) * movementSpeed,
                baseSize: nodeSize,
                currentSize: nodeSize,
                active: false,
                activationTime: 0
            });
        }
        nodesRef.current = nodes;
    }, [nodeCount, nodeSize, movementSpeed]);

    // Create pulses
    const createPulse = () => {
        if (!showPulses || nodesRef.current.length < 2) return;

        const fromNode = nodesRef.current[Math.floor(Math.random() * nodesRef.current.length)];

        // Find connected nodes
        const connectedNodes = nodesRef.current.filter(node => {
            if (node === fromNode) return false;
            const dx = node.x - fromNode.x;
            const dy = node.y - fromNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < connectionDistance;
        });

        if (connectedNodes.length > 0) {
            const toNode = connectedNodes[Math.floor(Math.random() * connectedNodes.length)];
            const intensityMap = {
                subtle: 0.5,
                medium: 1,
                strong: 1.5,
                extreme: 2.5
            };

            pulsesRef.current.push({
                from: { x: fromNode.x, y: fromNode.y },
                to: { x: toNode.x, y: toNode.y },
                progress: 0,
                speed: 0.02 / pulseSpeed * intensityMap[pulseIntensity],
                fromNode,
                toNode
            });

            fromNode.active = true;
            fromNode.activationTime = Date.now();
        }
    };

    // Animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        let lastPulseTime = Date.now();
        const pulseInterval = 1000 / pulseSpeed;

        const animate = () => {
            const rect = canvas.getBoundingClientRect();
            // Ensure canvas buffer matches display size (responsive)
            if (canvas.width !== rect.width || canvas.height !== rect.height) {
                canvas.width = rect.width;
                canvas.height = rect.height;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            timeRef.current += 0.016 * animationSpeed;

            // Update nodes
            nodesRef.current.forEach((node, index) => {
                // Add wave effect
                if (waveEffect) {
                    const waveOffset = Math.sin(timeRef.current * waveSpeed + index * 0.5) * 2;
                    node.x += waveOffset * 0.1;
                    node.y += Math.cos(timeRef.current * waveSpeed + index * 0.3) * 0.1;
                }

                // Move nodes
                node.x += node.vx * animationSpeed;
                node.y += node.vy * animationSpeed;

                // Bounce off edges
                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

                // Mouse interaction
                if (mouseInteraction) {
                    const dx = mouseRef.current.x - node.x;
                    const dy = mouseRef.current.y - node.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouseRadius) {
                        const force = (mouseRadius - distance) / mouseRadius;
                        node.x -= (dx / distance) * force * 2;
                        node.y -= (dy / distance) * force * 2;
                    }
                }

                // Node activation decay
                if (node.active) {
                    const timeSinceActivation = Date.now() - node.activationTime;
                    if (timeSinceActivation > 500) {
                        node.active = false;
                    }
                    node.currentSize = node.baseSize + node.baseSize * 2 * (1 - timeSinceActivation / 500);
                } else {
                    node.currentSize = node.baseSize;
                }
            });

            // Draw connections
            ctx.strokeStyle = connectionColor;
            ctx.lineWidth = connectionWidth;

            nodesRef.current.forEach((node1, i) => {
                nodesRef.current.slice(i + 1).forEach(node2 => {
                    const dx = node2.x - node1.x;
                    const dy = node2.y - node1.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        const opacity = (1 - distance / connectionDistance) * connectionOpacity;
                        ctx.globalAlpha = opacity;
                        ctx.beginPath();
                        ctx.moveTo(node1.x, node1.y);
                        ctx.lineTo(node2.x, node2.y);
                        ctx.stroke();
                    }
                });
            });

            // Update and draw pulses
            pulsesRef.current = pulsesRef.current.filter(pulse => {
                pulse.progress += pulse.speed;
                if (pulse.progress >= 1) {
                    pulse.toNode.active = true;
                    pulse.toNode.activationTime = Date.now();
                    return false;
                }

                const x = pulse.from.x + (pulse.to.x - pulse.from.x) * pulse.progress;
                const y = pulse.from.y + (pulse.to.y - pulse.from.y) * pulse.progress;

                // Draw pulse
                ctx.globalAlpha = 1;
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, nodeSize * 3);
                gradient.addColorStop(0, nodeColor);
                gradient.addColorStop(1, "transparent");
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, nodeSize * 3, 0, Math.PI * 2);
                ctx.fill();
                return true;
            });

            // Create new pulses
            if (showPulses && Date.now() - lastPulseTime > pulseInterval) {
                createPulse();
                lastPulseTime = Date.now();
            }

            // Draw nodes
            nodesRef.current.forEach(node => {
                ctx.globalAlpha = nodeOpacity;

                if (glowEffect) {
                    const glowSize = node.active ? node.currentSize * 3 : node.currentSize * 1.5;
                    const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize);
                    gradient.addColorStop(0, nodeColor);
                    gradient.addColorStop(1, "transparent");
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.globalAlpha = nodeOpacity;
                ctx.fillStyle = nodeColor;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.currentSize, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.globalAlpha = 1;
            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [nodeCount, connectionDistance, nodeColor, connectionColor, nodeSize, connectionWidth, animationSpeed, pulseSpeed, mouseInteraction, mouseRadius, showPulses, pulseIntensity, nodeOpacity, connectionOpacity, movementSpeed, glowEffect, waveEffect, waveSpeed]);

    const handleMouseMove = (e) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        mouseRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            style={{
                width: "100%",
                height: "100%",
                backgroundColor: backgroundColor,
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: -1,
                overflow: "hidden"
            }}
            onMouseMove={handleMouseMove}
        >
            <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
        </motion.div>
    );
}
