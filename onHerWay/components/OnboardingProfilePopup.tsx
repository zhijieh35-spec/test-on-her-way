import React, { useState } from 'react';
import { PublicProfile } from '../../types';
import { ProfileParticleBackground } from './ProfileParticleBackground';

interface OnboardingProfilePopupProps {
  profile: PublicProfile;
  onContinue: () => void;
  isFromAI?: boolean;
  onRetry?: () => void;
}

export const OnboardingProfilePopup: React.FC<OnboardingProfilePopupProps> = ({ profile, onContinue, isFromAI = true, onRetry }) => {
  const [hoveredTimelineId, setHoveredTimelineId] = useState<string | null>(null);

  // Editable state
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedName, setEditedName] = useState(profile.name || 'momo');
  const [editedAvatarPrompt, setEditedAvatarPrompt] = useState(profile.avatarPrompt || 'EXPLORER');
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
    role_detail: 'bg-brand-blue/10 text-brand-blue border-brand-blue/20 hover:border-brand-blue/50',
    location: 'bg-green-400/10 text-green-400 border-green-400/20 hover:border-green-400/50',
    experience: 'bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20 hover:border-brand-yellow/50',
    hassle: 'bg-brand-orange/10 text-brand-orange border-brand-orange/20 hover:border-brand-orange/50',
    goal: 'bg-nebula-pink/10 text-nebula-pink border-nebula-pink/20 hover:border-nebula-pink/50',
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
    <div className="fixed inset-0 z-[100] overflow-hidden bg-space-950 flex items-center justify-center">
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        <ProfileParticleBackground />
      </div>

      {/* Wrapper for Card and Floating Elements */}
      <div className="relative z-10 w-full max-w-5xl h-[600px] animate-fade-in flex">

        {/* Main Card */}
        <div className="w-full h-full glass-panel border border-white/10 rounded-[40px] shadow-2xl flex overflow-hidden">

          {/* Left Column: Identity & Tags (40%) */}
          <div className="w-[40%] h-full p-8 md:p-10 border-r border-white/5 flex flex-col relative">
            {/* Header Area */}
            <div className="mb-8">
              <h2 className="text-3xl font-serif font-bold text-brand-yellow mb-2 tracking-wide">很高兴认识你！</h2>
              <div className="flex flex-wrap items-center gap-2 text-white/40 text-xs font-light leading-relaxed">
                <span>{isFromAI ? '基于对话生成的个人档案，点击可修改' : '你貌似没有接听电话，可以自定义个人信息或重新接听'}</span>
                {!isFromAI && onRetry && (
                   <button
                     onClick={onRetry}
                     className="text-brand-yellow/80 hover:text-brand-yellow border-b border-brand-yellow/30 hover:border-brand-yellow transition-all pb-0.5 ml-1"
                   >
                     重新接听
                   </button>
                )}
              </div>
            </div>

            {/* Avatar & Name */}
            <div className="flex items-center gap-6 mb-10">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border-2 border-white/20 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white/5">
                      <img
                          src={profile.avatar}
                          alt="Avatar"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                  </div>
                </div>
                {/* Icon removed as per feedback */}
              </div>

              <div className="flex-1">
                {editingField === 'name' ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedName(e.target.value)}
                    onBlur={() => setEditingField(null)}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && setEditingField(null)}
                    autoFocus
                    className="text-3xl font-serif font-bold text-white bg-transparent border-b border-white/20 outline-none w-full mb-1"
                  />
                ) : (
                  <h1
                    className="text-3xl font-serif font-bold text-white cursor-pointer hover:text-brand-yellow transition-colors mb-1"
                    onClick={() => setEditingField('name')}
                  >
                    {editedName}
                  </h1>
                )}

                {editingField === 'avatarPrompt' ? (
                  <input
                    type="text"
                    value={editedAvatarPrompt}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedAvatarPrompt(e.target.value)}
                    onBlur={() => setEditingField(null)}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && setEditingField(null)}
                    autoFocus
                    className="text-brand-blue/60 font-mono text-[10px] uppercase tracking-[0.3em] font-bold bg-transparent border-b border-white/20 outline-none w-full"
                  />
                ) : (
                  <div
                    className="text-brand-blue/60 font-mono text-[10px] uppercase tracking-[0.3em] font-bold cursor-pointer hover:text-brand-blue transition-colors"
                    onClick={() => setEditingField('avatarPrompt')}
                  >
                    {editedAvatarPrompt}
                  </div>
                )}
              </div>
            </div>

            {/* Tags Section */}
            <div
              className="flex-1 overflow-y-auto pr-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex items-center gap-2 mb-4">
                 <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse"></div>
                 <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">my tag</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(editedTags).map(([key, value]) => (
                  <div
                    key={key}
                    className={`relative px-3 py-2 rounded-xl border text-xs cursor-pointer transition-all duration-300 group ${tagColors[key] || 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'}`}
                    onClick={() => setEditingField(`tag_${key}`)}
                  >
                    {editingField === `tag_${key}` ? (
                       <input
                         type="text"
                         value={value}
                         onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateTag(key, e.target.value)}
                         onBlur={() => setEditingField(null)}
                         onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && setEditingField(null)}
                         onClick={(e: React.MouseEvent) => e.stopPropagation()}
                         autoFocus
                         className="bg-transparent border-none outline-none w-20 text-center"
                       />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>{tagEmojis[key] || '🏷️'}</span>
                        <span>{value}</span>
                      </div>
                    )}

                    {/* Delete button on hover */}
                    <button
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleDeleteTag(key);
                      }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500/80 text-white text-[10px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all hover:scale-110"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddTag}
                  className="px-3 py-2 rounded-xl border border-dashed border-white/10 text-white/20 text-xs hover:border-white/30 hover:text-white/50 transition-all flex items-center justify-center gap-1"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Timeline (60%) */}
          <div className="w-[60%] h-full bg-white/[0.02] p-8 md:p-10 relative">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse"></div>
                 <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">Timeline</span>
               </div>
               {/* Year component removed as per feedback */}
            </div>

            <div
              className="h-[calc(100%-40px)] overflow-y-auto pr-4 relative"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
               {/* Timeline Line */}
               <div className="absolute left-[19px] top-4 bottom-0 w-px bg-gradient-to-b from-brand-yellow/50 via-white/10 to-transparent"></div>

               <div className="space-y-6">
                 {editedTimeline.map((entry, index) => (
                   <div
                      key={entry.id}
                      className="relative pl-10 group"
                      onMouseEnter={() => setHoveredTimelineId(entry.id)}
                      onMouseLeave={() => setHoveredTimelineId(null)}
                   >
                      {/* Dot Marker */}
                      <div className={`absolute left-[15px] top-1.5 w-[9px] h-[9px] rounded-full border-2 transition-all duration-300 z-10 bg-space-950 ${
                          index === 0 ? 'border-brand-yellow shadow-[0_0_8px_rgba(253,209,64,0.6)]' :
                          hoveredTimelineId === entry.id ? 'border-brand-blue scale-125' : 'border-white/30'
                      }`}></div>

                      {/* Card Content */}
                      <div className={`p-4 rounded-2xl border transition-all duration-300 ${
                          hoveredTimelineId === entry.id
                            ? 'bg-white/[0.06] border-white/20 translate-x-1'
                            : 'bg-white/[0.02] border-white/5'
                      }`}>
                          {/* Hover Actions */}
                          <div className={`absolute -right-2 -top-2 flex gap-1 transition-opacity duration-200 ${hoveredTimelineId === entry.id ? 'opacity-100' : 'opacity-0'}`}>
                             <button onClick={() => handleAddTimelineNode(entry.id)} className="w-6 h-6 rounded-full bg-brand-blue text-space-950 flex items-center justify-center hover:scale-110 transition-transform shadow-lg z-20">+</button>
                             <button onClick={() => handleDeleteTimelineNode(entry.id)} className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg z-20">×</button>
                          </div>

                          {/* Year */}
                          <div className="mb-1">
                            {editingField === `timeline_${entry.id}_year` ? (
                              <input
                                value={entry.year}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateTimeline(entry.id, 'year', e.target.value)}
                                onBlur={() => setEditingField(null)}
                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && setEditingField(null)}
                                autoFocus
                                className="bg-transparent text-[10px] font-mono text-white/50 w-20 outline-none"
                              />
                            ) : (
                              <span
                                className="text-[10px] font-mono text-white/50 cursor-pointer hover:text-brand-yellow transition-colors"
                                onClick={() => setEditingField(`timeline_${entry.id}_year`)}
                              >
                                {entry.year}
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <div className="mb-2">
                             {editingField === `timeline_${entry.id}_title` ? (
                               <input
                                 value={entry.title}
                                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateTimeline(entry.id, 'title', e.target.value)}
                                 onBlur={() => setEditingField(null)}
                                 onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && setEditingField(null)}
                                 autoFocus
                                 className="bg-transparent text-lg font-bold text-white w-full outline-none border-b border-white/20"
                               />
                             ) : (
                               <h3
                                 className="text-lg font-bold text-white cursor-pointer hover:text-brand-yellow transition-colors"
                                 onClick={() => setEditingField(`timeline_${entry.id}_title`)}
                               >
                                 {entry.title}
                               </h3>
                             )}
                          </div>

                          {/* Description */}
                          <div>
                            {editingField === `timeline_${entry.id}_description` ? (
                               <textarea
                                 value={entry.description}
                                 onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleUpdateTimeline(entry.id, 'description', e.target.value)}
                                 onBlur={() => setEditingField(null)}
                                 autoFocus
                                 className="bg-transparent text-sm text-gray-400 w-full outline-none resize-none h-16 border border-white/10 rounded p-1"
                               />
                             ) : (
                               <p
                                 className="text-sm text-gray-400 font-light leading-relaxed cursor-pointer hover:text-gray-300"
                                 onClick={() => setEditingField(`timeline_${entry.id}_description`)}
                               >
                                 {entry.description}
                               </p>
                             )}
                          </div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* Confirmation Floating Button - Outside the card, aligned relative to the wrapper */}
        <div className="absolute -top-6 -right-6 z-50">
             <button
               onClick={onContinue}
               className="group relative w-20 h-20 rounded-full bg-brand-yellow shadow-[0_0_40px_rgba(253,209,64,0.3)] flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-[0_0_60px_rgba(253,209,64,0.5)] border-4 border-space-950"
             >
                <svg
                  className="w-10 h-10 text-space-950 transition-transform duration-300 group-hover:rotate-12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                   <polyline points="20 6 9 17 4 12" />
                </svg>

                {/* Tooltip hint */}
                <div className="absolute top-full mt-4 bg-white/10 backdrop-blur text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                   确认开启旅程
                </div>
             </button>
        </div>
      </div>
    </div>
  );
};
