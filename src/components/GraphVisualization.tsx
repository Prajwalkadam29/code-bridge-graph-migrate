
import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Node {
  id: string;
  type: 'source' | 'target' | 'transform';
  label: string;
  x?: number;
  y?: number;
}

interface Edge {
  source: string;
  target: string;
  highlighted?: boolean;
}

interface GraphVisualizationProps {
  nodes: Node[];
  edges: Edge[];
  onNodeClick?: (nodeId: string) => void;
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({ 
  nodes, 
  edges,
  onNodeClick 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Calculate positions in a layered layout
  useEffect(() => {
    if (!svgRef.current) return;
    
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    // Group nodes by type
    const sourceNodes = nodes.filter(n => n.type === 'source');
    const transformNodes = nodes.filter(n => n.type === 'transform');
    const targetNodes = nodes.filter(n => n.type === 'target');
    
    // Position nodes in columns
    const ySpacing = height / (Math.max(sourceNodes.length, targetNodes.length) + 1);
    
    sourceNodes.forEach((node, i) => {
      node.x = width * 0.2;
      node.y = (i + 1) * ySpacing;
    });
    
    transformNodes.forEach((node, i) => {
      node.x = width * 0.5;
      node.y = height / 2;
    });
    
    targetNodes.forEach((node, i) => {
      node.x = width * 0.8;
      node.y = (i + 1) * ySpacing;
    });
    
  }, [nodes, edges]);
  
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'source': return 'fill-graph-node-source';
      case 'target': return 'fill-graph-node-target';
      case 'transform': return 'fill-graph-node-transform';
      default: return 'fill-gray-400';
    }
  };
  
  const getNodePosition = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? { x: node.x || 0, y: node.y || 0 } : { x: 0, y: 0 };
  };

  return (
    <Card className="h-full">
      <CardContent className="p-0">
        <svg 
          ref={svgRef} 
          className="w-full h-full min-h-[500px] bg-graph-background"
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Draw edges first so they're behind nodes */}
          {edges.map((edge) => {
            const source = getNodePosition(edge.source);
            const target = getNodePosition(edge.target);
            
            return (
              <g key={`${edge.source}-${edge.target}`}>
                <path
                  d={`M ${source.x} ${source.y} C ${source.x + 100} ${source.y}, ${target.x - 100} ${target.y}, ${target.x} ${target.y}`}
                  stroke={edge.highlighted ? '#F472B6' : '#A5B4FC'}
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={edge.highlighted ? "0" : "5,5"}
                  className={edge.highlighted ? "animate-flow" : ""}
                />
                {edge.highlighted && (
                  <circle 
                    r="4" 
                    fill="#F472B6"
                    className="animate-pulse"
                  >
                    <animateMotion
                      path={`M ${source.x} ${source.y} C ${source.x + 100} ${source.y}, ${target.x - 100} ${target.y}, ${target.x} ${target.y}`}
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </animateMotion>
                )}
              </g>
            );
          })}
          
          {/* Draw nodes on top of edges */}
          {nodes.map((node) => (
            <g 
              key={node.id} 
              transform={`translate(${node.x || 0}, ${node.y || 0})`}
              onClick={() => onNodeClick && onNodeClick(node.id)}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <circle
                r={node.type === 'transform' ? 40 : 25}
                className={`${getNodeColor(node.type)} stroke-white stroke-2`}
              />
              <text
                textAnchor="middle"
                dy=".3em"
                className="fill-white text-xs font-medium select-none"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </CardContent>
    </Card>
  );
};

export default GraphVisualization;
