import React, { useState, useEffect } from 'react';
import { FiBookmark, FiExternalLink, FiGithub, FiTrash2 } from 'react-icons/fi';
import { userService } from '../../services/userService';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const UserSavedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      setLoading(true);
      const res = await userService.getSavedProjects();
      if (res.success) {
        setProjects(res.data);
      }
    } catch (err) {
      toast.error('Failed to load saved projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleRemove = async (id) => {
    try {
      const res = await userService.toggleBookmark(id);
      if (res.success) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
        toast.success('Removed from saved projects');
      }
    } catch (err) {
      toast.error('Failed to remove bookmark');
    }
  };

  if (loading) {
    return <LoadingSkeleton type="project" count={3} />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-card">
        <div className="flex items-center gap-2 text-indigo-500 font-mono text-xs uppercase tracking-widestTechnical font-semibold mb-1">
          <FiBookmark className="w-3.5 h-3.5" />
          SAVED PORTFOLIO WORK
        </div>
        <h1 className="text-2xl font-heading font-extrabold text-theme-text">
          Saved Projects
        </h1>
        <p className="text-xs sm:text-sm text-theme-textMuted mt-0.5">
          Quickly access your bookmarked portfolio projects and technical architecture details.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="p-16 text-center rounded-3xl border border-dashed border-theme-border bg-theme-surface space-y-4 shadow-card">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center mx-auto">
            <FiBookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-heading font-bold text-theme-text">
            No saved projects yet
          </h3>
          <p className="text-xs text-theme-textMuted max-w-sm mx-auto leading-relaxed">
            Click the bookmark icon on any project card in the public portfolio to keep it handy here.
          </p>
          <Link
            to="/#projects"
            className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold shadow-glowSm transition-all"
          >
            Browse Projects
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj._id}
              className="rounded-3xl border border-theme-border bg-theme-surface overflow-hidden shadow-card hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="h-44 w-full bg-theme-surfaceSecondary overflow-hidden">
                  <img
                    src={proj.image?.url}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-heading font-bold text-base text-theme-text group-hover:text-indigo-500 transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-theme-textMuted line-clamp-3 leading-relaxed">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-2">
                    {proj.tags?.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-theme-surfaceSecondary border border-theme-border text-theme-textMuted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-theme-border mt-3 pt-3">
                <div className="flex items-center gap-3">
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono font-bold text-indigo-500 hover:underline flex items-center gap-1"
                    >
                      <FiExternalLink className="w-3.5 h-3.5" />
                      Live App
                    </a>
                  )}
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono font-bold text-theme-textMuted hover:text-theme-text flex items-center gap-1"
                    >
                      <FiGithub className="w-3.5 h-3.5" />
                      Code
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(proj._id)}
                  className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white text-xs font-mono transition-colors"
                  title="Remove from saved"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSavedProjects;
