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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Saved Projects
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Quickly access your bookmarked portfolio projects and technical architecture details.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto">
            <FiBookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            No saved projects yet
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Click the bookmark icon on any project card in the public portfolio to keep it handy here.
          </p>
          <Link
            to="/#projects"
            className="inline-block px-5 py-2.5 rounded-xl bg-brand-500 text-white text-xs font-semibold shadow-glow"
          >
            Browse Projects
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj._id}
              className="rounded-3xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div>
                <img
                  src={proj.image?.url}
                  alt={proj.title}
                  className="w-full h-44 object-cover"
                />
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-2">
                    {proj.tags?.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-gray-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-100 dark:border-dark-border mt-3">
                <div className="flex items-center gap-3 pt-3">
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-brand-500 hover:underline flex items-center gap-1"
                    >
                      <FiExternalLink className="w-3.5 h-3.5" />
                      Live
                    </a>
                  )}
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-white flex items-center gap-1"
                    >
                      <FiGithub className="w-3.5 h-3.5" />
                      Code
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(proj._id)}
                  className="pt-3 text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1"
                  title="Remove from saved"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                  Remove
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
