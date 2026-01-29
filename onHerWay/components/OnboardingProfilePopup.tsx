import React, { useState } from 'react';
import { PublicProfile } from '../../types';
import { ProfileParticleBackground } from './ProfileParticleBackground';

interface OnboardingProfilePopupProps {
  profile: PublicProfile;
  onContinue: () => void;
}

export const OnboardingProfilePopup: React.FC<OnboardingProfilePopupProps> = ({ profile, onContinue }) => {
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [hoveredTimelineId, setHoveredTimelineId] = useState<string | null>(null);

  // Editable state
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedName, setEditedName] = useState(profile.name || 'momo');
  const [editedTags, setEditedTags] = useState<Record<string, string>>(profile.tags);
  const [editedTimeline, setEditedTimeline] = useState(profile.lifeTimeline);

  const tagEmojis: Record<string, string> = {
    role_detail: '👤',
    location: '📍',
    experience: '⭐',
    hassle: '😔',
    goal: '🎯',
  };

  const tagColors: Record<string, string> = {
    role_detail: 'bg-brand-blue/20 text-brand-blue border-brand-blue/30 hover:border-brand-blue',
    location: 'bg-green-400/20 text-green-400 border-green-400/30 hover:border-green-400',
    experience: 'bg-brand-yellow/20 text-brand-yellow border-brand-yellow/30 hover:border-brand-yellow',
    hassle: 'bg-brand-orange/20 text-brand-orange border-brand-orange/30 hover:border-brand-orange',
    goal: 'bg-nebula-pink/20 text-nebula-pink border-nebula-pink/30 hover:border-nebula-pink',
  };

  const handleAddTag = () => {
    const newKey = `custom_${Date.now()}`;
    setEditedTags({ ...editedTags, [newKey]: '新标签' });
    setEditingField(`tag_${newKey}`);
  };

  const handleAddTimelineNode = (afterId: string) => {
    const newNode = {
      id: `node_${Date.now()}`,
      year: new Date().getFullYear().toString(),
      title: '新节点',
      description: '点击编辑描述',
    };
    const index = editedTimeline.findIndex(node => node.id === afterId);
    const newTimeline = [...editedTimeline];
    newTimeline.splice(index + 1, 0, newNode);
    setEditedTimeline(newTimeline);
    setEditingField(`timeline_${newNode.id}_title`);
  };

  const handleUpdateTag = (key: string, value: string) => {
    setEditedTags({ ...editedTags, [key]: value });
  };

  const handleUpdateTimeline = (id: string, field: string, value: string) => {
    setEditedTimeline(editedTimeline.map(node =>
      node.id === id ? { ...node, [field]: value } : node
    ));
  };

  const handleDeleteTag = (key: string) => {
    const newTags = { ...editedTags };
    delete newTags[key];
    setEditedTags(newTags);
  };

  const handleDeleteTimelineNode = (id: string) => {
    setEditedTimeline(editedTimeline.filter(node => node.id !== id));
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-space-950">
      {/* Particle Background - Independent instance */}
      <ProfileParticleBackground />

      {/* Main Layout: Card on left/center, CTA on right */}
      <div className="absolute inset-0 z-[2] flex items-center justify-center p-4 animate-fade-in">
        {/* Profile Card - No scroll */}
        <div className="glass-panel border border-white/10 rounded-3xl shadow-2xl max-w-3xl w-full p-6 md:p-8">
          {/* Header + Avatar inline */}
          <div className="mb-6 pb-4 border-b border-white/5">
            <h2 className="text-2xl font-serif font-bold text-white tracking-wide">很高兴认识你！</h2>
            <p className="text-white/40 text-xs font-light mt-1">基于对话生成的个人档案，点击可修改</p>

            {/* Avatar + Name below header */}
            <div className="flex items-center gap-3 mt-4">
              <div className="relative group flex-shrink-0">
                <div className="absolute inset-[-3px] rounded-full border border-brand-orange/30 animate-[spin_10s_linear_infinite]"></div>
                <div className="w-12 h-12 rounded-full relative z-10 overflow-hidden border-2 border-white/20">
                  <img
                    src={profile.avatar}
                    alt={editedName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                {editingField === 'name' ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onBlur={() => setEditingField(null)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                    autoFocus
                    className="text-lg font-serif font-bold text-white bg-white/10 border border-white/20 rounded px-2 py-1 outline-none focus:border-brand-yellow"
                  />
                ) : (
                  <h3
                    className="text-lg font-serif font-bold text-white cursor-pointer hover:text-brand-yellow transition-colors"
                    onClick={() => setEditingField('name')}
                    title="点击修改昵称"
                  >
                    {editedName}
                  </h3>
                )}
                <p className="text-brand-blue/70 font-mono text-[9px] uppercase tracking-widest">EXPLORER</p>
              </div>
            </div>
          </div>

          {/* Content: Tags (Left 40%) + MY WAY Timeline (Right 60%) */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left: Tags - Word Cloud Style with theme colors */}
            <div className="md:w-[40%] space-y-3">
              <div className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold">身份标签</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(editedTags).map(([key, value]) => (
                  <div
                    key={key}
                    className={`relative px-3 py-1.5 rounded-full border text-sm cursor-pointer transition-all duration-200 ${tagColors[key] || 'bg-white/10 text-white/70 border-white/20 hover:border-white/50'} ${hoveredTag === key ? 'ring-2 ring-white/30 scale-105' : ''}`}
                    onMouseEnter={() => setHoveredTag(key)}
                    onMouseLeave={() => setHoveredTag(null)}
                    onClick={() => setEditingField(`tag_${key}`)}
                    title="点击修改"
                  >
                    {/* Delete button - appears on hover */}
                    {hoveredTag === key && editingField !== `tag_${key}` && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTag(key);
                        }}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                        title="删除标签"
                      >
                        ×
                      </button>
                    )}
                    {editingField === `tag_${key}` ? (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleUpdateTag(key, e.target.value)}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                        className="bg-transparent border-none outline-none w-20 text-center"
                      />
                    ) : (
                      <>
                        <span className="mr-1.5">{tagEmojis[key] || '🏷️'}</span>
                        <span>{value}</span>
                      </>
                    )}
                  </div>
                ))}
                {/* Add Tag Button */}
                <button
                  onClick={handleAddTag}
                  className="px-3 py-1.5 rounded-full border border-dashed border-white/20 text-white/40 text-sm hover:border-white/50 hover:text-white/70 transition-all duration-200 flex items-center gap-1"
                  title="添加标签"
                >
                  <span>+</span>
                </button>
              </div>
            </div>

            {/* Right: Timeline - MY WAY */}
            <div className="md:w-[60%] space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold">MY WAY</div>
                <span className="text-[9px] font-mono text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-full border border-brand-orange/20">
                  {editedTimeline.length} 节点
                </span>
              </div>

              <div className="ml-2">
                <div className="relative -ml-4 pl-14 pr-4 pt-3 pb-3 space-y-3 max-h-64 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

                  {editedTimeline.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="relative group"
                      onMouseEnter={() => setHoveredTimelineId(entry.id)}
                      onMouseLeave={() => setHoveredTimelineId(null)}
                    >
                      {/* Vertical line segment - connects this dot to next dot */}
                      {index < editedTimeline.length - 1 && (
                        <div
                          className="absolute w-0.5 bg-white/20"
                          style={{
                            left: 'calc(-40px + 8px - 1px)',
                            top: 'calc(12px + 6px)',
                            bottom: '-18px'
                          }}
                        ></div>
                      )}
                      {/* Dot */}
                      <div className="absolute -left-10 top-3 w-4 h-4 flex items-center justify-center z-10">
                        <div className={`w-3 h-3 rounded-full bg-space-950 border-2 transition-transform ${
                          index === 0 ? 'border-brand-yellow shadow-[0_0_10px_rgba(253,209,64,0.5)]' :
                          index === editedTimeline.length - 1 ? 'border-nebula-pink shadow-[0_0_10px_rgba(244,114,182,0.5)]' :
                          'border-brand-blue shadow-[0_0_10px_rgba(56,189,248,0.5)]'
                        } ${hoveredTimelineId === entry.id ? 'scale-150' : ''}`}></div>
                      </div>

                    {/* Content */}
                    <div className={`relative p-3 rounded-xl border glass-panel transition-all duration-300 ${
                      hoveredTimelineId === entry.id
                        ? 'bg-white/[0.04] border-white/20'
                        : 'border-white/5'
                    }`}>
                      {/* Action buttons - appears on hover */}
                      {hoveredTimelineId === entry.id && (
                        <div className="absolute -top-2 -right-2 flex items-center gap-1 z-20">
                          {/* Add button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddTimelineNode(entry.id);
                            }}
                            className="w-5 h-5 rounded-full bg-brand-yellow text-space-950 text-xs flex items-center justify-center hover:bg-brand-yellow/80 transition-colors shadow-lg"
                            title="在此后添加节点"
                          >
                            +
                          </button>
                          {/* Delete button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTimelineNode(entry.id);
                            }}
                            className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                            title="删除节点"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      {/* Year - Editable */}
                      <div className="flex items-center gap-2 mb-1">
                        {editingField === `timeline_${entry.id}_year` ? (
                          <input
                            type="text"
                            value={entry.year}
                            onChange={(e) => handleUpdateTimeline(entry.id, 'year', e.target.value)}
                            onBlur={() => setEditingField(null)}
                            onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                            autoFocus
                            className="text-[10px] font-mono text-white/50 bg-white/10 border border-white/20 rounded px-1 outline-none w-16"
                          />
                        ) : (
                          <span
                            className="text-[10px] font-mono text-white/50 cursor-pointer hover:text-white/80"
                            onClick={() => setEditingField(`timeline_${entry.id}_year`)}
                            title="点击修改日期"
                          >
                            {entry.year}
                          </span>
                        )}
                      </div>

                      {/* Title - Editable */}
                      {editingField === `timeline_${entry.id}_title` ? (
                        <input
                          type="text"
                          value={entry.title}
                          onChange={(e) => handleUpdateTimeline(entry.id, 'title', e.target.value)}
                          onBlur={() => setEditingField(null)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                          autoFocus
                          className="text-sm font-bold text-white bg-white/10 border border-white/20 rounded px-2 py-1 outline-none w-full mb-1 focus:border-brand-yellow"
                        />
                      ) : (
                        <h3
                          className={`text-sm font-bold mb-1 transition-colors cursor-pointer ${
                            hoveredTimelineId === entry.id ? 'text-brand-yellow' : 'text-white'
                          }`}
                          onClick={() => setEditingField(`timeline_${entry.id}_title`)}
                          title="点击修改标题"
                        >
                          {entry.title}
                        </h3>
                      )}

                      {/* Description - Editable */}
                      {editingField === `timeline_${entry.id}_description` ? (
                        <textarea
                          value={entry.description}
                          onChange={(e) => handleUpdateTimeline(entry.id, 'description', e.target.value)}
                          onBlur={() => setEditingField(null)}
                          autoFocus
                          className="text-xs text-gray-400 bg-white/10 border border-white/20 rounded px-2 py-1 outline-none w-full resize-none focus:border-brand-yellow"
                          rows={2}
                        />
                      ) : (
                        <p
                          className="text-xs text-gray-400 leading-relaxed font-light cursor-pointer hover:text-gray-300"
                          onClick={() => setEditingField(`timeline_${entry.id}_description`)}
                          title="点击修改描述"
                        >
                          {entry.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side CTA Button - Outside the card, on particle background */}
        <button
          onClick={onContinue}
          className="group ml-8 flex flex-col items-center gap-3 transition-all duration-300 hover:scale-110"
        >
          {/* Arrow - No circle by default, filled circle on hover */}
          <div className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-brand-yellow group-hover:shadow-[0_0_30px_rgba(253,209,64,0.4)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-brand-yellow group-hover:text-space-950 transition-colors duration-300"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
          {/* Yellow Label */}
          <span className="text-brand-yellow text-sm font-bold tracking-wider uppercase group-hover:animate-pulse">
            开始MY WAY
          </span>
        </button>
      </div>
    </div>
  );
};
