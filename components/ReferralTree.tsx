
import React from 'react';
import { ReferralTreeNode } from '../services/mockService';
import { User, Users, UserPlus, Zap } from 'lucide-react';

interface ReferralTreeProps {
  tree: ReferralTreeNode[];
  maxDirects?: number;
}

const TreeNode: React.FC<{ node: ReferralTreeNode; isLast: boolean; level: number }> = ({ node, isLast, level }) => {
  // Level-specific styles
  const levelStyles = {
    1: {
      avatarBg: 'bg-emerald-500 text-emerald-950',
      border: 'border-emerald-500/30',
      label: 'Direct Referral',
      icon: <User className="w-3 h-3" />,
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.1)]'
    },
    2: {
      avatarBg: 'bg-blue-500/20 text-blue-400',
      border: 'border-blue-500/20',
      label: 'Indirect Level 1',
      icon: <Users className="w-3 h-3" />,
      glow: ''
    },
    default: {
      avatarBg: 'bg-white/10 text-white/40',
      border: 'border-white/10',
      label: `Indirect Level ${level - 1}`,
      icon: <UserPlus className="w-3 h-3" />,
      glow: ''
    }
  };

  const currentStyle = levelStyles[level as keyof typeof levelStyles] || levelStyles.default;

  return (
    <div className="relative flex flex-col">
      <div className="flex items-center gap-4 py-4 group">
        {/* Connection lines */}
        <div className="relative w-10 flex-shrink-0 self-stretch">
          {/* Vertical line from parent */}
          <div className={`absolute top-0 bottom-0 left-0 w-[2px] ${isLast ? 'h-1/2' : 'h-full'} bg-gradient-to-b from-emerald-500/20 to-emerald-500/10`}></div>
          {/* Horizontal line to node */}
          <div className="absolute top-1/2 left-0 w-10 h-[2px] bg-emerald-500/20"></div>
          {/* Node connector dot */}
          <div className="absolute top-1/2 left-[-3px] w-2 h-2 rounded-full bg-emerald-500/40 transform -translate-y-1/2"></div>
        </div>

        {/* Node Card */}
        <div className={`flex-1 flex items-center gap-4 p-4 rounded-[1.25rem] bg-white/[0.03] border ${currentStyle.border} ${currentStyle.glow} hover:bg-white/[0.07] hover:border-emerald-500/40 hover:translate-x-1 transition-all duration-300 cursor-default group/card relative overflow-hidden`}>
          {/* Decorative background pulse for high-level nodes */}
          {level === 1 && (
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 animate-pulse"></div>
          )}

          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-xl relative z-10 transition-transform group-hover/card:scale-110 duration-300 ${currentStyle.avatarBg}`}>
            {node.username.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-2">
              <p className="font-black text-sm text-white group-hover/card:text-emerald-400 transition-colors">
                {node.username}
              </p>
              {level === 1 && (
                <div className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-[8px] font-black text-emerald-400 uppercase tracking-tighter flex items-center gap-1">
                  <Zap className="w-2 h-2 fill-emerald-400" /> TOP EARNER
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="p-1 rounded bg-white/5 text-emerald-400/40">
                {currentStyle.icon}
              </span>
              <p className="text-[10px] text-emerald-400/60 uppercase font-black tracking-[0.1em]">
                {currentStyle.label}
              </p>
            </div>
          </div>

          <div className="text-right opacity-0 group-hover/card:opacity-100 transition-opacity">
            <p className="text-[10px] text-white/20 font-mono">
              Joined {new Date(node.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Children Container */}
      {node.children && node.children.length > 0 && (
        <div className="ml-10">
          {node.children.map((child, idx) => (
            <TreeNode 
              key={child.id} 
              node={child} 
              isLast={idx === node.children.length - 1} 
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ReferralTree: React.FC<ReferralTreeProps> = ({ tree, maxDirects }) => {
  const displayTree = maxDirects ? tree.slice(0, maxDirects) : tree;

  return (
    <div className="space-y-0 px-2 py-4">
      {displayTree.length > 0 ? (
        displayTree.map((node, idx) => (
          <TreeNode 
            key={node.id} 
            node={node} 
            isLast={idx === displayTree.length - 1} 
            level={1} 
          />
        ))
      ) : (
        <div className="text-center py-10 opacity-20 italic">
          No connections found in this branch
        </div>
      )}
    </div>
  );
};

export default ReferralTree;
